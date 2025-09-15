import { v7 as uuid } from 'uuid'

/**
 * 解析具名参数（如 --key=value 或 { key: value }）为对象
 * 支持命令行参数数组和对象两种输入
 */
export function parseNamedArgs(): Record<string, string | boolean | number> {
  const args = process.argv.slice(2)
  const input = args.length > 0 ? args : []
  if (Array.isArray(input)) {
    // 解析命令行参数数组
    const result: Record<string, string | boolean | number> = {}
    input.forEach((arg) => {
      // 支持 --key=value
      if (arg.startsWith('--')) {
        const [key, value] = arg.split('=')
        if (key && value) {
          if (!isNaN(Number(value))) {
            result[key.slice(2)] = Number(value)
          } else if (value.toLowerCase() === 'true') {
            result[key.slice(2)] = true
          } else if (value.toLowerCase() === 'false') {
            result[key.slice(2)] = false
          } else {
            result[key.slice(2)] = value
          }
        } else if (key && !value) {
          result[key.slice(2)] = true // 处理 --debug 这种无值参数，默认为 true
        }
      }
    })
    return result
  } else if (typeof input === 'object' && input !== null) {
    // 直接返回对象的 string 类型属性
    const result: Record<string, string> = {}
    for (const [k, v] of Object.entries(input)) {
      if (typeof v === 'string') result[k] = v
    }
    return result
  }
  return {}
}

/**
 * 从具名参数中提取指定 key 的值
 * @param key 需要提取的参数名
 */
export function getNamedArg(
  key: string
): string | boolean | number | undefined {
  const args = parseNamedArgs()
  return args[key]
}

export const RANDOM_API_KEY = uuid()
