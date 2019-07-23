'use strict';
import express, { NextFunction, Request, Response, Router } from 'express';
import logging from '../logger';

const router: Router = express.Router();

router.use(logging.requestLogger);
router.use(logging.errorLogger);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const response = '🛡️  Server is working 🛡️';
  res.status(200).send({
    code: 200,
    status: 'success',
    message: response,
    data: null,
  });
});

export = router;
