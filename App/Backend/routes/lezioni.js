import express from 'express';
import {
  getComingLezioni,
  getAllLezioni
} from '../controllers/lezioniController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllLezioni);
router.get('/coming', getComingLezioni);

export default router;