const express = require('express');
const eventsRouter = express.Router();

const eventsMonitors = require('../redis-monitors/redis-monitors');

/*
  DON'T THINK I'M CALLING returnLogAsArray CORRECTLY.  I'M USING KEYSPACE.EVENTLOG AS THE 
  ARGUMENT, BUT I'M NOT ACCOUNTING FOR WHEN A USER INCLUDES req.query.eventTotalIdx.
  I SUSPECT I NEED TO ADD A PARAMETER TO THE METHOD BUT AM NOT CERTAIN.
*/

eventsRouter.get('/:instanceId/:dbIndex', (req, res, next) => {
  const { instanceId, dbIndex } = req.params
  //set const body = {data: []}
  const body = { data: [] };
  console.log('got in')
  //check if the instanceId is defined
  if (instanceId === undefined) {
    //if not, then loop through eventsMonitors 
    eventsMonitors.forEach(monitor => {
      //for each monitor, create a new object "instance" (to be put in the response.body)
      const instance = {
        //instance.instanceId = monitor.instanceId 
        instanceId: monitor.instanceId,
        //instance.keyspaces = [];
        keyspaces: []
      };
      //loop through monitor.keyspaces array
      monitor.keyspaces.forEach(keyspace => {
        //for each keyspace, grab keyspace.eventLog, convert into array using returnLogAsArray and push into instance.keyspaces
        //check if req.query.eventTotal != undefined, if so use as argument for returnLogAsArray
        const { eventTotal } = req.query;
        instance.keyspaces.push(eventsMonitors.eventLog.returnLogAsArray(eventTotal ? eventTotal : 0))
      })
      //push instance object into body.data
      body.data.push(instance)
    })
  };

  //check if instanceId is defined and dbIndex is not
  if (instanceId !== undefined && dbIndex === undefined) {
    //if so, iterate through all monitors at that instanceId
    eventsMonitors[instanceId].forEach(monitor => {
      //initialize object instance as in previous section
      const instance = {
        instanceId: monitor.instanceId,
        keyspaces: []
      };
      //loop through monitor.keyspaces array
      monitor.keyspaces.forEach(keyspace => {
        //grab keyspace.eventLog, convert into array and push into instance.keyspaces
        instance.keyspaces.push(eventsMonitors.eventLog.returnLogAsArray(keyspace.eventLog))
      });
      body.data.push(instance);
    })
  }

  //confirm that instanceId and dbIndex are both provided
  if (dbIndex !== undefined) {
    //if so, find monitor based on instanceId
    const monitor = eventsMonitors.find(m => {
      console.log(instanceId)
      console.log(m.instanceId)
      return m.instanceId === +instanceId;
    });

    console.log(monitor)
    //initialize object instance as in previous section
    const instance = {
      instanceId: monitor.instanceId,
      keyspaces: []
    };

    console.log("got into keyspaces loop")
    //grab keyspace.eventLog, convert into array and push into instance.keyspaces
    const { eventTotal } = req.query;
    console.log("eventTotal:  " + eventTotal)
    instance.keyspaces.push(monitor.keyspaces[dbIndex].eventLog.returnLogAsArray((eventTotal) ? eventTotal : 0))
    console.log("instance: " + instance)

    console.log("got to body.data.push")
    body.data.push(instance);
  }

  //res.send jsonified body.data
  console.log('got to res statment')
  res.status(200).json(body);
});

module.exports = eventsRouter;

// data: [(array of Instances)
//   {
//     instanceId: number,
//     keyspaces: [(array of Keyspaces)
//     [(array of events)
//     {
//       key: string,
//       event: string,
//       timestamp: Date
//     }
//     ],
//     [...events for another keyspace]
//     ]
//     },
//   {
//     instanceId: number,
//       keyspaces: [..etc]
//   }
// ]