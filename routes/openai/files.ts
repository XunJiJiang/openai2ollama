import express from 'express'
const router = express.Router()

// POST /v1/files
router.post('/v1/files', (req, res) => {
  console.log('[openai/files] /v1/files 参数:', JSON.stringify(req.body))
  res.json({ message: 'ok' })
})
// GET /v1/files
router.get('/v1/files', (req, res) => {
  console.log('[openai/files] /v1/files 参数:', JSON.stringify(req.query))
  res.json({ message: 'ok' })
})
// GET /v1/files/:file_id
router.get('/v1/files/:file_id', (req, res) => {
  console.log(
    '[openai/files] /v1/files/:file_id 参数:',
    JSON.stringify(req.params)
  )
  res.json({ message: 'ok' })
})
// DELETE /v1/files/:file_id
router.delete('/v1/files/:file_id', (req, res) => {
  console.log(
    '[openai/files] DELETE /v1/files/:file_id 参数:',
    JSON.stringify(req.params)
  )
  res.json({ message: 'ok' })
})

export default router
