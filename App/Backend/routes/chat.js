
import express from 'express';
import { chat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/query', chat);

export default router;