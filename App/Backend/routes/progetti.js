import express from 'express';
import {
  getAllProgetti,
  getProgettiByCodice,
  createProgetto,
  updateProgetto,
  deleteProgetto,
  getCountProgetti,
  getCompletionProgetti
} from '../controllers/progettiController.js';
import { authenticateToken, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllProgetti);
router.get('/conta', getCountProgetti);
router.get('/completamento', getCompletionProgetti);
router.get('/:codice', getProgettiByCodice);
router.post('/', isCoordinatore, createProgetto);
router.put('/:codice', isCoordinatore, updateProgetto);
router.delete('/:codice', isCoordinatore, deleteProgetto);

export default router;