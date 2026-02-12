# src/ 模块文档

[根目录](../CLAUDE.md) > **src**

> 最后更新: 2026-02-10 19:06:54

---

## 变更记录

- **2026-02-10 19:06**: ✨ **API 配置交互优化** - 引入 `apiKeyDetector.js` 自动检测 API Key 类型，`CharacterGenerator` 新增首次运行自动弹出设置面板逻辑。
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
检查 isApiKeyConfigured 状态
    ↓
若未配置 -> 自动弹出 SettingsPanel (shouldShowSettings)
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

---

## 对外接口

该模块**无 RESTful API 或导出函数**，作为纯前端应用，其"接口"体现为：

### 1. 用户交互界面

| 功能模块 | 组件 | 交互点 | 触发行为 |
|---------|-----|-------|------------|
| **输入表单** | InputForm | 世界观下拉、角色/性别输入、关键词文本框 | 更新 Hook 状态 |
| **生成按钮** | CharacterGenerator | 点击"开始锻造" | 调用 `handleGenerate()` |
| **API 配置** | CharacterGenerator | 首页"请先配置 API Key"按钮 | 打开设置面板 |
| **设置面板** | SettingsPanel | 齿轮图标 → 配置 API | 调用 `saveConfig()` |
| **语言切换** | CharacterGenerator | 地球图标 → 选择语言 | 更新 `lang` 状态 |
| **结果展示** | ResultDisplay | 四个 Tab (角色卡/NPC 指令/绘图咒语/JSON) | 切换 `activeTab` |

### 2. 第三方 API 调用接口

API 调用已抽象到 `utils/apiAdapters.js` 中，详见 [utils 模块文档](./utils/CLAUDE.md)。

---

## 关键依赖与配置

### 内部依赖关系

```
CharacterGenerator.jsx (207 行)
    ├─ 依赖 → useCharacterGeneration Hook (业务逻辑)
    ├─ 依赖 → InputForm 组件 (用户输入)
    ├─ 依赖 → ResultDisplay 组件 (结果展示)
    ├─ 依赖 → SettingsPanel 组件 (设置面板)
    ├─ 依赖 → Icons 组件库 (图标)
    └─ 依赖 → translations (国际化)

useCharacterGeneration.js (218 行)
    ├─ 依赖 → apiAdapters (API 调用)
    ├─ 依赖 → helpers (工具函数)
    └─ 依赖 → translations (国际化)
```

### 配置文件

- **Tailwind CSS 配置**: 在 `../tailwind.config.js` 中定义
- **PostCSS 配置**: 在 `../postcss.config.js` 中定义

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

---

## 测试与质量

### 现有测试

#### App.test.js
需更新为 `CharacterGenerator.test.js`。

### 测试覆盖缺口

| 文件/模块 | 单元测试 | 集成测试 | E2E 测试 |
|---------|---------|---------|----------|
| CharacterGenerator.jsx | ❌ 无 | ❌ 无 | ❌ 无 |
| components/ | ❌ 无 | ❌ 无 | ❌ 无 |
| hooks/ | ❌ 无 | ❌ 无 | ❌ 无 |
| utils/ | ❌ 无 | ❌ 无 | ❌ 无 |

### 建议补充的测试

1. **主组件测试**
```javascript
// CharacterGenerator.test.js
describe('CharacterGenerator', () => {
  test('未配置 API Key 时显示配置按钮', () => {
    // Mock useCharacterGeneration returning isApiKeyConfigured: false
    render(<CharacterGenerator />);
    expect(screen.getByText(/请先配置 API Key/i)).toBeInTheDocument();
  });
});
```

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
│   ├── Icons.jsx                (54 行)
│   ├── InputForm.jsx            (121 行)
│   ├── ResultDisplay.jsx        (178 行)
│   └── SettingsPanel.jsx        (138 行)
│
├── hooks/                                - 业务逻辑模块 (218 行)
│   └── useCharacterGeneration.js (218 行)
│
├── utils/                                - 工具函数模块 (538 行)
│   ├── apiAdapters.js           (178 行)
│   ├── helpers.js               (84 行)
│   └── apiKeyDetector.js        (276 行)
│
└── i18n/                                 - 国际化模块 (726 行)
    └── translations.js          (726 行)
```

---

_此文档自动生成。修改代码后请同步更新本文档。_
