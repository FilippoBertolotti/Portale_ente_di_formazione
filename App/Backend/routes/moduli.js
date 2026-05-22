import express from 'express';
import {
  getAllModuli,
  getByCodiceProgetto,
  createModulo,
  updateModulo,
  deleteModulo,
  getAnni,
  getByAnno,
  addTeacherToModule,
  removeTeacherFromModule,
  getActiveByAnno
} from '../controllers/moduliController.js';
import { authenticateToken, isAdmin, isCoordinatore } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllModuli);
router.get('/anni', getAnni);
router.get('/codice/:codice', getByCodiceProgetto);
router.get('/anno/:anno', getByAnno);
router.get('/attiviAnno/:anno', getActiveByAnno);
router.post('/', createModulo);
router.post('/:id/teacher', addTeacherToModule);
router.put('/:id', isCoordinatore || isAdmin, updateModulo);
router.delete('/:id', isCoordinatore || isAdmin, deleteModulo);
router.delete('/:id/teacher', removeTeacherFromModule);

export default router;