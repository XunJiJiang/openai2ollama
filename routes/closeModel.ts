import express from 'express'
import { closeModel } from '../services/ollamaService.ts'
const router = express.Router()

router.get('/all', closeModel)

export default router
