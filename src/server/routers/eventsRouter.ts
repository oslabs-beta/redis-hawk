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

router.get('/totals/:instanceId/:dbIndex',
  monitorsController.findSingleMonitor,
  eventsController.validateRequestType,
  (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (req.query.timeInterval) eventsController.getEventsByTimeInterval(req, res, next);
    else if (req.query.eventTotal) eventsController.getSingleEventsTotal(req, res, next);
  },  
  (req: express.Request, res: express.Response): void => {
    res.status(200).json(res.locals.eventTotals);
});

export default router;

