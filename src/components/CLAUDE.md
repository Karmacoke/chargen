# components/ 模块文档

[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **components**

> 最后更新: 2026-02-10 19:06:54

---

## 模块职责

`components/` 模块包含所有可复用的 UI 组件，遵循"展示组件"（Presentational Components）设计原则：

1. **Icons.jsx**: 内联 SVG 图标库，提供 15+ 个图标组件
2. **InputForm.jsx**: 角色生成输入表单（模式切换、世界观选择、角色信息输入）
3. **ResultDisplay.jsx**: 生成结果展示（4 个 Tab：角色卡、NPC 指令、绘图咒语、JSON）
4. **SettingsPanel.jsx**: API 配置面板（提供商选择、API Key、模型配置、测试连接）

**设计原则**:
- 无业务逻辑，仅负责 UI 渲染
- 所有状态通过 props 传入
- 所有回调函数通过 props 传入
- 自包含样式（Tailwind CSS）

---

## 入口与启动

### 组件导入方式

```javascript
// 在 CharacterGenerator.jsx 中的使用示例
import { Sparkles, Settings, Globe, AlertTriangle } from './components/Icons';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import SettingsPanel from './components/SettingsPanel';
```

---

## 对外接口

### 1. Icons.jsx (图标库)

包含 `Sparkles`, `Settings`, `Globe`, `Wifi`, `Server`, `Save` 等 15+ 个图标。

### 2. InputForm.jsx

**Props 接口**:
```typescript
interface InputFormProps {
  mode: 'custom' | 'random';
  setMode: (mode: string) => void;
  worldSettingKey: string;
  setWorldSettingKey: (key: string) => void;
  // ...其他状态 setter
  translations: object;
  lang: string;
}
```

### 3. ResultDisplay.jsx

**Props 接口**:
```typescript
interface ResultDisplayProps {
  result: CharacterData | null;
  isLoading: boolean;
  config: AppConfig;
  translations: object;
  lang: string;
}
```

### 4. SettingsPanel.jsx

**Props 接口**:
```typescript
interface SettingsPanelProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  testStatus: 'testing' | 'success' | 'fail' | null;
  handleTestConnection: () => Promise<void>;
  saveConfig: (config: AppConfig) => void;
  translations: object;
  lang: string;
}
```

**UI 特性**:
- 提供商选择器（支持 Gemini, OpenAI, Claude, ChatGLM, Kimi, Qwen, Ollama）
- 动态字段显示（Ollama 不需要 API Key）
- 测试连接按钮
- 保存按钮

---

## 关键依赖与配置

### 外部依赖
- `react`
- `Icons.jsx`

### 样式依赖
- **Tailwind CSS**: `fixed inset-0`, `backdrop-blur-sm`, `animate-fadeIn` 等。

---

## 测试与质量

### 建议补充的测试

#### SettingsPanel.jsx
```javascript
test('Ollama 模式下隐藏 API Key 输入框', () => {
  render(<SettingsPanel config={{ provider: 'ollama' }} {...props} />);
  expect(screen.queryByPlaceholderText(/API Key/)).not.toBeInTheDocument();
});
```

---

_此文档自动生成。修改代码后请同步更新本文档。_
