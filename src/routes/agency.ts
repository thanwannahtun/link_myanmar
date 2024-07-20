import {Router} from 'express';
import { agencyController } from '../controllers/agencyController';

const router = Router();

router.post("/register",agencyController.registerAgency);

export default router;