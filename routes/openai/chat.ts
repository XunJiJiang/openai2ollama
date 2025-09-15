import express from 'express'
const router = express.Router()

// POST /v1/chat/completions
router.post('/v1/chat/completions', (req, res) => {
  console.log(
    '[openai/chat] /v1/chat/completions 参数:',
    JSON.stringify(req.body)
  )
  res.json({ message: 'ok' })
})

export default router
