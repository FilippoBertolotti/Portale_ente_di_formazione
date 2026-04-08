import express from 'express';
import {
  getAllAule,
  getAllSedi,
  getCountAule,
  getCountSedi,
  getPiani,
  getAuleStats,
  getSedeById,
  createAula,
  createSede,
  deleteSede
} from '../controllers/auleController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(isAdmin);

router.get('/', getAllAule);
router.get('/sedi', getAllSedi);
router.get('/contaA', getCountAule);
router.get('/contaS', getCountSedi);
router.get('/piani', getPiani);
router.get('/stats', getAuleStats);
router.get('/sede/:sede', getSedeById);
router.get('/stats/sede/:sede', getAuleStats);
router.get('/stats/piano/:piano', getAuleStats);
router.get('/stats/sede/:sede/piano/:piano', getAuleStats);
// router.get('/:cf', getDocenteById);
  router.post('/', isAdmin, createAula);
  router.post('/sede', isAdmin, createSede);
// router.put('/:cf', isAdmin, updateDocente);
  router.delete('/sede/:sede', isAdmin, deleteSede);

export default router;