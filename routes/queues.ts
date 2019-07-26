'use strict';
import express, { NextFunction, Request, Response, Router } from 'express';
import { send } from '../controllers/queues/post/send';
import logging from '../logger';

const router: Router = express.Router();

router.use(logging.requestLogger);
router.use(logging.errorLogger);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response: any = await send(req.body);
    if (response.code === 404) {
      res.status(404).send({
        code: 404,
        status: response.status,
        message: response.message,
        data: [],
        error: response.error,
      });
    } else {
      res.status(200).send({
        code: 200,
        status: 'success',
        message: null,
        data: response.data,
        error: response.error,
      });
    }
  } catch (error) {
    logging.error(error);
    res.status(500).send(error);
  }
});

export = router;
