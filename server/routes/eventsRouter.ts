const express = require('express');
const router = express.Router();

const redisMonitors = require('../redis-monitors/redis-monitors');

/*
  DON'T THINK I'M CALLING returnLogAsArray CORRECTLY.  I'M USING KEYSPACE.EVENTLOG AS THE 
  ARGUMENT, BUT I'M NOT ACCOUNTING FOR WHEN A USER INCLUDES req.query.eventTotalIdx.
  I SUSPECT I NEED TO ADD A PARAMETER TO THE METHOD BUT AM NOT CERTAIN.
*/

router.get('/:instanceId/:dbIndex', (req, res, next) => {
  const { instanceId, dbIndex } = req.params
  //set const body = {data: []}
  const body = { data: [] };

  //check if the instanceId is defined
  if (instanceId === undefined) {
    //if not, then loop through redisMonitors 
    redisMontitors.forEach(monitor => {
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
        instance.keyspaces.push(redisMonitors.eventLog.returnLogAsArray(keyspace.eventLog))
      })
      //push instance object into body.data
      body.data.push(instance)
    })
  };

  //check if instanceId is defined and dbIndex is not
  if (instanceId !== undefined && dbIndex === undefined) {
    //if so, iterate through all monitors at that instanceId
    redisMonitors[instanceId].forEach(monitor => {
      //initialize object instance as in previous section
      const instance = {
        instanceId: monitor.instanceId,
        keyspaces: []
      };
      //loop through monitor.keyspaces array
      monitor.keyspaces.forEach(keyspace => {
        //grab keyspace.eventLog, convert into array and push into instance.keyspaces
        instance.keyspaces.push(redisMonitors.eventLog.returnLogAsArray(keyspace.eventLog))
      });
    })
    body.data.push(instance);
  }

  //confirm that instanceId and dbIndex are both provided
  if (dbIndex !== undefined) {
    //if so, find monitor based on instanceId
    const monitor = redisMonitors.find(m => m.instanceId === instanceId);
    //initialize object instance as in previous section
    const instance = {
      instanceId: monitor.instanceId,
      keyspaces: []
    };
    //loop through monitor.keyspaces array
    monitor.keyspaces.forEach(keyspace => {
      //grab keyspace.eventLog, convert into array and push into instance.keyspaces
      instance.keyspaces.push(redisMonitors.eventLog.returnLogAsArray(keyspace.eventLog))
    });
    body.data.push(instance);
  }

  //res.send jsonified body.data
  res.send(200).json(body.data)
});

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