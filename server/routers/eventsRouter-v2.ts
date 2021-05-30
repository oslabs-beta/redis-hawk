import express from 'express';
const router = express.Router();

router.get('/',
  (req: express.Request, res:express.Response): void => {
    res.status(200).json(res.locals.events);
});

router.get('/:instanceId',
  (req: express.Request, res:express.Response): void => {
    res.status(200).json(res.locals.events);
});


router.get('/:instanceId/:dbIndex',
  (req: express.Request, res:express.Response): void => {
    res.status(200).json(res.locals.events);
});

export default router;

