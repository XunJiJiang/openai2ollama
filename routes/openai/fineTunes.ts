import express from 'express'
const router = express.Router()

// POST /v1/fine-tunes
router.post('/v1/fine-tunes', (req, res) => {
  console.log(
    '[openai/fineTunes] /v1/fine-tunes 参数:',
    JSON.stringify(req.body)
  )
  res.json({ message: 'ok' })
})
// GET /v1/fine-tunes
router.get('/v1/fine-tunes', (req, res) => {
  console.log(
    '[openai/fineTunes] /v1/fine-tunes 参数:',
    JSON.stringify(req.query)
  )
  res.json({ message: 'ok' })
})
// GET /v1/fine-tunes/:fine_tune_id
router.get('/v1/fine-tunes/:fine_tune_id', (req, res) => {
  console.log(
    '[openai/fineTunes] /v1/fine-tunes/:fine_tune_id 参数:',
    JSON.stringify(req.params)
  )
  res.json({ message: 'ok' })
})
// POST /v1/fine-tunes/:fine_tune_id/cancel
router.post('/v1/fine-tunes/:fine_tune_id/cancel', (req, res) => {
  console.log(
    '[openai/fineTunes] /v1/fine-tunes/:fine_tune_id/cancel 参数:',
    JSON.stringify(req.params)
  )
  res.json({ message: 'ok' })
})
// GET /v1/fine-tunes/:fine_tune_id/events
router.get('/v1/fine-tunes/:fine_tune_id/events', (req, res) => {
  console.log(
    '[openai/fineTunes] /v1/fine-tunes/:fine_tune_id/events 参数:',
    JSON.stringify(req.params)
  )
  res.json({ message: 'ok' })
})

export default router
