import express from "express";
import {validator} from '../middleware/validator.js'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from "../controllers/userController.js";
import auth from '../middleware/auth.js'
import isAdmin from "../middleware/isAdmin.js";
import isUser from '../middleware/isUser.js'

const router = express.Router();

router.get("/", auth, isAdmin, getAllUsers);
router.get("/:id",auth, getUserById);
router.post("/",validator, createUser);

router.post('/login', loginUser)
router.patch("/:id", auth, isUser, updateUser);
router.delete("/:id", deleteUser);

export default router;
