import express from 'express'
import { completions } from '../services/ollamaService.ts'
const router = express.Router()

router.post('/', completions)

export default router
