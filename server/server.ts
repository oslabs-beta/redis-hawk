import express from "express";
import path from "path";
const app = express();

import connectionsRouter from './routers/connectionsRouter';
import eventsRouter from './routers/eventsRouter';
import eventsRouterv2 from './routers/eventsRouter-v2';
import keyspacesRouter from './routers/keyspacesRouter';
import keyspacesRouterv2 from './routers/keyspacesRouter-v2';

const PORT = +process.env.PORT || 3000;

//connections routes
app.use('/api/connections', connectionsRouter);
//events routes
app.use('/api/events', eventsRouter);
app.use('/api/v2/events', eventsRouterv2);

// app.use('/api/histories', historiesRouter);

app.use('/api/keyspaces', keyspacesRouter);
app.use('/api/v2/keyspaces', keyspacesRouterv2);

app.get('/', (req: express.Request, res: express.Response): void => {
  res.status(200).sendFile(path.resolve(__dirname, "./assets/index.html"));
});

app.use('*', (req: express.Request, res: express.Response): void => {
  res.sendStatus(404);
})

interface GlobalError {
  log: string;
  status?: number;
  message?: {
    error: string;
  };
}

app.use(
  (
    err: GlobalError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    
    const defaultErr = {
      log: "Unknown Express middleware occured",
      status: 500,
      message: { error: "Oops, something went wrong!" },
    };

    err = Object.assign(defaultErr, err);
    console.log(`Server error encountered: ${err.log}`);
    res.status(defaultErr.status).json(defaultErr.message);
  }
);

export default app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}`);
});

