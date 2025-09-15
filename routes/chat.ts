import express from 'express'
import { chatCompletions } from '../services/ollamaService.ts'
const router = express.Router()

router.post('/completions', chatCompletions)

export default router
