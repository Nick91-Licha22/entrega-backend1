import { Router } from 'express';
import * as productsController from '../controllers/product.controller.js'; 
import { authorization } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = Router();
const passportCall = (strategy) => passport.authenticate(strategy, { session: false });

router.get('/', productsController.getProducts);

router.post('/', 
    passportCall('jwt'), 
    authorization(['admin']), 
    productsController.createProduct
);

router.put('/:pid', 
    passportCall('jwt'), 
    authorization(['admin']), 
    productsController.updateProduct
);

router.delete('/:pid', 
    passportCall('jwt'), 
    authorization(['admin']), 
    productsController.deleteProduct
);

export default router;