import { Router } from 'express';
import * as viewsController from '../controllers/views.controller.js';
import { passportCall } from '../utils.js'; 

const router = Router();

router.get('/products', passportCall('jwt'), viewsController.renderProducts);
router.get('/cart/:cid', passportCall('jwt'), viewsController.renderCart);

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/', (req, res) => res.redirect('/login'));

export default router;