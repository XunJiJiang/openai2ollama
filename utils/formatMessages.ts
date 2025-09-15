import { TOpenAIMessage, TOllamaMessage } from '../types/openai.js'

/** 将 TOpenAIMessage[] 转换为 TOllamaMessage[] */
export function formatMessages(
  messages: TOpenAIMessage[]
): TOllamaMessage<string>[] {
  return messages.map((msg) => {
    const newMsg: TOllamaMessage<string> = {
      role: msg.role,
      content: '',
      images: []
    }
    if (typeof msg.content === 'string') {
      newMsg.content = msg.content
    } else if (Array.isArray(msg.content)) {
      // 处理数组内容，拼接文本，忽略图片等非文本内容
      msg.content.forEach((c) => {
        if ((c.type === 'input_text' || c.type === 'text') && c.text) {
          newMsg.content += c.text + '\n'
        } else if (
          (c.type === 'input_image' || c.type === 'image_url') &&
          c.image_url
        ) {
          const base64Data = c.image_url.split(',')[1] ?? ''
          if (base64Data) {
            newMsg.images?.push(base64Data)
          }
        }
        // 忽略图片等非文本内容
        return ''
      })
    }
    return newMsg
  })
}

/** 格式化 messages，隐藏 images 字段的详细内容 */
export function formatLogMessages(
  messages: TOpenAIMessage[]
): TOpenAIMessage[] {
  if (!Array.isArray(messages)) return messages
  return messages.map((msg) => {
    if (
      msg &&
      Array.isArray(msg.content) &&
      msg.content.some((c) => c.type === 'input_image')
    ) {
      return {
        ...msg,
        content: msg.content.map((c) => {
          if (c.type === 'input_image') {
            return {
              ...c,
              ...(c.image_url
                ? {
                    image_url:
                      c.image_url.length > 30
                        ? c.image_url.slice(0, 30) + '...'
                        : c.image_url
                  }
                : {})
            }
          }
          return c
        })
      }
    }
    return msg
  })
}
