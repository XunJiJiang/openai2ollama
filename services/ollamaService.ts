import { Request, Response } from 'express'
import ollama from 'ollama'
import {
  IOllamaChatRequest,
  IOpenAIChatRequest,
  IOpenAICompletionRequest
} from '../types/openai.ts'
import { formatLogMessages, formatMessages } from '../utils/formatMessages.ts'

// /v1/chat/completions
export async function chatCompletions(req: Request, res: Response) {
  const body = req.body as IOpenAIChatRequest
  const safeBody = { ...body, messages: formatLogMessages(body.messages) }
  console.log(
    '[ollamaService.chatCompletions] 请求参数:',
    JSON.stringify(safeBody)
  )
  // 只保留 Ollama 支持的参数
  const ollamaParams: IOllamaChatRequest<string> = {
    model: body.model,
    messages: formatMessages(body.messages),
    stream: body.stream,
    temperature: body.temperature,
    top_p: body.top_p
  }
  // 移除 undefined 字段
  ;(Object.keys(ollamaParams) as (keyof typeof ollamaParams)[]).forEach(
    (key) => ollamaParams[key] === undefined && delete ollamaParams[key]
  )
  try {
    // 支持流式和非流式
    if (body.stream) {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      let index = 0
      for await (const part of await ollama.chat({
        ...ollamaParams,
        stream: true
      })) {
        const data = {
          id: `chatcmpl-stream-${index}`,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: ollamaParams.model,
          choices: [
            {
              index: 0,
              delta: { content: part.message?.content || '' },
              finish_reason: null
            }
          ]
        }
        res.write(`data: ${JSON.stringify(data)}\n\n`)
        index++
      }
      res.write('data: [DONE]\n\n')
      res.end()
    } else {
      const response = await ollama.chat({
        ...ollamaParams,
        stream: false
      })
      const respObj = {
        id: 'chatcmpl-xxx',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: ollamaParams.model,
        choices: [
          {
            index: 0,
            message: response.message,
            finish_reason: 'stop'
          }
        ]
      }
      console.log(
        '[ollamaService.chatCompletions] 响应:',
        JSON.stringify(respObj)
      )
      res.json(respObj)
    }
  } catch (e) {
    console.error('[ollamaService.chatCompletions] 错误:', e)
    res
      .status(500)
      .json({ error: e instanceof Error ? (e as Error).message : e })
  }
}

// /v1/completions
export async function completions(req: Request, res: Response) {
  const body = req.body as IOpenAICompletionRequest
  console.log('[ollamaService.completions] 请求参数:', JSON.stringify(body))
  try {
    if (body.stream) {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      let index = 0
      for await (const part of await ollama.generate({
        model: body.model,
        prompt: body.prompt,
        stream: true
      })) {
        const data = {
          id: `cmpl-stream-${index}`,
          object: 'text_completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: body.model,
          choices: [
            {
              index: 0,
              text: part.response || '',
              finish_reason: null
            }
          ]
        }
        res.write(`data: ${JSON.stringify(data)}\n\n`)
        index++
      }
      res.write('data: [DONE]\n\n')
      res.end()
    } else {
      const response = await ollama.generate({
        model: body.model,
        prompt: body.prompt
      })
      const respObj = {
        id: 'cmpl-xxx',
        object: 'text_completion',
        created: Math.floor(Date.now() / 1000),
        model: body.model,
        choices: [
          {
            index: 0,
            text: response.response,
            finish_reason: 'stop'
          }
        ]
      }
      console.log('[ollamaService.completions] 响应:', JSON.stringify(respObj))
      res.json(respObj)
    }
  } catch (e) {
    console.error('[ollamaService.completions] 错误:', e)
    res
      .status(500)
      .json({ error: e instanceof Error ? (e as Error).message : e })
  }
}

// /v1/models
export async function listModels(_req: Request, res: Response) {
  console.log('[ollamaService.listModels] 请求')
  try {
    const result = await ollama.list()
    const respObj = {
      object: 'list',
      data: result.models.map((m: { name: string }) => ({
        id: m.name,
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'ollama'
      }))
    }
    console.log('[ollamaService.listModels] 响应:', JSON.stringify(respObj))
    res.json(respObj)
  } catch (e) {
    console.error('[ollamaService.listModels] 错误:', e)
    res
      .status(500)
      .json({ error: e instanceof Error ? (e as Error).message : e })
  }
}

// 立刻关闭当前加载的所有模型
export async function closeModel(req: Request, res: Response) {
  console.log('[ollamaService.closeModel] 请求')
  try {
    const psList = await ollama.ps()
    // 关闭所有模型
    for (const model of psList.models) {
      await ollama.chat({
        model: model.name,
        messages: [{ role: 'system', content: 'close' }],
        keep_alive: 0
      })
    }
    const respObj = { message: 'All models closed.' }
    console.log('[ollamaService.closeModel] 响应:', JSON.stringify(respObj))
    res.json(respObj)
  } catch (e) {
    console.error('[ollamaService.closeModel] 错误:', e)
    res
      .status(500)
      .json({ error: e instanceof Error ? (e as Error).message : e })
  }
}
