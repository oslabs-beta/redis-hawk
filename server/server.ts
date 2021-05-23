import express from 'express';
import * as path from 'path';
const app = express();

import connectionsRouter from './routes/connectionsRouter';
import eventsRouter from './routes/eventsRouter';
import keyspacesRouter from './routes/keyspacesRouter';

const PORT = +process.env.PORT || 3000;

//connections routes
app.use('/api/connections', connectionsRouter);
//events routes
app.use('/api/events', eventsRouter);

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