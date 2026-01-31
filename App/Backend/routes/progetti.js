import express from 'express';
import {
  getAllProgetti,
  getProgettoById,
  createProgetto,
  updateProgetto,
  deleteProgetto
} from '../controllers/progettiController.js';
import { authenticateToken, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllProgetti);
router.get('/:codice', getProgettoById);
router.post('/', isCoordinatore, createProgetto);
router.put('/:codice', isCoordinatore, updateProgetto);
router.delete('/:codice', isCoordinatore, deleteProgetto);

export default router;