import express from 'express';
import {
  getAllAule,
  getAllSedi,
  getCountAule,
  getCountSedi,
  getPiani,
  getAuleStats,
  getSedeByNome
} from '../controllers/auleController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllAule);
router.get('/sedi', getAllSedi);
router.get('/contaA', getCountAule);
router.get('/contaS', getCountSedi);
router.get('/piani', getPiani);
router.get('/stats', getAuleStats);
router.get('/sede/:sede', getSedeByNome);
router.get('/stats/sede/:sede', getAuleStats);
router.get('/stats/piano/:piano', getAuleStats);
router.get('/stats/sede/:sede/piano/:piano', getAuleStats);
// router.get('/:cf', getDocenteById);
// router.post('/', isAdmin, createDocente);
// router.put('/:cf', isAdmin, updateDocente);
// router.delete('/:cf', isAdmin, deleteDocente);

export default router;