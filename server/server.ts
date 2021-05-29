import express from "express";
import path from "path";
const app = express();

import connectionsRouter from "./routes/connectionsRouter";
import eventsRouter from "./routes/eventsRouter";
import keyspacesRouter from "./routes/keyspacesRouter";

const PORT = +process.env.PORT || 3000;

//connections routes
app.use("/api/connections", connectionsRouter);
//events routes
app.use("/api/events", eventsRouter);

// app.use('/api/histories', historiesRouter);

app.use("/api/keyspaces", keyspacesRouter);

app.get("/", (req: express.Request, res: express.Response): void => {
  res.status(200).sendFile(path.resolve(__dirname, "./assets/index.html"));
});

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
    res.status(defaultErr.status).json(defaultErr.message);
  }
);

export default app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}`);
});

