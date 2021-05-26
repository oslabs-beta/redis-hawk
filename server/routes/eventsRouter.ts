import Router from 'express';
import redisMonitors from '../redis-monitors/redis-monitors';

const router = Router();

router.get('/', (req, res, next) => {
  //set const body = {data: []}
  const body = { data: [] };
  //if not, then loop through eventsMonitors 
  redisMonitors.forEach(monitor => {
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
      instance.keyspaces.push(keyspace.eventLog.returnLogAsArray((+eventTotal) ? +eventTotal : 0))
    })
    //push instance object into body.data
    body.data.push(instance)
  })
  //res.send jsonified body.data
  res.status(200).json(body);
});

router.get('/:instanceId/', (req, res, next) => {
  //set const body = {data: []}
  const body = { data: [] };
  const { instanceId } = req.params
  //find monitor based on instanceId
  const monitor = redisMonitors.find(m => {
    return m.instanceId === +instanceId;
  });
  //initialize object instance as in previous section
  const instance = {
    instanceId: monitor.instanceId,
    keyspaces: []
  };
  //loop through monitor.keyspaces array
  monitor.keyspaces.forEach(keyspace => {
    //grab keyspace.eventLog, convert into array and push into instance.keyspaces
    const { eventTotal } = req.query;
    instance.keyspaces.push(keyspace.eventLog.returnLogAsArray((+eventTotal) ? +eventTotal : 0))
  });
  
  body.data.push(instance);
  //res.send jsonified body.data
  res.status(200).json(body);
});

router.get('/:instanceId/:dbIndex', (req, res, next) => {
  //set const body = {data: []}
  const body = { data: [] };
  const { instanceId, dbIndex } = req.params
  //find monitor based on instanceId
  const monitor = redisMonitors.find(m => {
    return m.instanceId === +instanceId;
  });
  //initialize object instance as in previous section
  const instance = {
    instanceId: monitor.instanceId,
    keyspaces: []
  };
  //grab keyspace.eventLog, convert into array and push into instance.keyspaces
  const { eventTotal } = req.query;
  instance.keyspaces.push(monitor.keyspaces[dbIndex].eventLog.returnLogAsArray((eventTotal) ? eventTotal : 0))
  body.data.push(instance);
  //res.send jsonified body.data
  res.status(200).json(body);
});

export default router;