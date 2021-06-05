import express from 'express';
import keyspacesController from '../controllers/keyspacesController';
import monitorsController from '../controllers/monitorsController'

const router = express.Router();

router.get('/',
  monitorsController.findAllMonitors,
  keyspacesController.refreshKeyspace,
  keyspacesController.getKeyspacePages,
  (req: express.Request, res: express.Response): void => {
    res.status(200).json(res.locals.keyspaces)
  }
);

router.get('/:instanceId',
  monitorsController.findSingleMonitor,
  keyspacesController.refreshKeyspace,
  keyspacesController.getKeyspacePages,
  (req: express.Request, res: express.Response): void => {
    res.status(200).json(res.locals.keyspaces)
  }
);


router.get('/:instanceId/:dbIndex',
  monitorsController.findSingleMonitor,
  keyspacesController.refreshKeyspace,
  keyspacesController.getKeyspacePages,
  (req: express.Request, res: express.Response): void => {
    res.status(200).json(res.locals.keyspaces);
});

router.get('/histories/:instanceId/:dbIndex',
  monitorsController.findSingleMonitor,
  keyspacesController.getKeyspaceHistories,
  (req: express.Request, res: express.Response): void => {
    res.status(200).json(res.locals.histories);
});

export default router;