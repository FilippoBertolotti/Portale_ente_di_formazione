import express from 'express';
import {
  getAllStudenti,
  getCountStudenti,
  getIncrementStudenti,
  getTrendStudenti,
  getCompositionStudenti,
  getStudentiByAnno,
  getStudentiByProgetto,
  getAnni
} from '../controllers/studentiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllStudenti);
router.get('/codice/:codice', getStudentiByProgetto);
router.get('/anno/:anno', getStudentiByAnno);
router.get('/conta', getCountStudenti);
router.get('/incremento', getIncrementStudenti);
router.get('/andamento', getTrendStudenti);
router.get('/composizione', getCompositionStudenti);
router.get('/anni', getAnni);
// router.get('/:codice', getStudenteById);
// router.post('/', isAdmin, createStudente);
// router.put('/:codice', isAdmin, updateStudente);
// router.delete('/:codice', isAdmin, deleteStudente);

export default router;