import express from 'express';
import { getCurrentUser,updateAssistant,askToAssistant} from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.get("/current", authMiddleware, getCurrentUser);
userRouter.put("/assistant", authMiddleware,upload.single('assistantImage'),updateAssistant);
userRouter.post("/asktoassistant", authMiddleware,askToAssistant);


export default userRouter;
