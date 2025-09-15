import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

let server: any

beforeAll((done) => {})
afterAll((done) => {
  server.close()
})

describe('OpenAI Compatible API', () => {
  it('GET /v1/models', async () => {
    const res = await request(server).get('/v1/models')
    expect(res.status).toBe(200)
    console.log(res.body)
    expect(res.body).toHaveProperty('data')
  })

  it('POST /v1/chat/completions', async () => {
    const res = await request(server)
      .post('/v1/chat/completions')
      .send({
        model: 'llama3.2:latest',
        messages: [{ role: 'user', content: 'hello' }]
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('choices')
  })

  it('POST /v1/completions', async () => {
    const res = await request(server).post('/v1/completions').send({
      model: 'llama3.2:latest',
      prompt: 'hello'
    })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('choices')
  })

  it('POST /v1/chat/completions (stream)', async () => {
    const res = await request(server)
      .post('/v1/chat/completions')
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
    const res = await request(server).get('/close-model/all')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'All models closed.')
  })
})
