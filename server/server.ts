const express = require('express');
const path = require('path');
const app = express();

const monitors = require('./redis-monitors/redis-monitors');
const connectionsRouter = require('./routes/connectionsRouter');
const eventsRouter = require('./routes/eventsRouter');
const keyspacesRouter = require('./routes/keyspacesRouter');

const PORT = +process.env.PORT || 3000;

//connections routes
app.use('/api/connections', connectionsRouter);
//events routes
app.use('/api/events', eventsRouter);

app.use('/api/histories', historiesRouter);

app.use('/api/keyspaces', keyspacesRouter);

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