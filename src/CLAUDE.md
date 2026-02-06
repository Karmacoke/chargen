# src/ 模块文档

[根目录](../CLAUDE.md) > **src**

> 最后更新: 2026-02-05 17:19:56

---

## 变更记录

- **2026-02-05 17:19**: ✅ 完成重大重构 - 从单体组件拆分为模块化架构
- **2026-02-05 03:24**: 初始化模块文档

---

## 模块职责

`src/` 是项目的核心应用模块，现已采用模块化架构：

1. **UI 渲染与交互**: 通过 4 个独立 UI 组件实现（Icons、InputForm、ResultDisplay、SettingsPanel）
2. **状态管理**: 通过自定义 Hook `useCharacterGeneration` 集中管理所有状态和业务逻辑
3. **API 集成**: 通过适配器模式统一三种 AI 提供商的调用接口
4. **国际化**: 通过独立的 translations 模块支持 7 种语言动态切换
5. **数据持久化**: localStorage 集成用于配置保存

---

## 入口与启动

### 应用启动流程

```
index.js (入口点)
    ↓
ReactDOM.createRoot()
    ↓
<CharacterGenerator /> (主组件 - 207 行)
    ↓
useCharacterGeneration() Hook (业务逻辑)
    ↓
加载 localStorage 配置
    ↓
渲染子组件树:
    - InputForm (输入表单)
    - ResultDisplay (结果展示)
    - SettingsPanel (设置面板)
```

### 入口文件: index.js

```javascript
// 核心职责：挂载 React 应用到 DOM
import React from 'react';
import ReactDOM from 'react-dom/client';
import CharacterGenerator from './CharacterGenerator';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CharacterGenerator />
  </React.StrictMode>
);
```

**关键依赖**:
- `document.getElementById('root')`: 挂载点定义在 `public/index.html`
- `React.StrictMode`: 启用严格模式检测潜在问题

---

## 对外接口

该模块**无 RESTful API 或导出函数**，作为纯前端应用，其"接口"体现为：

### 1. 用户交互界面

| 功能模块 | 组件 | 交互点 | 触发行为 |
|---------|-----|-------|------------|
| **输入表单** | InputForm | 世界观下拉、角色/性别输入、关键词文本框 | 更新 Hook 状态 |
| **生成按钮** | CharacterGenerator | 点击"开始锻造" | 调用 `handleGenerate()` |
| **设置面板** | SettingsPanel | 齿轮图标 → 配置 API | 保存到 localStorage |
| **语言切换** | CharacterGenerator | 地球图标 → 选择语言 | 更新 `lang` 状态 |
| **结果展示** | ResultDisplay | 四个 Tab (角色卡/NPC 指令/绘图咒语/JSON) | 切换 `activeTab` |
| **复制按钮** | ResultDisplay | 各 Tab 中的复制图标 | 调用 `copyToClipboard()` |

### 2. 第三方 API 调用接口

API 调用已抽象到 `utils/apiAdapters.js` 中，详见 [utils 模块文档](./utils/CLAUDE.md)。

---

## 关键依赖与配置

### 外部依赖

```json
{
  "react": "^19.2.4",           // 核心框架
  "react-dom": "^19.2.4",       // DOM 渲染
  "@testing-library/react": "^16.3.2" // 测试工具
}
```

### 内部依赖关系

```
CharacterGenerator.jsx (207 行)
    ├─ 依赖 → useCharacterGeneration Hook (业务逻辑)
    ├─ 依赖 → InputForm 组件 (用户输入)
    ├─ 依赖 → ResultDisplay 组件 (结果展示)
    ├─ 依赖 → SettingsPanel 组件 (设置面板)
    ├─ 依赖 → Icons 组件库 (图标)
    └─ 依赖 → translations (国际化)

useCharacterGeneration.js (179 行)
    ├─ 依赖 → apiAdapters (API 调用)
    ├─ 依赖 → helpers (工具函数)
    └─ 依赖 → translations (国际化)

index.js (11 行)
    ├─ 依赖 → CharacterGenerator
    └─ 依赖 → index.css
```

### 配置文件

- **Tailwind CSS 配置**: 在 `../tailwind.config.js` 中定义
- **PostCSS 配置**: 在 `../postcss.config.js` 中定义
- **Jest 配置**: 集成在 `react-scripts` 中，无需单独配置

---

## 数据模型

### 角色数据结构 (JSON Schema)

```typescript
interface CharacterData {
  identity: {
    name: string;          // 角色名称
    aliases: string;       // 别名/称号
    age: string;           // 年龄
    gender: string;        // 性别
    race: string;          // 种族
    occupation: string;    // 职业
    alignment: string;     // 阵营（守序/中立/混乱）
  };

  appearance: {
    summary: string;       // 外貌概述
    features: string[];    // 特征列表
  };

  psychology: {
    mbti: string;          // MBTI 人格类型
    personality_keywords: string[];  // 性格关键词
    desire: string;        // 核心欲望
    fear: string;          // 核心恐惧
    flaw: string;          // 性格缺陷
  };

  background: {
    origin: string;        // 出身地
    story_summary: string; // 背景故事
    secret: string;        // 不可告人的秘密
  };

  image_prompt: string;    // Stable Diffusion/Midjourney Prompt (英文)
  system_prompt: string;   // LLM 角色扮演指令（多语言）
}
```

