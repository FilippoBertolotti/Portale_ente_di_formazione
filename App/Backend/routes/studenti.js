import express from 'express';
import {
  getAllStudenti,
  getCountStudenti,
  getIncrementStudenti,
  getTrendStudenti,
  getCompositionStudenti,
  getStudentiByAnno,
  getStudentiByProgetto,
  getAnni,
  getAllStudentiSearch,
  createStudente,
  updateStudente,
  deleteStudente
} from '../controllers/studentiController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllStudenti);

router.get('/conta', getCountStudenti);
router.get('/incremento', getIncrementStudenti);
router.get('/andamento', getTrendStudenti);
router.get('/composizione', getCompositionStudenti);
router.get('/anni', getAnni);

router.get('/codice/:codice', getStudentiByProgetto);
router.get('/anno/:anno', getStudentiByAnno);

router.get('/:search', getAllStudentiSearch);
// router.get('/:cf', getStudenteById);
router.post('/', isAdmin, createStudente);
router.put('/:cf', isAdmin, updateStudente);
router.delete('/:cf', isAdmin, deleteStudente);

export default router;