import express from 'express';
import {
  getComingLezioni,
  getAllLezioni,
  getByProgetto,
  createLezione,
  updateLezione,
  deleteLezione,
  getAllNote,
  getComingNote,
  createNota,
  updateNota,
  deleteNota
} from '../controllers/lezioniController.js';
import { authenticateToken, isAdmin, isAdminOrCoordinatore, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllLezioni);
router.get('/note', getAllNote);
router.get('/coming', getComingLezioni);
router.get('/coming/note', getComingNote);
router.get('/progetto/:codiceProgetto', getByProgetto);
router.post('/', isAdminOrCoordinatore, createLezione);
router.post('/nota', createNota);
router.put('/:id', isAdminOrCoordinatore, updateLezione);
router.put('/nota/:id', updateNota);
router.delete('/:id', isAdminOrCoordinatore, deleteLezione);
router.delete('/nota/:id', deleteNota);

export default router;