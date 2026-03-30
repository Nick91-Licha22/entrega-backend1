import { Router } from 'express';
import * as cartsController from '../controllers/carts.controller.js';
import { passportCall, authorization } from '../utils.js';

const router = Router();

router.post('/:cid/product/:pid', passportCall('jwt'), authorization(['user']), cartsController.addProductToCart);

router.post('/:cid/purchase', passportCall('jwt'), cartsController.purchaseCart);

export default router;