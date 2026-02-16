import express from 'express';
import {
  getAllAule,
  getCountAule,
  getCountSedi
} from '../controllers/auleController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllAule);
router.get('/contaA', getCountAule);
router.get('/contaS', getCountSedi);
// router.get('/:cf', getDocenteById);
// router.post('/', isAdmin, createDocente);
// router.put('/:cf', isAdmin, updateDocente);
// router.delete('/:cf', isAdmin, deleteDocente);

export default router;