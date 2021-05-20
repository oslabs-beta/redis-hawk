import { Router } from 'express';
const keyspacesController = require('../controllers/keyspacesController');

const keyspacesRouter = Router();

keyspacesRouter.get('/', 
  keyspacesController.getAllInstancesKeyspaces, 
  (req, res) => {
    res.status(200).json({data: res.locals.data});
});

keyspacesRouter.get('/:instanceId',
  keyspacesController.getAllKeyspacesForInstance, 
  (req, res) => {
    res.status(200).json({data: res.locals.data});
})

keyspacesRouter.get('/:instanceId/:dbIndex',
  keyspacesController.getKeyspaceForInstance, 
  (req, res) => {
    res.status(200).json({data: res.locals.data});
})

module.exports = keyspacesRouter;