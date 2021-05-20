import { Router } from 'express';
const keyspacesController = require('../controllers/keyspacesController');

const keyspacesRouter = Router();

keyspacesRouter.get('/', 
  keyspacesController.getKeyspace, 
  (req, res) => {
    res.status(200).json({data: res.locals.data});
});

// keyspacesRouter.get('/:instanceId',
//   keyspacesController.getKeyspace, 
//   (req, res) => {
//     res.status(200).json({data: res.locals.data});
// })

module.exports = keyspacesRouter;