// OpenAI 兼容类型定义

export type TOllamaMessage<I extends string | Uint8Array> = {
  role: string
  content: string
  images?: I[]
}

export interface IOllamaChatRequest<I extends string | Uint8Array> {
  model: string
  messages: Array<TOllamaMessage<I>>
  stream?: boolean
  temperature?: number
  top_p?: number
  // 可按需补充更多参数
}

export interface IOllamaCompletionRequest {
  model: string
  prompt: string
  stream?: boolean
  temperature?: number
  max_tokens?: number
  top_p?: number
  // 可按需补充更多参数
}

export type TOpenAIMessage = {
  role: string
  content:
    | string
    | {
        type: 'text' | 'input_text' | 'input_image' | 'image_url'
        text?: string
        image_url?: string //`data:image/jpeg;base64,${base64_image}`
      }[]
}

export interface IOpenAIChatRequest {
  model: string
  messages: Array<TOpenAIMessage>
  stream?: boolean
  temperature?: number
  top_p?: number
  // 可按需补充更多参数
}

export interface IOpenAICompletionRequest {
  model: string
  prompt: string
  stream?: boolean
  temperature?: number
  max_tokens?: number
  top_p?: number
  // 可按需补充更多参数
}
