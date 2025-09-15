import express from 'express'
const router = express.Router()

// GET /v1/models
router.get('/v1/models', (req, res) => {
  console.log('[openai/models] /v1/models 参数:', JSON.stringify(req.query))
  res.json({ message: 'ok' })
})

export default router
