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
  deleteSede,
  updateAula,
  updateSede,
  deleteAula
} from '../controllers/auleController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

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
router.post('/', isAdmin, createAula);
router.put('/aula/:id', isAdmin, updateAula);
router.delete('/aula/:id', isAdmin, deleteAula);
router.post('/sede', isAdmin, createSede);
router.put('/sede/:id', isAdmin, updateSede);
router.delete('/sede/:id', isAdmin, deleteSede);

export default router;