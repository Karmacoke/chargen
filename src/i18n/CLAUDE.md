# i18n/ 模块文档

[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **i18n**

> 最后更新: 2026-02-10 19:06:54

---

## 模块职责

`i18n/` 模块负责应用的国际化配置，支持 7 种语言。

1. **translations.js**: 包含所有界面文本的字典对象。

---

## 对外接口

### translations 对象

**新增键值对 (2026-02-10)**:
- `btnConfigureApiKey`: "请先配置 API Key ⚙️"
- `settingsTitle`: "模型配置"
- `labelProvider`: "AI 提供商 (Provider)"
- `labelApiKey`: "API Key"
- `labelBaseUrl`: "代理地址 / Base URL"
- `labelModel`: "模型名称 (Model Name)"
- `localOllama`: "本地 Ollama"
- `modelHint`: 模型名称提示
- `btnTest`: "测试连接"
- `statusConnected`, `statusFailed`, `statusTesting`

**支持语言**:
`zh`, `en`, `es`, `fr`, `ru`, `ja`, `ko`

---

## 变更记录

- **2026-02-10**: 增加 API 配置相关的翻译条目（设置面板、测试按钮、错误提示）。
- **2026-02-05**: 初始化国际化模块。

---

_此文档自动生成。修改代码后请同步更新本文档。_
