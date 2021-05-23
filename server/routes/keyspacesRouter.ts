import { Router } from 'express';
import keyspacesController from '../controllers/keyspacesController';

const router = Router();

router.get('/', 
  keyspacesController.getAllInstancesKeyspaces, 
  (req, res) => {
    res.status(200).json({data: res.locals.data});
});

router.get('/:instanceId',
  keyspacesController.getAllKeyspacesForInstance, 
  (req, res) => {
    res.status(200).json({data: res.locals.data});
})

router.get('/:instanceId/:dbIndex',
  keyspacesController.getKeyspaceForInstance, 
  (req, res) => {
    res.status(200).json({data: res.locals.data});
})

export default router;