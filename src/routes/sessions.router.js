import { Router } from 'express';
import * as sessionsController from '../controllers/sessions.controller.js';
import { passportCall } from '../utils.js';

const router = Router();

router.post('/register', sessionsController.register);
router.post('/login', passportCall('login'), sessionsController.login);
router.get('/current', passportCall('jwt'), sessionsController.current);
router.post('/request-recovery', sessionsController.requestRecovery);
router.post('/reset-password', sessionsController.resetPassword);
router.get('/logout', sessionsController.logout);

export default router;