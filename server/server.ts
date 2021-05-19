const express = require('express');
const path = require('path');
const app = express();

const monitors = require('./redis-monitors/redis-monitors');
const connectionsRouter = require('./routes/connectionsRouter');
const PORT = +process.env.PORT || 3000;

//connections routes
app.use('/api/connections', connectionsRouter);
//events routes
app.use('/api/events, eventsRouter');

//Sample route for fetching events (not production ready)
// app.get('/api/events', (req, res) => {
//   const eventLog = monitors[0].keyspaces[0].eventLog;

//   const log = []
//   let currentNode = eventLog.head;
//   while (currentNode) {
//     log.push({
//       key: currentNode.key,
//       event: currentNode.event,
//       timestamp: currentNode.timestamp
//     })
//     currentNode = currentNode.next
//   }

//   res.status(200).json(log);
// })

app.get('/', (req, res): void => {
  res.status(200).sendFile(path.resolve(__dirname, './assets/index.html'));
})

app.use((err, req, res, next) => {

  const defaultErr = {
    log: 'Unknown Express middleware occured',
    status: 500,
    message: { error: 'Oops, something went wrong!' }
  };
  err = Object.assign(defaultErr, err);
  res.status(defaultErr.status).json(defaultErr.message);
})

app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}`);
});

export default app;