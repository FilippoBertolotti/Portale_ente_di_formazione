import express from 'express';
import {
  getAllModuli,
  getByCodiceProgetto,
  createModulo,
  updateModulo,
  deleteModulo,
  getAnni
} from '../controllers/moduliController.js';
import { authenticateToken, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllModuli);
router.get('/anni', getAnni);
router.post('/', isCoordinatore, createModulo);
router.get('/:codice', getByCodiceProgetto);
router.put('/:codice', isCoordinatore, updateModulo);
router.delete('/:codice', isCoordinatore, deleteModulo);

export default router;