import express from 'express';
import keyspacesController from '../controllers/keyspacesController';

const router = express.Router();

router.get('/', 
  keyspacesController.findAllMonitors,
  keyspacesController.getKeyspacesForInstance, 
  (req: express.Request, res: express.Response) => {
    res.status(200).json(res.locals.keyspaces);
});

router.get('/:instanceId',
  keyspacesController.findSingleMonitor,
  keyspacesController.getKeyspacesForInstance,
  (req: express.Request, res: express.Response) => {
    res.status(200).json(res.locals.keyspaces);
})

router.get('/:instanceId/:dbIndex',
keyspacesController.findSingleMonitor,
keyspacesController.getKeyspacesForInstance, 
  (req: express.Request, res: express.Response) => {
    res.status(200).json(res.locals.keyspaces);
})

export default router;