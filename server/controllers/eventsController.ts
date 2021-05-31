import { RequestHandler } from 'express';
import type { EventDetails } from './interfaces';
import type { NextFunction } from 'express';

import type { EventLog, KeyspaceEventNode } from '../redis-monitors/models/interfaces';
interface EventsController {
  refreshEventLog: RequestHandler;
  getEventsPages: RequestHandler;
  validateRequestType: RequestHandler;
  getEventsByTimeInterval: RequestHandler;
  getSingleEventsTotal: RequestHandler;
};

const eventsController: EventsController = {


  refreshEventLog: (req, res, next): void => {
  /* 
    Refreshes the Event Log snapshot each monitored keyspace of the RedisMonitors process, 
    if the refreshScan query parameter is 1 or not defined.
      - Converts the event log linked list to an array
      - Stores the array log for the monitored keyspace.
  */

    const { refreshData } = req.query;

    //Skip middleware if a refresh is not required
    if (refreshData === '0') return next();

    //Handle invalid parameter value; if refreshData is undefined, the default behavior is to refresh
    if (refreshData !== '1' && refreshData !== undefined) return next({
      log: 'Request included invalid refreshData query parameter',
      status: 400,
      message: {err: 'Please provide a valid refreshData value: 1 or 0'}
    });

    const dbIndex = +req.params.dbIndex
    if (dbIndex >= 0) { //Refresh event log snapshot for this specific keyspace
     const keyspace = res.locals.monitors[0].keyspaces[dbIndex];
      keyspace.eventLogSnapshot = keyspace.eventLog.returnLogAsArray();
    } else { //Refresh event log snapshot for all keyspaces for monitor(s)

      for (const monitor of res.locals.monitors) {
        let idx = 0;
        for (const keyspace of monitor.keyspaces) {
          keyspace.eventLogSnapshot = keyspace.eventLog.returnLogAsArray();
          idx += 1
        }
      }
    }

    return next();
  },

  getEventsPages: (req, res, next): void => {
  /* Based on any pagination and filter parameters,
    - Identify the eventLogSnapshot for any necessary keyspace(s)
    - Filter the eventLogSnapshot based on any filter parameters
    - Return the proper subset of the eventLogSnapshot based on pagination parameters
    - Constructs the proper response body
  */

    const { keynameFilter, eventTypeFilter, pageNum, pageSize } = req.query;

    let validatedPageNum = pageNum ? +pageNum : 1;
    let validatedPageSize = pageSize ? +pageSize : 5;

    const getPaginatedEventsData = (eventLogSnapshot: EventDetails[]): [number, EventDetails[]] => {
    //Helper function for filtering and indexing the keyspaceSnapshot

      if (keynameFilter) {
        eventLogSnapshot = eventLogSnapshot.filter((eventDetails: EventDetails): boolean => {
          return eventDetails.key.includes(keynameFilter.toString());
        });
      }

      if (eventTypeFilter) {
        eventLogSnapshot = eventLogSnapshot.filter((eventDetails: EventDetails): boolean => {
          return eventDetails.event === eventTypeFilter.toString();
        });
      }

      const eventTotal = eventLogSnapshot.length;

      const startIndex = ((validatedPageNum - 1) * validatedPageSize);
      const endIndex = validatedPageNum * validatedPageSize;

      return [ eventTotal, eventLogSnapshot.slice(startIndex, endIndex)];
    };

    const dbIndex = +req.params.dbIndex;
    if (dbIndex >= 0) {

      const monitor = res.locals.monitors[0];
      const [ eventTotal, paginatedData ] = getPaginatedEventsData(monitor.keyspaces[dbIndex].eventLogSnapshot);
      res.locals.events = {
        eventTotal: eventTotal,
        pageSize: validatedPageSize,
        pageNum: validatedPageNum,
        data: paginatedData
      }
    } else {

      const eventsResponse = {data: []};
      for (const monitor of res.locals.monitors) {

        const eventsData = [];

        let idx = 0;
        for (const keyspace of monitor.keyspaces) {
          const [ eventTotal, paginatedData ] = getPaginatedEventsData(keyspace.eventLogSnapshot);
          eventsData.push({
            eventTotal: eventTotal,
            pageSize: validatedPageSize,
            pageNum: validatedPageNum,
            data: paginatedData
          })
          idx += 1;
        }

        eventsResponse.data.push({
          instanceId: monitor.instanceId,
          keyspaces: eventsData
        });
      }

      res.locals.events = eventsResponse;
    } 

    return next();
  },

  validateRequestType: (req, res, next): void => {
  /*
    Checks if either a timeInterval or eventTotal query parameter is specified.
    Send a 400 response if not.
  */



    if ((req.query.timeInterval && req.query.eventTotal)
         || (!req.query.timeInterval && !req.query.eventTotal)) {
  
      //Invoke error handler since neither is defined or both are definedw
      return next({
        log: 'Request did not provide valid timeInterval or eventTotal query parameters',
        status: 400,
        message: {err: 'Please make sure to pass either the timeInterval or eventTotal query parameter, but not both'}
      });
    }

    return next();
  },

  getEventsByTimeInterval: (req, res, next): void => {
  /*
    For a given keyspace,
    aggregates event counts by a timeInterval specified via the timeInterval query parameter.

    Constructs the proper response body once aggregation is complete.
  */

    const dbIndex = +req.params.dbIndex;
    const eventLog: EventLog = res.locals.monitors[0].keyspaces[dbIndex].eventLog;
    const timeInterval = +req.query.timeInterval;

    if (req.query.timeInterval && isNaN(timeInterval)) return next({
      log: 'Client provided an invalid timeInterval query parameter value',
      status: 400,
      message: {err: 'Please provide a valid timeInterval value - a positive integer'}
    });

    const responseData = {
      eventTotal: eventLog.eventTotal,
      eventTotals: []
    }

    let intervalData = {
      start_time: Date.now() - timeInterval,
      end_time: Date.now(),
      eventCount: 0
    }

    let current: KeyspaceEventNode = eventLog.tail;
    const keynameFilter: string = req.query.keynameFilter ? req.query.keynameFilter.toString() : '';
    const eventTypeFilters: string[] = req.query.eventTypes ? req.query.eventTypes.toString().split(',') : [];

    //Traverse event log from tail to head, incrementing the eventCount of an aggregation interval
    //As long as the event meets filter criteria
    while (current) {

      //If the event is out of bounds of the current aggregation interval, create a new "preceding" aggregation time interval
      while (current.timestamp < intervalData.start_time) {
        responseData.eventTotals.push(intervalData);
        intervalData = {
          start_time: intervalData.start_time - timeInterval,
          end_time: intervalData.start_time,
          eventCount: 0
        };
      }

      if (eventTypeFilters.length === 0) {
        if (current.key.includes(keynameFilter)) intervalData.eventCount += 1;
      } else if (current.key.includes(keynameFilter) && eventTypeFilters.includes(current.event)) {
        intervalData.eventCount += 1;
      }

      current = current.previous;
    }

    responseData.eventTotals.push(intervalData);
    res.locals.eventTotals = responseData;

    return next();

  },

  getSingleEventsTotal: (req, res, next): void => {
  /*
    Determines the difference between the total number of events tracked by the EventLog
    for a given keyspace and the number of events the client is aware of.

    Then, constructs a proper response body.
  */

    const dbIndex = +req.params.dbIndex;
    const eventLog: EventLog = res.locals.monitors[0].keyspaces[dbIndex].eventLog;

    const eventTotalParam = +req.query.eventTotal;

    //Validate the eventTotal query parameter
    if (eventTotalParam > eventLog.eventTotal
      || (eventTotalParam && isNaN(eventTotalParam))) {
        return next({
          log: 'Client provided an invalid eventTotal query parameter value',
          status: 400,
          message: {err: 'Please provide an valid eventTotal query parameter; utilize a value obtained from a previous response'}
        })
      }

    //Traverse backwards through the event log until we've reached the event the client is aware of
    //Only aggregate event counts for events that meet filter criteria
    let eventCountToTraverse = eventLog.eventTotal - eventTotalParam;
    let eventCount = 0;
    let current: KeyspaceEventNode = eventLog.tail;
    const keynameFilter: string = req.query.keynameFilter ? req.query.keynameFilter.toString() : '';
    const eventTypeFilters: string[] = req.query.eventTypes ? req.query.eventTypes.toString().split(',') : [];

    while (eventCountToTraverse > 0) {

      if (eventTypeFilters.length === 0) {
        if (current.key.includes(keynameFilter)) eventCount += 1;
      } else if (current.key.includes(keynameFilter) && eventTypeFilters.includes(current.event)) {
        eventCount += 1;
      }
      
      current = current.previous;
      eventCountToTraverse -= 1
    }

    res.locals.eventTotals = {
      eventTotal: eventLog.eventTotal,
      eventTotals: [{
        end_time: Date.now(),
        eventCount: eventCount
      }]
    }

    return next();
  }
};

export default eventsController;