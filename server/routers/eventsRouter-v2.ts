import express from 'express';
import monitorsController from '../controllers/monitorsController';
import eventsController from '../controllers/eventsController';

const router = express.Router();

router.get('/',
  monitorsController.findAllMonitors,
  eventsController.refreshEventLog,
  eventsController.getEventsPages,
  (req: express.Request, res:express.Response): void => {
    res.status(200).json(res.locals.events);
});

router.get('/:instanceId',
  monitorsController.findSingleMonitor,
  eventsController.refreshEventLog,
  eventsController.getEventsPages,
  (req: express.Request, res:express.Response): void => {
    res.status(200).json(res.locals.events);
});


router.get('/:instanceId/:dbIndex',
  monitorsController.findSingleMonitor,
  eventsController.refreshEventLog,
  eventsController.getEventsPages,
  (req: express.Request, res:express.Response): void => {
    res.status(200).json(res.locals.events);
});

export default router;

