import express from 'express';
import { getAllProducts, getASingleProduct, addAProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';
import auth from '../middleware/auth.js'
import isAdmin from "../middleware/isAdmin.js";
const router = express.Router();


router.get('/',  getAllProducts)
router.get('/:id', getASingleProduct)
router.post('/', auth, isAdmin, addAProduct)
router.patch('/:id',auth, isAdmin, updateProduct)
router.delete('/:id', auth, isAdmin, deleteProduct)




export default router;