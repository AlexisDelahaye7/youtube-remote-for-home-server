import express from 'express';
import controllerHandler from '../middlewares/controller.middleware.js';
import playController from '../controllers/play.controller.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const router = express.Router();

router.all('/', (req, res) => {
  res.json({
    message: 'Welcome to your Youtube Remote for Home Server API',
  });
});

router
  .route('/play')
  .post(controllerHandler(playController.play));

router
  .route('/pause')
  .post(controllerHandler(playController.pause));

router.use(errorHandler);

export default router;
