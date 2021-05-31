import express from 'express';
import connectionsController from '../controllers/connectionsController';

const router = express.Router();

router.get('/', 
  connectionsController.getAllConnections, 
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(200).json(res.locals.connections);
});

export default router;