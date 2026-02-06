# utils/ 模块文档

[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **utils**

> 最后更新: 2026-02-05 17:19:56

---

## 模块职责

`utils/` 模块包含所有工具函数和适配器，负责无 UI 依赖的纯逻辑：

1. **apiAdapters.js**: 三种 AI 提供商的 API 调用适配器（Gemini、OpenAI、Ollama）
2. **helpers.js**: 通用辅助函数（剪贴板操作、Prompt 构建、JSON 清理）

**设计原则**:
- 纯函数设计，无副作用
- 统一错误处理（抛出 Error 对象）
- 适配器模式统一接口
- 可独立单元测试

---

## 入口与启动

### 工具函数导入方式

```javascript
// apiAdapters.js 的使用
import { geminiAdapter, openaiAdapter, ollamaAdapter, testConnection }
  from '../utils/apiAdapters';

// helpers.js 的使用
import { copyToClipboard, buildUserPrompt, buildSystemInstruction, cleanJsonResponse }
  from '../utils/helpers';
```

---

## 对外接口

### 1. apiAdapters.js

#### geminiAdapter

**函数签名**:
```typescript
async function geminiAdapter(
  config: { apiKey: string, model: string },
  systemInstruction: string,
  userPrompt: string
): Promise<CharacterData>
```

**功能说明**:
- 调用 Google Gemini API
- 自动检测模型版本（2.0/2.5/exp 使用 v1beta，否则使用 v1）
- 合并 system instruction 到 prompt（避免 API 版本兼容问题）
- 清理 Markdown 代码块并解析 JSON

**错误处理**:
```javascript
throw new Error(`Gemini API Error (${status}): ${errorText}`);
```

---

#### openaiAdapter

**函数签名**:
```typescript
async function openaiAdapter(
  config: { apiKey: string, baseUrl: string, model: string },
  systemInstruction: string,
  userPrompt: string
): Promise<CharacterData>
```

**功能说明**:
- 调用 OpenAI 兼容 API（包括 DeepSeek）
- 自动移除 Base URL 末尾斜杠
- 标准 Chat Completions 格式
- Temperature 固定为 0.7

**请求格式**:
```javascript
{
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: systemInstruction },
    { role: "user", content: userPrompt }
  ],
  temperature: 0.7
}
```

---

#### ollamaAdapter

**函数签名**:
```typescript
async function ollamaAdapter(
  config: { baseUrl: string, model: string },
  systemInstruction: string,
  userPrompt: string
): Promise<CharacterData>
```

**功能说明**:
- 调用本地 Ollama API
- 兼容 OpenAI Chat Completions 格式
- 默认 Base URL: `http://localhost:11434/v1`

---

#### testConnection

**函数签名**:
```typescript
async function testConnection(
  config: { provider: string, apiKey?: string, baseUrl?: string, model: string }
): Promise<boolean>
```

**功能说明**:
- 快速测试 API 连接可用性
- 发送简单测试请求（"Hello" 或 "hi"）
- 返回布尔值（成功/失败）
- 内部处理所有异常（不抛出）

**测试请求**:
```javascript
// Gemini
{ contents: [{ parts: [{ text: "Hello" }] }] }

// OpenAI/Ollama
{ model: "...", messages: [{ role: "user", content: "hi" }] }
```

---

### 2. helpers.js

#### copyToClipboard

**函数签名**:
```typescript
function copyToClipboard(text: string): boolean
```

**功能说明**:
- 使用 `document.execCommand('copy')` 方法
- 创建临时 textarea 元素
- 成功返回 true，失败返回 false
- 失败时在控制台输出错误

**实现细节**:
```javascript
const textArea = document.createElement("textarea");
textArea.value = text;
document.body.appendChild(textArea);
textArea.select();
try {
  document.execCommand('copy');
  return true;
} catch (err) {
  return false;
} finally {
  document.body.removeChild(textArea);
}
```

---

#### buildUserPrompt

**函数签名**:
```typescript
function buildUserPrompt(params: {
  mode: 'custom' | 'random';
  worldSetting: string;
  role: string;
  gender: string;
  keywords: string;
  targetLanguage: string;
  worldOptions: object;
}): string
```

**功能说明**:
- 根据模式构建用户 Prompt
- 随机模式：随机选择世界观
- 定制模式：基于用户输入构建详细 Prompt

**输出示例**:
```text
// 定制模式
Please generate and refine a detailed character based on the following clues:
  - World View: 奇异 (Fantasy) - 剑与魔法，龙与地下城
  - Role/Identity: 流浪骑士
  - Gender: 女
  - Keywords/Clues: 有点神经质，喜欢收集旧硬币
  If information is scarce, please complete it creatively.
  IMPORTANT: The output content MUST be in 简体中文 language.

// 随机模式
Please generate a detailed character completely at random.
World setting: 赛博朋克 (Cyberpunk) - 高科技低生活.
Language of output MUST be: 简体中文.
```

---

#### buildSystemInstruction

**函数签名**:
```typescript
function buildSystemInstruction(targetLanguage: string): string
```

**功能说明**:
- 构建固定的 System Instruction
- 定义 JSON 格式规范
- 强调输出语言要求
- 特别说明 `system_prompt` 字段的用途

**关键内容**:
```text
You are a professional Character Generator API.
Your task is to generate a highly detailed fictional character based on user input.
You MUST output strictly in JSON format. NO Markdown tags.
Use 简体中文 for all text fields (except image_prompt and system_prompt).

IMPORTANT: The "system_prompt" field MUST be a roleplay instruction
for THIS SPECIFIC CHARACTER, NOT a general character generator instruction.
```

---

#### cleanJsonResponse

**函数签名**:
```typescript
function cleanJsonResponse(text: string): string
```

**功能说明**:
- 移除 AI 响应中的 Markdown 代码块标记
- 处理 ` ```json ` 和 ` ``` ` 标记
- 清理前后空白字符

**示例**:
```javascript
// 输入
`\`\`\`json
{"name": "Alice"}
\`\`\``

// 输出
`{"name": "Alice"}`
```

---

## 关键依赖与配置

### 外部依赖

```javascript
// apiAdapters.js
import { cleanJsonResponse } from './helpers';

// helpers.js
// 无外部依赖（仅使用浏览器原生 API）
```

### API 端点映射

| 提供商 | 端点格式 | 鉴权方式 |
|-------|---------|---------|
| Gemini | `https://generativelanguage.googleapis.com/{version}/{model}:generateContent?key={apiKey}` | Query 参数 |
| OpenAI | `{baseUrl}/chat/completions` | Bearer Token |
| Ollama | `{baseUrl}/chat/completions` | 无需鉴权 |

---

## 数据模型

### API 响应格式

#### Gemini 响应
```json
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "JSON字符串（可能带 Markdown 标记）" }]
    }
  }]
}
```

#### OpenAI/Ollama 响应
```json
{
  "choices": [{
    "message": {
      "content": "JSON字符串（可能带 Markdown 标记）"
    }
  }]
}
```

### 清理后的角色数据

详见 [src/CLAUDE.md 数据模型章节](../CLAUDE.md#数据模型)

---

## 测试与质量

### 测试覆盖缺口

| 函数 | 单元测试 | 边界测试 | 错误测试 |
|-----|---------|---------|---------|
| geminiAdapter | ❌ 无 | ❌ 无 | ❌ 无 |
| openaiAdapter | ❌ 无 | ❌ 无 | ❌ 无 |
| ollamaAdapter | ❌ 无 | ❌ 无 | ❌ 无 |
| testConnection | ❌ 无 | ❌ 无 | ❌ 无 |
| copyToClipboard | ❌ 无 | ❌ 无 | ❌ 无 |
| buildUserPrompt | ❌ 无 | ❌ 无 | ❌ 无 |
| buildSystemInstruction | ❌ 无 | ❌ 无 | ❌ 无 |
| cleanJsonResponse | ❌ 无 | ❌ 无 | ❌ 无 |

### 建议补充的测试

#### 1. cleanJsonResponse 测试
```javascript
// __tests__/helpers.test.js
import { cleanJsonResponse } from '../helpers';

test('移除 Markdown 代码块', () => {
  const input = '```json\n{"name": "Alice"}\n```';
  expect(cleanJsonResponse(input)).toBe('{"name": "Alice"}');
});

test('处理仅有单个代码块的情况', () => {
  const input = '```{"name": "Bob"}```';
  expect(cleanJsonResponse(input)).toBe('{"name": "Bob"}');
});

test('处理无标记的纯 JSON', () => {
  const input = '{"name": "Charlie"}';
  expect(cleanJsonResponse(input)).toBe('{"name": "Charlie"}');
});
```

#### 2. buildUserPrompt 测试
```javascript
test('定制模式生成正确 Prompt', () => {
  const result = buildUserPrompt({
    mode: 'custom',
    worldSetting: 'Fantasy',
    role: 'Knight',
    gender: 'Male',
    keywords: 'brave',
    targetLanguage: 'English',
    worldOptions: {}
  });

  expect(result).toContain('World View: Fantasy');
  expect(result).toContain('Role/Identity: Knight');
  expect(result).toContain('Gender: Male');
  expect(result).toContain('Keywords/Clues: brave');
});

test('随机模式随机选择世界观', () => {
  const worldOptions = { fantasy: 'Fantasy', cyberpunk: 'Cyberpunk' };
  const result = buildUserPrompt({
    mode: 'random',
    targetLanguage: 'English',
    worldOptions
  });

  expect(result).toContain('completely at random');
  expect(result).toMatch(/Fantasy|Cyberpunk/);
});
```

#### 3. apiAdapters 测试（需 Mock fetch）
```javascript
// __tests__/apiAdapters.test.js
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('geminiAdapter 正确处理成功响应', async () => {
  const mockResponse = {
    candidates: [{
      content: {
        parts: [{ text: '{"name": "Test"}' }]
      }
    }]
  };

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockResponse
  });

  const result = await geminiAdapter(
    { apiKey: 'test-key', model: 'gemini-2.0-flash-exp' },
    'system instruction',
    'user prompt'
  );

  expect(result).toEqual({ name: 'Test' });
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('v1beta'),
    expect.any(Object)
  );
});

test('geminiAdapter 抛出错误当 API 返回非 200', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 400,
    text: async () => 'Bad Request'
  });

  await expect(
    geminiAdapter({ apiKey: 'test', model: 'test' }, '', '')
  ).rejects.toThrow('Gemini API Error (400)');
});
```

#### 4. copyToClipboard 测试（需 Mock DOM API）
```javascript
test('复制成功时返回 true', () => {
  document.execCommand = jest.fn(() => true);

  const result = copyToClipboard('test text');

  expect(result).toBe(true);
  expect(document.execCommand).toHaveBeenCalledWith('copy');
});

test('复制失败时返回 false', () => {
  document.execCommand = jest.fn(() => {
    throw new Error('Failed');
  });

  const result = copyToClipboard('test text');

  expect(result).toBe(false);
});
```

---

## 常见问题 (FAQ)

### Q1: 为什么适配器要统一返回 Promise<CharacterData>？
**A**:
- 统一接口便于在 Hook 中切换提供商
- 便于 TypeScript 类型检查
- 便于添加新的提供商（只需实现相同接口）

### Q2: 如何添加新的 AI 提供商？
**A**:
1. 在 `apiAdapters.js` 中添加新适配器函数
2. 遵循统一接口：`async (config, systemInstruction, userPrompt) => CharacterData`
3. 在 `testConnection` 函数中添加对应的测试逻辑
4. 在 `useCharacterGeneration` Hook 的 `handleGenerate` 中添加调用分支

### Q3: 为什么使用 document.execCommand 而不是 Clipboard API？
**A**:
- 兼容性更好（支持旧浏览器）
- 无需 HTTPS（本地开发更方便）
- 现代 Clipboard API 也可用，建议添加 fallback：
```javascript
if (navigator.clipboard) {
  await navigator.clipboard.writeText(text);
} else {
  // 使用 execCommand
}
```

### Q4: Gemini 为什么要合并 system instruction 到 prompt？
**A**:
- Gemini v1beta API 的 `systemInstruction` 参数不稳定
- 合并到 prompt 可以保证兼容性
- 未来可以拆分（如果 API 稳定）

### Q5: 如何调试 API 调用？
**A**:
```javascript
// 在适配器函数中添加日志
console.log('API Request:', {
  url,
  headers,
  body: JSON.parse(body)
});

console.log('API Response:', resJson);
```

---

## 相关文件清单

```
src/utils/
├── apiAdapters.js  (178 行) - API 适配器
│   ├── geminiAdapter      (51 行)
│   ├── openaiAdapter      (33 行)
│   ├── ollamaAdapter      (31 行)
│   └── testConnection     (40 行)
│
└── helpers.js      (84 行)  - 工具函数
    ├── copyToClipboard           (26 行)
    ├── buildUserPrompt           (18 行)
    ├── buildSystemInstruction    (20 行)
    └── cleanJsonResponse         (4 行)

总计: 262 行代码
```

---

## 变更记录

- **2026-02-05 17:19**: 初始化 utils 模块，从主组件中提取工具函数和 API 逻辑
- 建议下一步：补充完整单元测试，增加错误边界处理和重试机制

---

_此文档自动生成。修改代码后请同步更新本文档。_