### 配置数据结构

```typescript
interface AppConfig {
  provider: 'gemini' | 'openai' | 'ollama';
  apiKey: string;           // 仅 gemini/openai 需要
  baseUrl: string;          // 仅 openai/ollama 需要
  model: string;            // 模型名称
}
```

### 本地存储键值对

```javascript
localStorage.getItem('chargen_config')  // → JSON.stringify(AppConfig)
localStorage.getItem('chargen_lang')    // → 'zh' | 'en' | 'es' | 'fr' | 'ru' | 'ja' | 'ko'
```

---

## 测试与质量

### 现有测试

#### App.test.js
```javascript
// ⚠️ 需要更新：该测试引用了不存在的 App 组件
test('renders learn react link', () => {
  render(<App />);  // 应改为 <CharacterGenerator />
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

#### setupTests.js
```javascript
// 正确配置了 jest-dom 扩展
import '@testing-library/jest-dom';
```

### 测试覆盖率

| 文件/模块 | 单元测试 | 集成测试 | E2E 测试 |
|---------|---------|---------|----------|
| CharacterGenerator.jsx | ❌ 无 | ❌ 无 | ❌ 无 |
| components/ | ❌ 无 | ❌ 无 | ❌ 无 |
| hooks/ | ❌ 无 | ❌ 无 | ❌ 无 |
| utils/ | ❌ 无 | ❌ 无 | ❌ 无 |
| i18n/ | ❌ 无 | ❌ 无 | ❌ 无 |
| index.js | ❌ 无 | ❌ 无 | ❌ 无 |
| App.test.js | ⚠️ 过时 | - | - |

### 建议补充的测试

1. **主组件测试**
```javascript
// CharacterGenerator.test.js
describe('CharacterGenerator', () => {
  test('正确渲染子组件', () => {
    render(<CharacterGenerator />);
    expect(screen.getByText(/CharGen/i)).toBeInTheDocument();
  });

  test('点击设置按钮显示设置面板', () => {
    render(<CharacterGenerator />);
    const settingsBtn = screen.getByTitle(/settingsTitle/i);
    fireEvent.click(settingsBtn);
    expect(screen.getByText(/模型配置/i)).toBeInTheDocument();
  });
});
```

2. **组件测试** (详见各子模块文档)
3. **Hook 测试** (详见 hooks/CLAUDE.md)
4. **工具函数测试** (详见 utils/CLAUDE.md)

---

## 常见问题 (FAQ)

### Q1: 重构后代码在哪里？
**A**:
- **UI 组件**: `src/components/` (Icons、InputForm、ResultDisplay、SettingsPanel)
- **业务逻辑**: `src/hooks/useCharacterGeneration.js`
- **API 调用**: `src/utils/apiAdapters.js`
- **工具函数**: `src/utils/helpers.js`
- **国际化**: `src/i18n/translations.js`

### Q2: 如何调试 API 调用？
**A**:
1. 打开浏览器开发者工具 → Network 标签
2. 生成角色时观察请求详情
3. 查看控制台中的 `console.error` 输出（在 `apiAdapters.js` 中）
4. 使用"测试连接"功能快速验证配置

### Q3: 如何添加新的 UI 组件？
**A**:
1. 在 `components/` 目录创建新文件（如 `HistoryPanel.jsx`）
2. 从 `Icons.jsx` 导入需要的图标
3. 在 `CharacterGenerator.jsx` 中导入并使用
4. 需要状态管理时，在 `useCharacterGeneration` Hook 中添加

### Q4: 如何修改现有组件？
**A**:
- **修改样式**: 直接修改组件中的 Tailwind 类名
- **修改逻辑**: 如果涉及状态，修改 `useCharacterGeneration.js`
- **修改文案**: 修改 `i18n/translations.js` 的对应语言条目

---

## 相关文件清单

```
src/
├── CharacterGenerator.jsx      (207 行)  - 主组件
├── index.js                     (11 行)  - 应用入口
├── index.css                    (未读取) - 全局样式（含 Tailwind 指令）
├── App.test.js                  (9 行)   - 测试文件（需更新）
├── setupTests.js                (6 行)   - 测试配置
│
├── components/                           - UI 组件模块 (491 行)
│   ├── Icons.jsx                (54 行)  - 图标库
│   ├── InputForm.jsx            (121 行) - 输入表单
│   ├── ResultDisplay.jsx        (178 行) - 结果展示
│   └── SettingsPanel.jsx        (138 行) - 设置面板
│
├── hooks/                                - 业务逻辑模块 (179 行)
│   └── useCharacterGeneration.js (179 行) - 核心 Hook
│
├── utils/                                - 工具函数模块 (262 行)
│   ├── apiAdapters.js           (178 行) - API 适配器
│   └── helpers.js               (84 行)  - 辅助函数
│
└── i18n/                                 - 国际化模块 (446 行)
    └── translations.js          (446 行) - 多语言配置
```

---

## 变更记录

- **2026-02-05 17:19**: 完成模块化重构，拆分为 8 个独立文件
- **2026-02-05 03:24**: 初始化模块文档，分析单体组件架构
- 建议下一步：补充所有模块的单元测试，添加集成测试

---

_此文档自动生成。修改代码后请同步更新本文档。_
