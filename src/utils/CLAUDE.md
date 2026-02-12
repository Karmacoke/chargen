# utils/ 模块文档

[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **utils**

> 最后更新: 2026-02-10 19:06:54

---

## 模块职责

`utils/` 模块包含无 UI 依赖的纯逻辑工具：

1. **apiAdapters.js**: 多提供商 API 调用适配器（Gemini, OpenAI, Ollama 等）。
2. **apiKeyDetector.js**: **✨新增** API Key 智能检测、模型推荐、错误诊断工具。
3. **helpers.js**: 通用辅助函数（剪贴板、Prompt 构建、JSON 清理）。

---

## 入口与启动

```javascript
import { detectApiKeyType, generateSmartConfig } from '../utils/apiKeyDetector';
import { geminiAdapter, openaiAdapter } from '../utils/apiAdapters';
```

---

## 对外接口

### 1. apiKeyDetector.js (新增)

#### detectApiKeyType
```typescript
function detectApiKeyType(apiKey: string): {
  type: string;
  name: string;
  provider: string;
  models: string[];
  baseUrl: string | null;
} | null
```
根据正则表达式识别 API Key 格式（支持 Gemini, OpenAI, DeepSeek, Claude, ChatGLM, Kimi, Qwen）。

#### getRecommendedModels
```typescript
function getRecommendedModels(provider: string): Array<{ value: string, label: string }>
```
返回指定提供商的推荐模型列表（如 `gemini-2.0-flash-exp`, `gpt-4o-mini`）。

#### validateModelName
```typescript
function validateModelName(provider: string, modelName: string): { valid: boolean, suggestion?: string }
```
验证模型名称格式，提供纠错建议。

#### format404Error
```typescript
function format404Error(provider: string, attemptedModel: string): string
```
生成友好的 404 错误消息，包含推荐模型列表。

### 2. apiAdapters.js

- `geminiAdapter`
- `openaiAdapter` (兼容 DeepSeek, Moonshot 等)
- `ollamaAdapter`
- `claudeAdapter`
- `testConnection`

### 3. helpers.js

- `copyToClipboard`
- `buildUserPrompt`
- `buildSystemInstruction`
- `cleanJsonResponse`

---

## 变更记录

- **2026-02-10**: 新增 `apiKeyDetector.js`，包含 7 种主流模型的正则匹配规则和推荐列表。
- **2026-02-05**: 初始化 utils 模块。

---

_此文档自动生成。修改代码后请同步更新本文档。_
