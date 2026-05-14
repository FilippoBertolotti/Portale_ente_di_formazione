import express from 'express';
import {
  getComingLezioni,
  getAllLezioni,
  createLezione,
  updateLezione,
  deleteLezione,
  getAllNote,
  createNota,
  updateNota,
  deleteNota
} from '../controllers/lezioniController.js';
import { authenticateToken, isAdmin, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(isAdmin, isCoordinatore);

router.get('/', getAllLezioni);
router.get('/note', getAllNote);
router.get('/coming', getComingLezioni);
router.post('/', isAdmin || isCoordinatore, createLezione);
router.post('/nota', createNota);
router.put('/:id', isAdmin || isCoordinatore, updateLezione);
router.put('/nota/:id', updateNota);
router.delete('/:id', isAdmin || isCoordinatore, deleteLezione);
router.delete('/nota/:id', deleteNota);

export default router;