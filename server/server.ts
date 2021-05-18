const express = require('express');
const app = express();

const monitors = require('./redis-monitors/redis-monitors');
const connectionsRouter = require('./routes/connectionsRouter');
const PORT = +process.env.PORT || 3000;

//connections routes
app.use('/api/connections', connectionsRouter);


//Sample route for fetching events (not production ready)
app.get('/api/events', (req, res) => {
  const eventLog = monitors[0].keyspaces[0].eventLog;

  const log = []
  let currentNode = eventLog.head;
  while (currentNode) {
    log.push({
      key: currentNode.key,
      event: currentNode.event,
      timestamp: currentNode.timestamp
    })
    currentNode = currentNode.next
  }

  res.status(200).json(log);
})

app.get('/', (req, res): void => {
  res.status(200).sendFile('../index.html');
})

app.use((err, req, res, next) => {

  const defaultErr = {
    log: 'Unknown Express middleware occured',
    status: 500,
    message: { error: 'Oops, something went wrong!' }
  };

  //err: {log: 'Could not read connetions from RedisMonitor'}
  err = Object.assign(defaultErr, err);

  /*
  err: {
    log: 'Could not read connections from Redis Monitor',
    status: 500,
    message: {error: 'Oops, something went wrong!'}
  }
  */

  console.log(defaultErr.log);
  res.status(defaultErr.status).json(defaultErr.message);

})

app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;