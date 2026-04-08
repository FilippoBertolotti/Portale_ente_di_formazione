import express from 'express';
import {
  getAllDocenti,
  getCountDocenti,
  createDocente
} from '../controllers/docentiController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(isAdmin);

router.get('/', getAllDocenti);
router.get('/conta', getCountDocenti);
// router.get('/:cf', getDocenteById);
router.post('/', isAdmin, createDocente);
// router.put('/:cf', isAdmin, updateDocente);
// router.delete('/:cf', isAdmin, deleteDocente);

export default router;