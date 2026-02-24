import express from 'express';
import {
  getComingLezioni
} from '../controllers/lezioniController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getComingLezioni);

export default router;