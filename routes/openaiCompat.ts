/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express'
import axios from 'axios'
import { formatLogMessages } from '../utils/formatMessages'

const router = express.Router()

// 拦截所有请求并打印参数
router.use((req, res, next) => {
  const safeBody =
    req.body && req.body.messages
      ? { ...req.body, messages: formatLogMessages(req.body.messages) }
      : req.body
  console.log(`[openaiCompat] ${req.method} ${req.originalUrl} 参数:`, {
    ...safeBody,
    ...req.query,
    ...req.params
  })
  next()
})

// 路径重写和参数兼容中间件
router.post(
  '/v1/deployments/:deploymentId/chat/completions',
  async (req, res) => {
    const safeBody =
      req.body && req.body.messages
        ? { ...req.body, messages: formatLogMessages(req.body.messages) }
        : req.body
    console.log('[openaiCompat] 收到请求:', { ...safeBody })
    try {
      // 只保留 OpenAI 标准参数
      const {
        messages,
        model,
        temperature,
        top_p,
        n,
        stream,
        stop,
        max_tokens,
        presence_penalty,
        frequency_penalty,
        logit_bias,
        user
      } = req.body
      // Ollama 只需要 model/messages/temperature 等参数
      const payload: any = {
        model: model || req.params.deploymentId, // AzureOpenAI 的 deploymentId 实际就是模型名
        messages,
        temperature,
        top_p,
        n,
        stream,
        stop,
        max_tokens,
        presence_penalty,
        frequency_penalty,
        logit_bias,
        user
      }
      // 移除 undefined 字段
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      )

      // 打印请求内容
      const safePayload = payload.messages
        ? { ...payload, messages: formatLogMessages(payload.messages) }
        : payload
      console.log('[openaiCompat] 请求参数:', JSON.stringify(safePayload))

      // 转发到 Ollama API
      const ollamaRes = await axios.post(
        'http://localhost:11434/v1/chat/completions',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // 兼容 openai key 检查
            Authorization: req.headers['authorization'] || ''
          }
        }
      )
      // 打印响应内容
      console.log('[openaiCompat] Ollama 响应:', JSON.stringify(ollamaRes.data))
      res.status(ollamaRes.status).json(ollamaRes.data)
    } catch (err: any) {
      console.error('[openaiCompat] 错误:', err)
      if (err.response) {
        res.status(err.response.status).json(err.response.data)
      } else {
        res.status(500).json({ error: err.message })
      }
    }
  }
)

export default router
