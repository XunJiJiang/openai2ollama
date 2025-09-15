import express from 'express'
const router = express.Router()

// POST /v1/completions
router.post('/v1/completions', (req, res) => {
  console.log(
    '[openai/completions] /v1/completions 参数:',
    JSON.stringify(req.body)
  )
  res.json({ message: 'ok' })
})

export default router
