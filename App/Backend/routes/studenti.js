import express from 'express';
import {
  getAllStudenti,
  getCountStudenti,
  getIncrementStudenti
} from '../controllers/studentiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllStudenti);
router.get('/conta', getCountStudenti);
router.get('/incremento', getIncrementStudenti);
// router.get('/:codice', getStudenteById);
// router.post('/', isAdmin, createStudente);
// router.put('/:codice', isAdmin, updateStudente);
// router.delete('/:codice', isAdmin, deleteStudente);

export default router;