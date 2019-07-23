'use strict';
import express, { NextFunction, Request, Response, Router } from 'express';
import { send } from '../controllers/queues/post/send';
import logging from '../logger';

const router: Router = express.Router();

router.use(logging.requestLogger);
router.use(logging.errorLogger);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response: any = await send(req);
    console.log(response);

    res.status(200).send({
      code: 200,
      status: 'success',
      message: null,
      data: response,
      error: response,
    });
  } catch (error) {
    logging.error(error);
    res.status(500).send(error);
  }
});

export = router;
