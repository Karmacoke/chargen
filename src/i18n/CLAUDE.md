# i18n/ 模块文档

[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **i18n**

> 最后更新: 2026-02-05 17:19:56

---

## 模块职责

`i18n/` 模块负责整个应用的国际化配置，支持 7 种语言的界面文本和世界观选项：

1. **translations.js**: 多语言翻译字典和辅助函数

**设计原则**:
- 集中管理所有界面文案
- 扁平化键值对结构（避免深层嵌套）
- 支持动态语言切换（无需重载页面）
- 提供类型安全的辅助函数

---

## 入口与启动

### 导入方式

```javascript
// 导入完整翻译对象
import { translations } from '../i18n/translations';

// 使用示例
const lang = 'zh';
const text = translations[lang].appTitle; // "CharGen"

// 导入辅助函数
import { getTranslation, supportedLanguages } from '../i18n/translations';

const text2 = getTranslation('zh', 'appTitle'); // "CharGen"
const langs = supportedLanguages; // ['zh', 'en', 'es', 'fr', 'ru', 'ja', 'ko']
```

---

## 对外接口

### 1. translations 对象

**数据结构**:
```typescript
interface Translations {
  zh: TranslationStrings;
  en: TranslationStrings;
  es: TranslationStrings;
  fr: TranslationStrings;
  ru: TranslationStrings;
  ja: TranslationStrings;
  ko: TranslationStrings;
}

interface TranslationStrings {
  langName: string;           // 语言自身名称
  appTitle: string;           // 应用标题
  appSubtitle: string;        // 副标题
  heroSubtitle: string;       // Hero 区域副标题

  // 模式相关
  modeCustom: string;
  modeRandom: string;

  // 表单标签
  labelWorld: string;
  labelRole: string;
  labelGender: string;
  labelKeywords: string;

  // 占位符
  placeholderRole: string;
  placeholderGender: string;
  placeholderKeywords: string;

  // 按钮文本
  btnGenerate: string;
  btnGenerating: string;
  btnCopy: string;
  btnCopied: string;
  btnTest: string;
  btnSave: string;

  // 状态文本
  waitingTitle: string;
  waitingDesc: string;
  loadingText: string;
  loadingProvider: string;
  statusConnected: string;
  statusFailed: string;
  statusTesting: string;

  // Tab 标题
  tabCard: string;
  tabSysPrompt: string;
  tabPrompt: string;
  tabJson: string;

  // 章节标题
  secPsychology: string;
  secAppearance: string;
  secBackground: string;

  // 字段标签
  labelMbti: string;
  labelDesire: string;
  labelFear: string;
  labelSecret: string;
  labelSysPrompt: string;
  labelImgPrompt: string;
  labelRawJson: string;
  labelDevGuide: string;

  // 提示文本
  textDevGuide: string;
  textImgGuide: string;
  randomText: string;

  // 错误消息
  errorApiKey: string;

  // 设置相关
  settingsTitle: string;
  labelProvider: string;
  labelApiKey: string;
  labelBaseUrl: string;
  labelModel: string;
  currentModel: string;

  // 世界观选项
  worldOptions: {
    fantasy: string;
    cyberpunk: string;
    modern: string;
    space: string;
    wasteland: string;
    wuxia: string;
    lovecraft: string;
  };
}
```

---

### 2. 辅助函数

#### getTranslation

**函数签名**:
```typescript
function getTranslation(lang: string, key: string): string
```

**功能说明**:
- 获取指定语言的翻译文本
- 如果指定语言不存在，fallback 到中文
- 如果中文也不存在，返回 key 本身

**示例**:
```javascript
getTranslation('zh', 'appTitle');  // "CharGen"
getTranslation('invalid', 'appTitle');  // "CharGen" (fallback)
getTranslation('zh', 'nonExistentKey');  // "nonExistentKey"
```

---

#### supportedLanguages

**类型**:
```typescript
const supportedLanguages: string[]
```

**值**:
```javascript
['zh', 'en', 'es', 'fr', 'ru', 'ja', 'ko']
```

**用途**:
- 生成语言选择器
- 验证用户输入的语言代码
- 遍历所有语言

---

## 关键依赖与配置

### 外部依赖
无（纯 JavaScript 对象导出）

### 语言代码映射

| 代码 | 语言名称 | translations[code].langName |
|-----|---------|---------------------------|
| zh  | 简体中文 | "简体中文" |
| en  | English  | "English" |
| es  | Español  | "Español" |
| fr  | Français | "Français" |
| ru  | Русский  | "Русский" |
| ja  | 日本語   | "日本語" |
| ko  | 한국어   | "한국어" |

---

## 数据模型

### 世界观选项 (worldOptions)

每种语言的 `worldOptions` 键包含 7 种世界观：

```typescript
interface WorldOptions {
  fantasy: string;      // 奇幻
  cyberpunk: string;    // 赛博朋克
  modern: string;       // 现代都市
  space: string;        // 太空歌剧
  wasteland: string;    // 末日废土
  wuxia: string;        // 武侠/仙侠
  lovecraft: string;    // 克苏鲁神话
}
```

**示例值**:
```javascript
// 中文
worldOptions: {
  fantasy: "奇异 (Fantasy) - 剑与魔法，龙与地下城",
  cyberpunk: "赛博朋克 (Cyberpunk) - 高科技低生活",
  // ...
}

// 英文
worldOptions: {
  fantasy: "Fantasy - Sword & Magic, D&D",
  cyberpunk: "Cyberpunk - High Tech Low Life",
  // ...
}
```

---

## 测试与质量

### 测试覆盖缺口

| 功能 | 单元测试 | 完整性测试 |
|-----|---------|-----------|
| translations 对象 | ❌ 无 | ❌ 无 |
| getTranslation | ❌ 无 | ❌ 无 |
| 语言键完整性 | ❌ 无 | ❌ 无 |
| 世界观选项完整性 | ❌ 无 | ❌ 无 |

### 建议补充的测试

#### 1. 翻译完整性测试
```javascript
// __tests__/translations.test.js
import { translations, supportedLanguages } from '../translations';

test('所有语言包含相同的键', () => {
  const zhKeys = Object.keys(translations.zh);

  supportedLanguages.forEach(lang => {
    const langKeys = Object.keys(translations[lang]);
    expect(langKeys).toEqual(zhKeys);
  });
});

test('worldOptions 包含所有 7 种世界观', () => {
  const requiredWorlds = ['fantasy', 'cyberpunk', 'modern', 'space', 'wasteland', 'wuxia', 'lovecraft'];

  supportedLanguages.forEach(lang => {
    const worldKeys = Object.keys(translations[lang].worldOptions);
    expect(worldKeys.sort()).toEqual(requiredWorlds.sort());
  });
});
```

#### 2. getTranslation 测试
```javascript
test('正确返回翻译文本', () => {
  expect(getTranslation('zh', 'appTitle')).toBe('CharGen');
  expect(getTranslation('en', 'appTitle')).toBe('CharGen');
});

test('无效语言时 fallback 到中文', () => {
  expect(getTranslation('invalid', 'appTitle')).toBe('CharGen');
});

test('无效键时返回键本身', () => {
  expect(getTranslation('zh', 'nonExistent')).toBe('nonExistent');
});
```

#### 3. 翻译质量测试（可选）
```javascript
test('所有翻译文本非空', () => {
  supportedLanguages.forEach(lang => {
    Object.entries(translations[lang]).forEach(([key, value]) => {
      if (typeof value === 'string') {
        expect(value.trim()).not.toBe('');
      }
    });
  });
});

test('占位符文本包含示例', () => {
  supportedLanguages.forEach(lang => {
    const placeholderKeys = Object.keys(translations[lang]).filter(k => k.startsWith('placeholder'));
    placeholderKeys.forEach(key => {
      expect(translations[lang][key]).toMatch(/例|e\.g\.|ej\.|ex\.|напр\.|例：|예:/i);
    });
  });
});
```

---

## 常见问题 (FAQ)

### Q1: 如何添加新语言？
**A**:
1. 在 `translations` 对象中添加新语言代码（如 `de` 德语）
2. 复制 `en` 的结构，翻译所有文本
3. 确保 `worldOptions` 包含所有 7 种世界观
4. 在 `supportedLanguages` 数组中添加新代码（自动计算，无需手动添加）

```javascript
translations.de = {
  langName: "Deutsch",
  appTitle: "CharGen",
  // ... 其他翻译
  worldOptions: {
    fantasy: "Fantasy - Schwert & Magie",
    // ...
  }
};
```

### Q2: 如何修改现有翻译？
**A**: 直接修改 `translations.js` 文件中对应语言的值即可，无需重启开发服务器（热更新）。

### Q3: 如何添加新的翻译键？
**A**:
1. 在所有 7 种语言中添加相同的键
2. 建议使用一致的命名规范（如 `label*`、`btn*`、`text*`）
3. 运行测试确保所有语言的键一致

### Q4: 为什么不使用 i18next 或其他库？
**A**:
- 项目较小，纯对象方案更轻量
- 无需异步加载语言包
- 更直观的代码跳转（IDE 支持）
- 如果未来扩展到 100+ 键，可以考虑迁移到 i18next

### Q5: 如何处理带变量的翻译？
**A**: 当前使用字符串模板：
```javascript
// 不推荐：在翻译中硬编码变量
errorApiKey: "请先配置 API Key"

// 推荐：在组件中动态拼接
const message = `${t('errorPrefix')} ${providerName}`;
```

---

## 相关文件清单

```
src/i18n/
└── translations.js  (446 行) - 多语言配置
    ├── translations 对象 (440 行)
    │   ├── zh (简体中文)
    │   ├── en (English)
    │   ├── es (Español)
    │   ├── fr (Français)
    │   ├── ru (Русский)
    │   ├── ja (日本語)
    │   └── ko (한국어)
    ├── getTranslation 函数 (3 行)
    └── supportedLanguages 数组 (1 行)

统计:
  - 支持语言数: 7
  - 每种语言键数: ~60+
  - 世界观选项数: 7
  - 总翻译条目数: ~450
```

---

## 变更记录

- **2026-02-05 17:19**: 初始化国际化模块，从主组件中提取多语言配置
- 建议下一步：补充翻译完整性测试，考虑添加更多语言（德语、意大利语等）

---

_此文档自动生成。修改代码后请同步更新本文档。_
