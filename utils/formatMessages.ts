import { TOpenAIMessage, TOllamaMessage } from '../types/openai.js'

/** 将 TOpenAIMessage[] 转换为 TOllamaMessage[] */
export async function formatMessages(
  messages: TOpenAIMessage[]
): Promise<TOllamaMessage<string>[]> {
  const _messages: TOllamaMessage<string>[] = []
  for (const msg of messages) {
    const newMsg: TOllamaMessage<string> = {
      role: msg.role,
      content: '',
      images: []
    }
    if (typeof msg.content === 'string') {
      newMsg.content = msg.content
    } else if (Array.isArray(msg.content)) {
      // 处理数组内容，拼接文本，忽略图片等非文本内容
      for (const c of msg.content) {
        if ((c.type === 'input_text' || c.type === 'text') && c.text) {
          newMsg.content += c.text + '\n'
        } else if (
          (c.type === 'input_image' || c.type === 'image_url') &&
          c.image_url
        ) {
          if (
            typeof c.image_url === 'string' &&
            c.image_url.startsWith('data:image/')
          ) {
            const base64Data = c.image_url.split(',')[1] ?? ''
            if (base64Data) {
              newMsg.images?.push(base64Data)
            }
          } else if (
            typeof c.image_url === 'string' &&
            c.image_url.startsWith('http')
          ) {
            // 处理远程图片 URL，下载并转换为 base64
            const base64Data = await downloadImageAsBase64(c.image_url)
            if (base64Data) {
              newMsg.images?.push(base64Data)
            }
          } else if (
            typeof c.image_url === 'object' &&
            typeof c.image_url.url === 'string' &&
            c.image_url.url.startsWith('http')
          ) {
            const base64Data = await downloadImageAsBase64(c.image_url.url)
            if (base64Data) {
              newMsg.images?.push(base64Data)
            }
          }
        }
      }
    }
    _messages.push(newMsg)
  }
  return _messages
}

async function downloadImageAsBase64(
  url: string,
  retries: number = 5
): Promise<string> {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const buffer = await response.arrayBuffer()
      const base64Data = Buffer.from(buffer).toString('base64')
      return base64Data
    } else {
      console.warn('[formatMessages] 忽略无法访问的远程图片 URL:', url)
      return ''
    }
  } catch (error) {
    if (retries > 0) {
      console.warn(
        '[formatMessages] 下载远程图片失败，重试中:',
        url,
        '剩余重试次数:',
        retries
      )
      return downloadImageAsBase64(url, retries - 1)
    } else {
      console.log('[formatMessages] 下载远程图片失败:', url)
      throw error
    }
  }
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
                      typeof c.image_url === 'string'
                        ? c.image_url.startsWith('http')
                          ? c.image_url
                          : c.image_url.slice(0, 30) + '...'
                        : {
                            url:
                              c.image_url.url &&
                              c.image_url.url.startsWith('http')
                                ? c.image_url.url
                                : c.image_url.url
                                  ? c.image_url.url.slice(0, 30) + '...'
                                  : (console.warn(
                                      '[formatMessages] 未知的 image_url 格式:',
                                      c.image_url
                                    ),
                                    '<undefined>')
                          }
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
