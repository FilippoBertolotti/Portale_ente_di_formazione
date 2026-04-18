import express from 'express';
import {
  getAllProgetti,
  getProgettiByCodice,
  getProgettiByAnno,
  createProgetto,
  updateProgetto,
  deleteProgetto,
  getCountProgetti,
  getCompletionProgetti
} from '../controllers/progettiController.js';
import { authenticateToken, isAdmin, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllProgetti);
router.get('/conta', getCountProgetti);
router.get('/completamento', getCompletionProgetti);
router.get('/anno/:anno', getProgettiByAnno);
router.get('/codice/:codice', getProgettiByCodice);
router.post('/', isCoordinatore || isAdmin, createProgetto);
router.put('/:codice', isAdmin, updateProgetto);
router.delete('/:codice', isAdmin, deleteProgetto);

export default router;