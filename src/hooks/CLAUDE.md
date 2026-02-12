# hooks/ 模块文档

[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **hooks**

> 最后更新: 2026-02-10 19:06:54

---

## 模块职责

`hooks/` 模块包含所有自定义 React Hooks，封装业务逻辑和副作用：

1. **useCharacterGeneration.js**: 核心业务逻辑 Hook，管理角色生成的完整生命周期，包括配置管理、API 调用、UI 状态控制。

---

## 入口与启动

### Hook 导入方式

```javascript
import { useCharacterGeneration } from './hooks/useCharacterGeneration';

const {
  config, isApiKeyConfigured, shouldShowSettings,
  handleGenerate, handleTestConnection
} = useCharacterGeneration();
```

---

## 对外接口

### useCharacterGeneration Hook

**返回值接口**:

```typescript
interface UseCharacterGenerationReturn {
  // === 状态 ===
  lang: string;
  mode: 'custom' | 'random';
  worldSettingKey: string;
  role: string;
  gender: string;
  keywords: string;

  // 运行状态
  isLoading: boolean;
  error: string;
  result: CharacterData | null;
  testStatus: 'testing' | 'success' | 'fail' | null;

  // 配置状态
  config: AppConfig;
  isApiKeyConfigured: boolean;   // 是否已配置有效的 API Key (或使用 Ollama)
  shouldShowSettings: boolean;   // 是否应该自动显示设置面板（首次运行）

  // === 方法 ===
  setMode: (mode: string) => void;
  // ... 其他 setter
  changeLanguage: (lang: string) => void;
  saveConfig: (config: AppConfig) => void;
  setConfig: (config: AppConfig) => void;
  handleTestConnection: () => Promise<void>;
  handleGenerate: () => Promise<{ success?: boolean; needsConfig?: boolean; error?: string }>;
}
```

---

## 关键依赖与配置

### 外部依赖
- `apiAdapters`: 实际执行 API 请求
- `apiKeyDetector`: 处理 404 错误格式化
- `helpers`: Prompt 构建

### 核心逻辑流程

1. **初始化**: 从 localStorage 读取配置。如果未配置 API Key，设置 `shouldShowSettings = true`。
2. **生成**:
   - 检查配置（`isApiKeyConfigured`）。
   - 若未配置，返回 `needsConfig: true`。
   - 若配置有效，构建 Prompt 并调用 API。
   - 处理 404/400 等特定错误。

---

## 变更记录

- **2026-02-10**: 新增 `isApiKeyConfigured` 和 `shouldShowSettings` 状态，优化首次使用体验；集成 `format404Error` 处理模型错误。
- **2026-02-05**: 初始化 Hook。

---

_此文档自动生成。修改代码后请同步更新本文档。_
