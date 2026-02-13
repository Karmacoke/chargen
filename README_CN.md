# 🎭 CharGen - AI 角色生成器

"输入灵感碎片，锻造完整灵魂。"

CharGen 是一个基于 React 和 AI 大模型（LLM）的智能角色生成工具。它专为作家、漫画家、角色设计师、游戏开发者、TRPG (跑团) 玩家和角色扮演爱好者设计。只需提供简单的关键词或选择世界观，AI 就能为你生成一个有血有肉、细节丰富的角色档案。

![CharGen 预览图](./assets/main-page.png)

## ✨ 功能亮点

### 🧠 多模型支持

- **Google Gemini** (原生支持，自动识别 AIza 开头 Key)
- **OpenAI / ChatGPT** (支持 gpt-4o, gpt-3.5 等)
- **Anthropic Claude** (支持 claude-3.5-sonnet 等)
- **国产大模型** (智谱 ChatGLM、Moonshot Kimi、通义千问等)
- **本地模型** (Ollama，无需联网，隐私安全)

### 🎲 双重模式

- **定制模式**：指定世界观、职业、性别和关键词，精准定制。
- **完全随机**：一键生成，寻找意外的灵感。

### 📝 深度设定生成

- **基础档案**：姓名、年龄、种族、阵营、职业。
- **心理侧写**：MBTI 人格、核心欲望、恐惧、致命弱点、高概念、怪癖。
- **外貌特征**：详细的外貌描述和特征列表。
- **背景故事**：详实的生平经历与不可告人的秘密。

### 🤖 NPC 专属指令 (System Prompt)

自动生成一段能够直接复制到 AI 对话（如 ChatGPT）中的 System Prompt，让 AI 立刻扮演该角色与你对话。

### 🎨 视觉设计室 (Image Prompts)

自动生成适配 Stable Diffusion 或 Midjourney 的英文绘画提示词，支持 6 种专业视觉类型：
- 人物肖像 (Portrait)
- 三视图 (Three Views)
- 概念分解图 (Concept Breakdown)
- 表情表 (Expression Sheet)
- 比例图 (Scale Chart)
- 动作姿势 (Action Poses)

### 🌍 多语言界面

支持 7 种语言：简体中文、English、Español、Français、Русский、日本語、한국어

### 🌓 白天/夜间模式

完整的双主题支持，所有 UI 元素完美适配，提供舒适的视觉体验。

---

## 🚀 快速开始

### 在线使用

**可直接访问本项目在 GitHub 上部署的地址：**

