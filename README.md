# ollama-api

本项目是一个基于 Node.js + TypeScript 的 API 服务，封装并扩展了 Ollama 本地大模型推理能力，提供类 OpenAI 兼容接口，便于集成与二次开发。

## 主要特性

- 基于 Express，支持 RESTful API
- 兼容 OpenAI Chat/Completions/Models 等接口
- 支持 Ollama 本地模型推理与管理
- 支持自定义参数解析、流式响应、图片输入等

## 目录结构

- `app.ts`              —— 应用入口
- `routes/`             —— 路由与 API 逻辑
- `services/`           —— Ollama 服务封装
- `types/`              —— 类型定义
- `utils/`              —— 工具函数
- `tests/`              —— 测试用例

## 快速开始

1. 安装依赖：

   ```sh
   pnpm install
   ```

2. 启动开发环境：

   ```sh
   pnpm run dev
   ```

3. 访问接口文档或直接调用 API。

## 命令行参数

```sh
pnpm run dev --lan --port=3199 --host=192.168.20.1 --api-key=api-key-7890
```

lan：启用局域网访问，默认仅 localhost

port：指定服务端口，默认 3199

host：指定绑定主机，默认 localhost

api-key：设置 API Key，默认随机生成

## 依赖说明

- [ollama](https://www.npmjs.com/package/ollama)：Ollama JS SDK

## 相关文档

- Ollama 官方文档：<https://github.com/jmorganca/ollama>
- OpenAI API 规范：<https://platform.openai.com/docs/api-reference>

---
如需自定义参数解析、扩展接口或集成更多模型，请参考 `utils/parseNamedArgs.ts` 及各路由实现。
