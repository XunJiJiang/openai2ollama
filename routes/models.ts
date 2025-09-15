import express from 'express'
import { listModels } from '../services/ollamaService.ts'
const router = express.Router()

router.get('/', listModels)

export default router