👉 [https://karmacoke.github.io/chargen/](https://karmacoke.github.io/chargen/) 立即开始设计你的角色

### 本地运行

想要在你的电脑上运行这个项目？请根据你的操作系统选择对应的方案：

#### 1. 环境准备 (所有系统)

确保你的电脑上已经安装了以下基础软件：

- **Node.js** (推荐下载 LTS 版本)
- **Git** (用于下载代码)

#### 🍎 方案 A：macOS 用户

1. **打开终端**：按 `Command + Space` (空格键)，输入 `Terminal` 并回车。

2. **下载代码**：
   ```bash
   git clone https://github.com/Karmacoke/chargen.git
   ```

3. **进入目录并安装依赖**：
   ```bash
   cd my-chargen
   npm install
   ```

4. **启动项目**：
   ```bash
   npm start
   ```

#### 🪟 方案 B：Windows 用户

1. **打开命令行**：按 `Win + R` 键，输入 `cmd` 或 `powershell`，然后点击确定。

2. **下载代码**：
   ```bash
   git clone https://github.com/Karmacoke/chargen.git
   ```

3. **进入目录并安装依赖**：
   ```bash
   cd my-chargen
   npm install
   ```

4. **启动项目**：
   ```bash
   npm start
   ```

启动成功后，浏览器会自动打开 `http://localhost:3000`，你就可以开始使用了！

---

## ⚙️ 配置指南

![API Key设置面板](./assets/SettingsPanel.png)

### 必读：

**开始生成角色之前请点击界面右上角的 齿轮图标 ⚙️ 进行模型配置。**

### 1. 使用 Google Gemini (推荐)

- 选择 **Gemini** 模型。
- 在 **API Key** 框中输入以 `AIza` 开头的 API Key。
- 在 **模型名称** 栏填入对应的模型名称（如：`gemini-2.0-flash-exp`、`gemini-2.5-flash`）。

### 2. 使用 OpenAI

- 选择 **OpenAI** 模型。
- 在 **API Key** 框中输入以 `sk-` 开头的 API Key。
- 在 **模型名称** 栏填入对应的模型名称（如：`gpt-4o`、`gpt-4o-mini`）。

### 3. 使用 Anthropic Claude

- 选择 **Claude** 模型。
- 在 **API Key** 框中输入 Claude API Key。
- 在 **模型名称** 栏填入对应的模型名称（如：`claude-3-5-sonnet-20241022`）。

### 4. 使用国产大模型 (DeepSeek / Kimi / 千问等)

- 选择对应的模型（**ChatGLM** / **Kimi** / **Qwen**）。
- 在 **API Key** 框中输入 API Key（通常也是 `sk-` 开头）。
- 在 **模型名称** 栏填入对应的模型名称（如：`deepseek-chat`、`moonshot-v1-8k`、`qwen-max`）。

### 5. 使用本地 Ollama

- 将 **AI 提供商** 选为 **Local Ollama**。
- 确保本地已运行 `ollama run deepseek-r1`（或其他模型）。
- 默认地址为 `http://localhost:11434`。

---

## 🛠️ 技术栈

- **框架**：React 19.2.4 (Hooks)
- **脚手架**：Create React App 5.0.1
- **样式**：Tailwind CSS 3.4.17 (响应式设计，白天/夜间双主题)
- **图标**：内联 SVG 图标库
- **API 交互**：Fetch API (Streamless)
- **状态管理**：React Hooks + localStorage 持久化
- **多语言**：自定义 i18n 模块

---

## 📁 项目结构

```
my-chargen/
├── public/               # 静态资源
├── src/
│   ├── components/      # UI 组件
│   │   ├── Icons.jsx           # 图标库
│   │   ├── InputForm.jsx       # 输入表单
│   │   ├── ResultDisplay.jsx   # 结果展示
│   │   └── SettingsPanel.jsx   # 设置面板
│   ├── hooks/           # 自定义 Hooks
│   │   └── useCharacterGeneration.js  # 核心业务逻辑
│   ├── utils/           # 工具函数
│   │   ├── apiAdapters.js      # API 适配器
│   │   ├── helpers.js          # 辅助函数
│   │   └── fetchWithTimeout.js # 超时控制
│   ├── i18n/            # 国际化
│   │   └── translations.js     # 多语言配置
│   ├── CharacterGenerator.jsx  # 主组件
│   └── index.js         # 应用入口
├── tailwind.config.js   # Tailwind 配置
└── package.json         # 项目配置
```

---

## 🎨 特色功能

### 反套路系统

提供 5 个级别的角色设计风格：
- **Ordinary (0/4)** - 经典原型角色
- **Surprising (1/4)** - 带有小惊喜的特质
- **Memorable (2/4)** - 具有内在矛盾的角色
- **Unconventional (3/4)** - 强烈颠覆预期的角色
- **Extreme Rebel (4/4)** - 完全打破常规的角色

### 世界观模板

支持 7 种预设世界观：
- 🏰 奇幻 (Fantasy)
- 🤖 赛博朋克 (Cyberpunk)
- 🏙️ 现代都市 (Modern)
- 🚀 太空歌剧 (Space Opera)
- 🧟 末日废土 (Post-Apocalyptic)
- ⚔️ 武侠仙侠 (Wuxia/Xianxia)
- 🦑 克苏鲁神话 (Lovecraftian)
- ✏️ 自定义世界观

### 一键导出

- **Markdown 文档** - 完整的角色档案
- **NPC System Prompt** - 直接用于 AI 对话
- **Image Prompts** - 6 种视觉类型的绘图咒语
- **JSON 数据** - 结构化数据，便于程序化集成

---

## 🤝 贡献 (Contributing)

欢迎提交 Issue 或 Pull Request！如果你有更好的 Prompt 优化建议或新功能想法，请随时告诉我。

### 如何贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 许可证 (License)

本项目基于 **MIT License** 开源。这意味着你可以免费使用、修改和分发代码。

---

## 🙏 致谢

感谢所有为本项目提供建议和贡献的开发者！

---

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- **GitHub Issues**: [提交问题](https://github.com/Karmacoke/chargen/issues)
- **项目主页**: [https://github.com/Karmacoke/chargen](https://github.com/Karmacoke/chargen)

---

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**
