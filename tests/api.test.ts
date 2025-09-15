import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { openai2ollama } from '../app.js'
import { RANDOM_API_KEY } from '../utils/parseNamedArgs.js'

let server: any

beforeAll((done) => {
  server = openai2ollama.listen(4000, () => {})
})
afterAll((done) => {
  server.close()
})

describe('OpenAI Compatible API', () => {
  it('GET /v1/models', async () => {
    const res = await request(server)
      .get('/v1/models')
      .set('x-api-key', `Bearer ${RANDOM_API_KEY}`)
    expect(res.status).toBe(200)
    console.log(res.body)
    expect(res.body).toHaveProperty('data')
  })

  it('POST /v1/chat/completions', async () => {
    const res = await request(server)
      .post('/v1/chat/completions')
      .set('x-api-key', `Bearer ${RANDOM_API_KEY}`)
      .send({
        model: 'llama3.2:latest',
        messages: [{ role: 'user', content: 'hello' }]
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('choices')
  })

  it('POST /v1/completions', async () => {
    const res = await request(server)
      .post('/v1/completions')
      .set('x-api-key', `Bearer ${RANDOM_API_KEY}`)
      .send({
        model: 'llama3.2:latest',
        prompt: 'hello'
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('choices')
  })

  it('POST /v1/chat/completions (stream)', async () => {
    const res = await request(server)
      .post('/v1/chat/completions')
      .set('x-api-key', `Bearer ${RANDOM_API_KEY}`)
      .set('Accept', 'text/event-stream')
      .send({
        model: 'llama3.2:latest',
        messages: [{ role: 'user', content: 'hello' }],
        stream: true
      })
    expect(res.status).toBe(200)
    expect(res.header['content-type']).toContain('text/event-stream')
    expect(res.text).toContain('data:')
    expect(res.text).toContain('[DONE]')
  })

  it('POST /v1/completions (stream)', async () => {
    const res = await request(server)
      .post('/v1/completions')
      .set('x-api-key', `Bearer ${RANDOM_API_KEY}`)
      .set('Accept', 'text/event-stream')
      .send({
        model: 'llama3.2:latest',
        prompt: 'hello',
        stream: true
      })
    expect(res.status).toBe(200)
    expect(res.header['content-type']).toContain('text/event-stream')
    expect(res.text).toContain('data:')
    expect(res.text).toContain('[DONE]')
  })

  it('POST /close-model/all', async () => {
    const res = await request(server)
      .get('/close-model/all')
      .set('x-api-key', `Bearer ${RANDOM_API_KEY}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'All models closed.')
  })
})
