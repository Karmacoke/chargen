# components/ 模块文档

[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **components**

> 最后更新: 2026-02-05 17:19:56

---

## 模块职责

`components/` 模块包含所有可复用的 UI 组件，遵循"展示组件"（Presentational Components）设计原则：

1. **Icons.jsx**: 内联 SVG 图标库，提供 15+ 个图标组件
2. **InputForm.jsx**: 角色生成输入表单（模式切换、世界观选择、角色信息输入）
3. **ResultDisplay.jsx**: 生成结果展示（4 个 Tab：角色卡、NPC 指令、绘图咒语、JSON）
4. **SettingsPanel.jsx**: API 配置面板（提供商选择、API Key、模型配置）

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

**注意**:
- Icons 使用**命名导出**（Named Exports）
- 其他组件使用**默认导出**（Default Exports）

---

## 对外接口

### 1. Icons.jsx (图标库)

**导出的图标组件** (共 15 个):

```javascript
export const Sparkles       // 闪光（生成按钮、标题）
export const Dices          // 骰子（随机模式）
export const Copy           // 复制（复制按钮）
export const Terminal       // 终端（JSON Tab）
export const User           // 用户（角色卡 Tab、等待状态）
export const BookOpen       // 书本（角色档案 Tab）
export const Fingerprint    // 指纹（定制模式）
export const Palette        // 调色盘（绘图咒语 Tab）
export const Brain          // 大脑（心理侧写）
export const History        // 历史（背景故事）
export const Check          // 勾选（复制成功反馈）
export const MessageSquare  // 消息框（NPC 指令 Tab）
export const Settings       // 设置（设置按钮）
export const Save           // 保存（保存配置）
export const Server         // 服务器（设置面板标题）
export const Wifi           // WiFi（测试连接）
export const AlertTriangle  // 警告（错误提示）
export const Globe          // 地球（语言切换）
```

**使用示例**:
```javascript
<Sparkles className="w-5 h-5 text-indigo-400" />
```

---

### 2. InputForm.jsx

**Props 接口**:

```typescript
interface InputFormProps {
  mode: 'custom' | 'random';              // 当前模式
  setMode: (mode: string) => void;        // 模式切换回调
  worldSettingKey: string;                // 当前世界观 key
  setWorldSettingKey: (key: string) => void;
  role: string;                           // 角色职业
  setRole: (role: string) => void;
  gender: string;                         // 性别
  setGender: (gender: string) => void;
  keywords: string;                       // 补充线索
  setKeywords: (keywords: string) => void;
  translations: object;                   // 翻译对象
  lang: string;                           // 当前语言
}
```

**功能说明**:
- 模式切换：定制模式 / 完全随机
- 定制模式显示：世界观下拉、角色输入框、性别输入框、关键词文本域
- 随机模式显示：提示文本

---

### 3. ResultDisplay.jsx

**Props 接口**:

```typescript
interface ResultDisplayProps {
  result: CharacterData | null;           // 生成的角色数据
  isLoading: boolean;                     // 加载状态
  config: AppConfig;                      // 当前配置（用于显示提供商）
  translations: object;                   // 翻译对象
  lang: string;                           // 当前语言
}
```

**功能说明**:
- 三种状态展示：等待输入、加载中、结果展示
- 四个 Tab：角色卡、NPC 指令、绘图咒语、JSON 数据
- 每个 Tab 带复制按钮（2 秒反馈动画）

**内部状态**:
```javascript
const [activeTab, setActiveTab] = useState('card');     // 当前 Tab
const [copyFeedback, setCopyFeedback] = useState('');   // 复制反馈状态
```

---

### 4. SettingsPanel.jsx

**Props 接口**:

```typescript
interface SettingsPanelProps {
  showSettings: boolean;                  // 是否显示面板
  setShowSettings: (show: boolean) => void;
  config: AppConfig;                      // 当前配置
  setConfig: (config: AppConfig) => void;
  testStatus: 'testing' | 'success' | 'fail' | null;
  handleTestConnection: () => Promise<void>; // 测试连接回调
  saveConfig: (config: AppConfig) => void;   // 保存配置回调
  translations: object;                   // 翻译对象
  lang: string;                           // 当前语言
}
```

**功能说明**:
- Modal 弹窗设计（固定定位 + 遮罩）
- 提供商选择自动切换默认模型和 Base URL
- API Key 密码框（仅非 Ollama 提供商显示）
- Base URL 输入框（仅非 Gemini 提供商显示）
- 测试连接按钮（带状态反馈）
- 保存并关闭按钮

---

## 关键依赖与配置

### 外部依赖

```javascript
// Icons.jsx
import React from 'react';

// InputForm.jsx
import React from 'react';
import { Fingerprint, Dices } from './Icons';

// ResultDisplay.jsx
import React, { useState } from 'react';
import { User, BookOpen, MessageSquare, Palette, Terminal,
         History, Brain, Check, Copy } from './Icons';
import { copyToClipboard } from '../utils/helpers';

// SettingsPanel.jsx
import React from 'react';
import { Server, Wifi, Save } from './Icons';
```

### 样式依赖

所有组件使用 **Tailwind CSS** 原子类，无外部 CSS 文件依赖。

**常用样式模式**:
```javascript
// 卡片容器
className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl"

// 按钮（主要）
className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"

// 按钮（次要）
className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded"

// 输入框
className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
```

---

## 数据模型

### Icon 组件通用 Props

```typescript
interface IconProps {
  className?: string;  // Tailwind 类名（控制大小、颜色）
}
```

### 角色卡片展示字段映射

```javascript
// ResultDisplay.jsx 中的字段使用
result.identity.name        → 角色名称（大标题）
result.identity.aliases     → 别名（斜体显示）
result.identity.race        → 种族（标签）
result.identity.gender      → 性别（标签）
result.identity.age         → 年龄（标签）
result.identity.occupation  → 职业（高亮标签）
result.identity.alignment   → 阵营（标签）

result.psychology.mbti      → MBTI 类型（黄色字体）
result.psychology.desire    → 核心欲望
result.psychology.fear      → 核心恐惧

result.appearance.summary   → 外貌概述（段落）
result.appearance.features  → 特征列表（带圆点的列表）

result.background.origin    → 出身地
result.background.story_summary → 背景故事（引用框）
result.background.secret    → 秘密（红色警告框）
```

---

## 测试与质量

### 测试覆盖缺口

| 组件 | 单元测试 | 快照测试 | 交互测试 |
|-----|---------|---------|----------|
| Icons.jsx | ❌ 无 | ❌ 无 | ❌ 无 |
| InputForm.jsx | ❌ 无 | ❌ 无 | ❌ 无 |
| ResultDisplay.jsx | ❌ 无 | ❌ 无 | ❌ 无 |
| SettingsPanel.jsx | ❌ 无 | ❌ 无 | ❌ 无 |

### 建议补充的测试

#### 1. Icons.jsx
```javascript
// __tests__/Icons.test.js
import { render } from '@testing-library/react';
import { Sparkles, Copy } from '../Icons';

test('图标正确渲染', () => {
  const { container } = render(<Sparkles className="w-4 h-4" />);
  expect(container.querySelector('svg')).toBeInTheDocument();
  expect(container.querySelector('svg')).toHaveClass('w-4', 'h-4');
});
```

#### 2. InputForm.jsx
```javascript
// __tests__/InputForm.test.js
test('模式切换时显示对应内容', () => {
  const { rerender } = render(<InputForm mode="custom" {...mockProps} />);
  expect(screen.getByLabelText(/世界观/i)).toBeInTheDocument();

  rerender(<InputForm mode="random" {...mockProps} />);
  expect(screen.getByText(/一切交给命运/i)).toBeInTheDocument();
});

test('世界观下拉列表包含所有选项', () => {
  render(<InputForm mode="custom" {...mockProps} />);
  const select = screen.getByLabelText(/世界观/i);
  expect(select.options.length).toBe(7);
});
```

#### 3. ResultDisplay.jsx
```javascript
// __tests__/ResultDisplay.test.js
test('无结果时显示等待状态', () => {
  render(<ResultDisplay result={null} isLoading={false} {...mockProps} />);
  expect(screen.getByText(/等待输入/i)).toBeInTheDocument();
});

test('加载时显示加载动画', () => {
  render(<ResultDisplay result={null} isLoading={true} {...mockProps} />);
  expect(screen.getByText(/生成中/i)).toBeInTheDocument();
});

test('Tab 切换正确显示内容', () => {
  render(<ResultDisplay result={mockCharacter} {...mockProps} />);

  // 默认显示角色卡
  expect(screen.getByText(mockCharacter.identity.name)).toBeInTheDocument();

  // 切换到 JSON Tab
  fireEvent.click(screen.getByText(/JSON 数据/i));
  expect(screen.getByText(/"name":/i)).toBeInTheDocument();
});
```

#### 4. SettingsPanel.jsx
```javascript
// __tests__/SettingsPanel.test.js
test('showSettings=false 时不渲染', () => {
  const { container } = render(<SettingsPanel showSettings={false} {...mockProps} />);
  expect(container).toBeEmptyDOMElement();
});

test('切换提供商自动更新模型和 URL', () => {
  const setConfig = jest.fn();
  render(<SettingsPanel showSettings={true} setConfig={setConfig} {...mockProps} />);

  const select = screen.getByLabelText(/AI 提供商/i);
  fireEvent.change(select, { target: { value: 'ollama' } });

  expect(setConfig).toHaveBeenCalledWith(expect.objectContaining({
    provider: 'ollama',
    model: 'deepseek-r1',
    baseUrl: 'http://localhost:11434'
  }));
});
```

---

## 常见问题 (FAQ)

### Q1: 为什么图标不用外部库（如 react-icons）？
**A**:
- **性能**: 内联 SVG 减少网络请求
- **可控性**: 自定义图标路径更灵活
- **打包体积**: 仅包含使用的图标，避免整个图标库的体积

### Q2: 如何添加新图标？
**A**:
1. 在 `Icons.jsx` 中添加新的导出函数
2. 从 [Lucide Icons](https://lucide.dev) 或 [Heroicons](https://heroicons.com) 复制 SVG 路径
3. 示例：
```javascript
export const NewIcon = ({ className }) => <Icon className={className}>
  <path d="YOUR_SVG_PATH_HERE" />
</Icon>;
```

### Q3: 组件如何获取多语言文本？
**A**:
所有组件通过 props 接收 `translations` 和 `lang`，内部定义辅助函数：
```javascript
const t = (key) => translations[lang]?.[key] || key;
// 使用: <label>{t('labelWorld')}</label>
```

### Q4: 为什么 ResultDisplay 有内部状态？
**A**:
`activeTab` 和 `copyFeedback` 是纯 UI 状态，不需要外部访问或持久化，因此放在组件内部管理更合理。

### Q5: 如何修改组件样式？
**A**:
1. 直接修改 JSX 中的 `className` 属性
2. 使用 Tailwind 的响应式前缀（`md:`、`lg:` 等）
3. 使用动态类名：`` className={`base-class ${condition ? 'active-class' : ''}`} ``

---

## 相关文件清单

```
src/components/
├── Icons.jsx           (54 行)  - 15+ 个图标组件
├── InputForm.jsx       (121 行) - 输入表单组件
├── ResultDisplay.jsx   (178 行) - 结果展示组件
└── SettingsPanel.jsx   (138 行) - 设置面板组件

总计: 491 行代码
```

---

## 变更记录

- **2026-02-05 17:19**: 初始化组件模块，从单体组件中提取
- 建议下一步：为每个组件编写完整的测试套件

---

_此文档自动生成。修改代码后请同步更新本文档。_
