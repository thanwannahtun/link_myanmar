import { Router } from 'express'
import { messageController } from '../controllers/messageController'

const router = Router()

router.get('/', messageController.getMessages)
router.post('/', messageController.sendMessage)

export default router
