import express from 'express';
import {
  getAllModuli,
  getByCodiceProgetto,
  createModulo,
  updateModulo,
  deleteModulo,
  getAnni,
  getByAnno
} from '../controllers/moduliController.js';
import { authenticateToken, isAdmin, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllModuli);
router.get('/anni', getAnni);
router.post('/', isCoordinatore, createModulo);
router.get('/codice/:codice', getByCodiceProgetto);
router.get('/anno/:anno', getByAnno);
router.put('/:id', isCoordinatore || isAdmin, updateModulo);
router.delete('/:id', isCoordinatore || isAdmin, deleteModulo);

export default router;