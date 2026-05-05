import express from 'express';
import {
  getComingLezioni,
  getAllLezioni,
  createLezione,
  updateLezione,
  deleteLezione
} from '../controllers/lezioniController.js';
import { authenticateToken, isAdmin, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(isAdmin, isCoordinatore);

router.get('/', getAllLezioni);
router.get('/coming', getComingLezioni);
router.post('/', isAdmin || isCoordinatore, createLezione);
router.put('/:id', isAdmin || isCoordinatore, updateLezione);
router.delete('/:id', isAdmin || isCoordinatore, deleteLezione);

export default router;