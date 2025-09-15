import express from 'express'
import cors from 'cors'
// import bodyParser from 'body-parser'
import chatRouter from './routes/chat'
import completionsRouter from './routes/completions'
import modelsRouter from './routes/models'
import closeModelRouter from './routes/closeModel'
// import openaiCompatRouter from './routes/openaiCompat'
// import openaiChatRouter from './routes/openai/chat'
// import openaiCompletionsRouter from './routes/openai/completions'
// import openaiModelsRouter from './routes/openai/models'
// import openaiFilesRouter from './routes/openai/files'
// import openaiFineTunesRouter from './routes/openai/fineTunes'
import { execSync } from 'child_process'
import { parseNamedArgs, RANDOM_API_KEY } from './utils/parseNamedArgs.js'

// API Key 校验中间件
import type { Request, Response, NextFunction } from 'express'

const args = parseNamedArgs()

const port = typeof args.port === 'number' ? args.port : 3199

// 建议将 API Key 存储在环境变量中，实际部署时请替换
const API_KEY =
  typeof args['api-key'] === 'string' ? args['api-key'] : RANDOM_API_KEY

function checkApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] ?? req.headers['authorization']
  if (apiKey === `Bearer ${API_KEY}`) {
    next()
  } else {
    res.status(401).json({ error: 'Invalid or missing API Key' })
  }
}

const app = express()

app.use(cors())
app.use(express.json({ limit: '100mb' }))

app.use('/v1/chat', checkApiKey, chatRouter)
app.use('/v1/completions', checkApiKey, completionsRouter)
app.use('/v1/models', checkApiKey, modelsRouter)
app.use('/close-model', checkApiKey, closeModelRouter)
// app.use('/', checkApiKey, openaiCompatRouter)

// OpenAI API mock routes
// app.use(openaiChatRouter)
// app.use(openaiCompletionsRouter)
// app.use(openaiModelsRouter)
// app.use(openaiFilesRouter)
// app.use(openaiFineTunesRouter)

app.get('/', (_req, res) => {
  res.send('Ollama OpenAI Compatible API Server')
})

app.listen(port, 'localhost', () => {
  console.log(
    `Ollama OpenAI Compatible API Server is running on http://localhost:${port}`
  )
})

// 是否自定义 host 绑定
if (args.host && typeof args.host === 'string') {
  try {
    app.listen(port, args.host, () => {
      console.log(
        `Ollama OpenAI Compatible API Server is running on http://${args.host}:${port}`
      )
    })
  } catch {
    console.error(
      `[Warning] Failed to bind to host ${args.host}, falling back to localhost`
    )
  }
} else if (args.host) {
  console.error(
    `[Warning] Invalid host argument: ${args.host}, needs to be a string`
  )
}

// 是否启用局域网访问
if (args.lan) {
  try {
    let ipAddress = 'localhost'
    try {
      ipAddress = execSync('ipconfig getifaddr en0').toString().trim()
    } catch {
      console.error(
        `[Warning] Failed to get IP address, falling back to localhost`
      )
    }
    app.listen(port, ipAddress, () => {
      console.log(
        `Ollama OpenAI Compatible API Server is running on http://${ipAddress}:${port}`
      )
    })
  } catch {
    console.error(
      `[Warning] Failed to bind to 0.0.0.0, falling back to localhost`
    )
  }
}

console.log(`Using API Key: ${API_KEY}`)

export { app as openai2ollama }

// ollama 接口转发
// import { createProxyMiddleware } from 'http-proxy-middleware'

// const ollamaApp = express()
// ollamaApp.use(cors())
// ollamaApp.use(express.json({ limit: '100mb' }))

// // 这个没有成功
// ollamaApp.use(
//   '/',
//   checkApiKey,
//   createProxyMiddleware({
//     target: 'http://localhost:11434',
//     changeOrigin: true,
//     ws: true,
//     pathRewrite: { '^/': '/' }
//   })
// )

// ollamaApp.listen(11435, () => {
//   console.log(`Ollama API Forwarder is running on http://${ipAddress}:11435`)
// })
