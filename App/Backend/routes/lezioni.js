import express from 'express';
import {
  getComingLezioni,
  getAllLezioni,
  createLezione
} from '../controllers/lezioniController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(isAdmin);

router.get('/', getAllLezioni);
router.get('/coming', getComingLezioni);
router.post('/', isAdmin, createLezione);

export default router;