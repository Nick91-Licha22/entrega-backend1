import { Router } from 'express';
import * as sessionsController from '../controllers/sessions.controller.js';
import passport from 'passport';

const router = Router();
const passportCall = (strategy) => passport.authenticate(strategy, { session: false });

router.post('/register', sessionsController.register);
router.post('/login', passportCall('login'), sessionsController.login);
router.get('/current', passportCall('jwt'), sessionsController.current);
router.get('/logout', sessionsController.logout);
router.post('/forgot-password', sessionsController.forgotPassword);
router.post('/reset-password', sessionsController.resetPassword);

export default router;