import { RequestHandler } from 'express';
import type { EventDetails } from './interfaces';
interface EventsController {
  refreshEventLog: RequestHandler;
  getEventsPages: RequestHandler
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
  }

};

export default eventsController;