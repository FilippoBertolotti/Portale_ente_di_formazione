import express from 'express';
import {
  getAllDocenti,
  getCountDocenti,
  createDocente,
  updateDocente,
  deleteDocente
} from '../controllers/docentiController.js';
import { authenticateToken, isAdmin, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllDocenti);
router.get('/conta', getCountDocenti);
router.post('/', isAdmin, createDocente);
router.put('/:cf', isAdmin, updateDocente);
router.delete('/:cf', isAdmin, deleteDocente);
//router.get('/:cf', getDocenteById);

export default router;