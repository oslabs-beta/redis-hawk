import express from "express";
import path from "path";
const app = express();

import connectionsRouter from './routers/connectionsRouter';
import eventsRouter from './routers/eventsRouter';
import keyspacesRouter from './routers/keyspacesRouter';

const PORT = +process.env.PORT || 3000;

app.use('/api/connections', connectionsRouter);
app.use('/api/v2/events', eventsRouter);
app.use('/api/v2/keyspaces', keyspacesRouter);

app.get('/dist/bundle.js', (req: express.Request, res: express.Response): void => {
  res.status(200).sendFile(path.resolve(__dirname, '../bundle.js'));
})

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

