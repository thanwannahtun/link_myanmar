import { Router } from 'express'
import { authController } from '../controllers/authController'

const router = Router()

router.post('/sign_up', authController.signUp);
router.post('/sing_in',authController.signIn);
router.post('/sign_out',authController.signOut);

export default router
