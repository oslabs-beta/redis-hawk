const express = require('express');
const app = express();

const monitors = require('./redis-monitors/redis-monitors');
const PORT = +process.env.PORT || 3000;


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

module.exports = app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}`);
});