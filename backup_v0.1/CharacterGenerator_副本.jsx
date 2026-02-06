import React, { useState, useEffect } from 'react';

// --- 图标组件定义 (Inline SVGs to fix dependency errors) ---
const Icon = ({ children, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

const Sparkles = ({ className }) => <Icon className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></Icon>;
const Dices = ({ className }) => <Icon className={className}><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /><path d="m17.92 14 3.5-3.5a2.18 2.18 0 0 0 0-3.08l-6-6a2.18 2.18 0 0 0-3.08 0l-3.5 3.5" /><path d="M6 14h.01" /><path d="M10 14h.01" /><path d="M14 18h.01" /><path d="M10 18h.01" /></Icon>;
const Copy = ({ className }) => <Icon className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></Icon>;
const Terminal = ({ className }) => <Icon className={className}><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></Icon>;
const User = ({ className }) => <Icon className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
const BookOpen = ({ className }) => <Icon className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Icon>;
const Fingerprint = ({ className }) => <Icon className={className}><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" /><path d="M8.63 2.2C5.6 4.9 3.6 8.5 3 13.8" /><path d="M12 12a3 3 0 0 0 3 3" /><path d="M12 12v6" /><path d="M12 21v1" /><path d="M19.34 2.8C20 4.5 20.6 6.8 20.9 9.5" /><path d="M19 16.5c.3-3 .2-6-1-8.5" /><path d="M16.5 19a4 4 0 0 0-1-6.5" /></Icon>;
const Palette = ({ className }) => <Icon className={className}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></Icon>;
const Brain = ({ className }) => <Icon className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.97-3.284" /><path d="M17.97 14.716A4 4 0 0 1 18 18" /></Icon>;
const History = ({ className }) => <Icon className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></Icon>;
const Check = ({ className }) => <Icon className={className}><polyline points="20 6 9 17 4 12" /></Icon>;
const MessageSquare = ({ className }) => <Icon className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>;
const Settings = ({ className }) => <Icon className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></Icon>;
const Save = ({ className }) => <Icon className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></Icon>;
const Server = ({ className }) => <Icon className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></Icon>;
const Wifi = ({ className }) => <Icon className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" x2="12.01" y1="20" y2="20" /></Icon>;
const AlertTriangle = ({ className }) => <Icon className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></Icon>;
const Globe = ({ className }) => <Icon className={className}><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>;


// --- 多语言配置 ---
const translations = {
  zh: {
    langName: "简体中文",
    appTitle: "CharGen",
    appSubtitle: "Beta",
    heroSubtitle: "输入灵感碎片，锻造完整灵魂。",
    modeCustom: "定制模式",
    modeRandom: "完全随机",
    labelWorld: "世界观架构",
    labelRole: "职业/身份",
    labelGender: "性别",
    labelKeywords: "补充线索",
    placeholderRole: "例：流浪骑士",
    placeholderGender: "例：女",
    placeholderKeywords: "例：有点神经质，喜欢收集旧硬币...",
    randomText: "一切交给命运。\n系统将为你从零构建一个独特的灵魂。",
    btnGenerate: "开始锻造",
    btnGenerating: "生成中...",
    errorApiKey: "请先点击右上角设置图标，配置 API Key。",
    currentModel: "当前模型:",
    waitingTitle: "等待输入",
    waitingDesc: "请先点击右上角的齿轮图标配置模型参数，然后开始生成。",
    loadingText: "正在构建神经回路...",
    loadingProvider: "调用接口:",
    tabCard: "角色档案",
    tabSysPrompt: "NPC 指令",
    tabPrompt: "绘图咒语",
    tabJson: "JSON 数据",
    secPsychology: "心理侧写",
    labelMbti: "MBTI",
    labelDesire: "欲望",
    labelFear: "恐惧",
    secAppearance: "外貌特征",
    secBackground: "背景故事",
    labelSecret: "不可告人的秘密",
    labelSysPrompt: "LLM System Instruction",
    labelDevGuide: "开发者指南",
    textDevGuide: "这段指令专门用于配置 LLM（如 GPT-4, Claude, 或游戏中的 AI NPC）。将其粘贴到 AI 的 System Prompt（或 System Message）字段中，AI 就会立刻“变成”这个角色，并严格遵循其性格、口吻和背景知识与用户对话。",
    btnCopy: "复制",
    btnCopied: "已复制",
    labelImgPrompt: "Stable Diffusion / Midjourney Prompt",
    textImgGuide: "这个 Prompt 是为了生成角色立绘而优化的。你可以直接将其粘贴到 Midjourney（使用 /imagine 指令）或 Stable Diffusion 的 WebUI 中。如果需要特定风格（如二次元），可以在末尾手动添加 \"anime style\" 或 \"realistic\"。",
    labelRawJson: "Raw JSON Data",
    settingsTitle: "模型配置",
    labelProvider: "AI 提供商 (Provider)",
    labelApiKey: "API Key",
    labelBaseUrl: "代理地址 / Base URL",
    labelModel: "模型名称 (Model Name)",
    btnTest: "测试连接",
    btnSave: "保存并关闭",
    statusConnected: "连接成功",
    statusFailed: "连接失败",
    statusTesting: "测试中...",
    worldOptions: {
      fantasy: "奇异 (Fantasy) - 剑与魔法，龙与地下城",
      cyberpunk: "赛博朋克 (Cyberpunk) - 高科技低生活",
      modern: "现代都市 (Modern) - 现实主义/悬疑",
      space: "太空歌剧 (Space Opera) - 星际旅行",
      wasteland: "末日废土 (Post-Apocalyptic) - 辐射与生存",
      wuxia: "东方武侠/仙侠 (Wuxia/Xianxia) - 江湖修仙",
      lovecraft: "克苏鲁神话 (Lovecraftian) - 不可名状之恐惧"
    }
  },
  en: {
    langName: "English",
    appTitle: "CharGen",
    appSubtitle: "Beta",
    heroSubtitle: "Input fragments, forge a complete soul.",
    modeCustom: "Custom Mode",
    modeRandom: "Random Mode",
    labelWorld: "World Setting",
    labelRole: "Role/Identity",
    labelGender: "Gender",
    labelKeywords: "Keywords/Clues",
    placeholderRole: "e.g. Wandering Knight",
    placeholderGender: "e.g. Female",
    placeholderKeywords: "e.g. Neurotic, collects old coins...",
    randomText: "Leave it to fate.\nThe system will build a unique soul from scratch.",
    btnGenerate: "Start Forging",
    btnGenerating: "Forging...",
    errorApiKey: "Please configure API Key in settings first.",
    currentModel: "Current Model:",
    waitingTitle: "Waiting for Input",
    waitingDesc: "Please configure model settings via the gear icon first.",
    loadingText: "Building neural circuits...",
    loadingProvider: "Provider:",
    tabCard: "Profile",
    tabSysPrompt: "NPC Prompt",
    tabPrompt: "Image Prompt",
    tabJson: "JSON Data",
    secPsychology: "Psychology",
    labelMbti: "MBTI",
    labelDesire: "Desire",
    labelFear: "Fear",
    secAppearance: "Appearance",
    secBackground: "Background",
    labelSecret: "Dark Secret",
    labelSysPrompt: "LLM System Instruction",
    labelDevGuide: "Developer Guide",
    textDevGuide: "This instruction configures LLMs (like GPT-4, Claude) to act as this character. Paste it into the System Prompt field.",
    btnCopy: "Copy",
    btnCopied: "Copied",
    labelImgPrompt: "Stable Diffusion / Midjourney Prompt",
    textImgGuide: "Optimized for character portraits. Use with Midjourney or Stable Diffusion. Add style tags like 'anime' or 'realistic' as needed.",
    labelRawJson: "Raw JSON Data",
    settingsTitle: "Model Configuration",
    labelProvider: "AI Provider",
    labelApiKey: "API Key",
    labelBaseUrl: "Base URL",
    labelModel: "Model Name",
    btnTest: "Test Connection",
    btnSave: "Save & Close",
    statusConnected: "Connected",
    statusFailed: "Failed",
    statusTesting: "Testing...",
    worldOptions: {
      fantasy: "Fantasy - Sword & Magic, D&D",
      cyberpunk: "Cyberpunk - High Tech Low Life",
      modern: "Modern - Realistic/Mystery",
      space: "Space Opera - Interstellar Travel",
      wasteland: "Post-Apocalyptic - Radiation & Survival",
      wuxia: "Wuxia/Xianxia - Martial Arts & Cultivation",
      lovecraft: "Lovecraftian - Cosmic Horror"
    }
  },
  es: {
    langName: "Español",
    appTitle: "CharGen",
    appSubtitle: "Beta",
    heroSubtitle: "Ingresa fragmentos, forja un alma completa.",
    modeCustom: "Personalizado",
    modeRandom: "Aleatorio",
    labelWorld: "Entorno",
    labelRole: "Rol/Identidad",
    labelGender: "Género",
    labelKeywords: "Palabras clave",
    placeholderRole: "ej. Caballero errante",
    placeholderGender: "ej. Mujer",
    placeholderKeywords: "ej. Neurótico, colecciona monedas...",
    randomText: "Déjalo al destino.\nEl sistema construirá un alma única desde cero.",
    btnGenerate: "Empezar",
    btnGenerating: "Generando...",
    errorApiKey: "Configura la API Key en ajustes primero.",
    currentModel: "Modelo actual:",
    waitingTitle: "Esperando entrada",
    waitingDesc: "Configura el modelo en el icono de engranaje primero.",
    loadingText: "Construyendo circuitos neuronales...",
    loadingProvider: "Proveedor:",
    tabCard: "Perfil",
    tabSysPrompt: "Prompt NPC",
    tabPrompt: "Prompt Imagen",
    tabJson: "Datos JSON",
    secPsychology: "Psicología",
    labelMbti: "MBTI",
    labelDesire: "Deseo",
    labelFear: "Miedo",
    secAppearance: "Apariencia",
    secBackground: "Historia",
    labelSecret: "Secreto oscuro",
    labelSysPrompt: "Instrucción del Sistema LLM",
    labelDevGuide: "Guía para desarrolladores",
    textDevGuide: "Esta instrucción configura a los LLM para actuar como este personaje. Pégalo en el campo System Prompt.",
    btnCopy: "Copiar",
    btnCopied: "Copiado",
    labelImgPrompt: "Prompt Stable Diffusion / Midjourney",
    textImgGuide: "Optimizado para retratos. Úsalo con Midjourney o Stable Diffusion.",
    labelRawJson: "Datos JSON sin procesar",
    settingsTitle: "Configuración del modelo",
    labelProvider: "Proveedor de IA",
    labelApiKey: "Clave API",
    labelBaseUrl: "URL Base",
    labelModel: "Nombre del modelo",
    btnTest: "Probar conexión",
    btnSave: "Guardar y cerrar",
    statusConnected: "Conectado",
    statusFailed: "Fallido",
    statusTesting: "Probando...",
    worldOptions: {
      fantasy: "Fantasía - Espada y Hechicería",
      cyberpunk: "Cyberpunk - Alta tecnología, baja vida",
      modern: "Moderno - Realista/Misterio",
      space: "Space Opera - Viaje interestelar",
      wasteland: "Post-apocalíptico - Supervivencia",
      wuxia: "Wuxia/Xianxia - Artes marciales",
      lovecraft: "Lovecraftiano - Terror cósmico"
    }
  },
  fr: {
    langName: "Français",
    appTitle: "CharGen",
    appSubtitle: "Beta",
    heroSubtitle: "Entrez des fragments, forgez une âme.",
    modeCustom: "Personnalisé",
    modeRandom: "Aléatoire",
    labelWorld: "Univers",
    labelRole: "Rôle/Identité",
    labelGender: "Genre",
    labelKeywords: "Mots-clés",
    placeholderRole: "ex: Chevalier errant",
    placeholderGender: "ex: Femme",
    placeholderKeywords: "ex: Névrosé, collectionne les pièces...",
    randomText: "Laissez faire le destin.\nLe système construira une âme unique.",
    btnGenerate: "Forger",
    btnGenerating: "Génération...",
    errorApiKey: "Veuillez d'abord configurer la clé API.",
    currentModel: "Modèle actuel:",
    waitingTitle: "En attente",
    waitingDesc: "Configurez d'abord les paramètres via l'icône d'engrenage.",
    loadingText: "Construction des circuits neuronaux...",
    loadingProvider: "Fournisseur:",
    tabCard: "Profil",
    tabSysPrompt: "Prompt PNJ",
    tabPrompt: "Prompt Image",
    tabJson: "Données JSON",
    secPsychology: "Psychologie",
    labelMbti: "MBTI",
    labelDesire: "Désir",
    labelFear: "Peur",
    secAppearance: "Apparence",
    secBackground: "Histoire",
    labelSecret: "Secret sombre",
    labelSysPrompt: "Instruction Système LLM",
    labelDevGuide: "Guide développeur",
    textDevGuide: "Cette instruction configure les LLM pour incarner ce personnage. Collez-la dans le champ System Prompt.",
    btnCopy: "Copier",
    btnCopied: "Copié",
    labelImgPrompt: "Prompt Stable Diffusion / Midjourney",
    textImgGuide: "Optimisé pour les portraits. À utiliser avec Midjourney ou Stable Diffusion.",
    labelRawJson: "Données JSON brutes",
    settingsTitle: "Configuration du modèle",
    labelProvider: "Fournisseur IA",
    labelApiKey: "Clé API",
    labelBaseUrl: "URL de base",
    labelModel: "Nom du modèle",
    btnTest: "Tester connexion",
    btnSave: "Enregistrer",
    statusConnected: "Connecté",
    statusFailed: "Échec",
    statusTesting: "Test...",
    worldOptions: {
      fantasy: "Fantasy - Épée et Magie",
      cyberpunk: "Cyberpunk - High Tech Low Life",
      modern: "Moderne - Réaliste/Mystère",
      space: "Space Opera - Voyage interstellaire",
      wasteland: "Post-apocalyptique - Survie",
      wuxia: "Wuxia/Xianxia - Arts martiaux",
      lovecraft: "Lovecraftien - Horreur cosmique"
    }
  },
  ru: {
    langName: "Русский",
    appTitle: "CharGen",
    appSubtitle: "Бета",
    heroSubtitle: "Введите фрагменты, выкуйте душу.",
    modeCustom: "Свой режим",
    modeRandom: "Случайно",
    labelWorld: "Сеттинг",
    labelRole: "Роль/Личность",
    labelGender: "Пол",
    labelKeywords: "Ключевые слова",
    placeholderRole: "напр. Странствующий рыцарь",
    placeholderGender: "напр. Женский",
    placeholderKeywords: "напр. Невротик, собирает монеты...",
    randomText: "Доверьтесь судьбе.\nСистема создаст уникальную душу с нуля.",
    btnGenerate: "Создать",
    btnGenerating: "Создание...",
    errorApiKey: "Сначала настройте API Key в настройках.",
    currentModel: "Текущая модель:",
    waitingTitle: "Ожидание ввода",
    waitingDesc: "Сначала настройте параметры модели через значок шестеренки.",
    loadingText: "Построение нейронных цепей...",
    loadingProvider: "Провайдер:",
    tabCard: "Профиль",
    tabSysPrompt: "NPC Промпт",
    tabPrompt: "Арт Промпт",
    tabJson: "JSON Данные",
    secPsychology: "Психология",
    labelMbti: "MBTI",
    labelDesire: "Желание",
    labelFear: "Страх",
    secAppearance: "Внешность",
    secBackground: "История",
    labelSecret: "Темный секрет",
    labelSysPrompt: "Системная инструкция LLM",
    labelDevGuide: "Руководство разработчика",
    textDevGuide: "Эта инструкция настраивает LLM (например, GPT-4) действовать как этот персонаж. Вставьте её в поле System Prompt.",
    btnCopy: "Копировать",
    btnCopied: "Скопировано",
    labelImgPrompt: "Промпт для Stable Diffusion / Midjourney",
    textImgGuide: "Оптимизировано для портретов. Используйте с Midjourney или Stable Diffusion.",
    labelRawJson: "Сырые данные JSON",
    settingsTitle: "Настройка модели",
    labelProvider: "AI Провайдер",
    labelApiKey: "API Ключ",
    labelBaseUrl: "Базовый URL",
    labelModel: "Имя модели",
    btnTest: "Проверить",
    btnSave: "Сохранить",
    statusConnected: "Успешно",
    statusFailed: "Ошибка",
    statusTesting: "Тест...",
    worldOptions: {
      fantasy: "Фэнтези - Меч и Магия",
      cyberpunk: "Киберпанк - Хай-тек",
      modern: "Современность - Реализм",
      space: "Космоопера - Межзвездные путешествия",
      wasteland: "Постапокалипсис - Выживание",
      wuxia: "Уся/Сянься - Боевые искусства",
      lovecraft: "Лавкрафт - Космический ужас"
    }
  },
  ja: {
    langName: "日本語",
    appTitle: "CharGen",
    appSubtitle: "Beta",
    heroSubtitle: "インスピレーションの断片から、完全な魂を鋳造する。",
    modeCustom: "カスタム",
    modeRandom: "ランダム",
    labelWorld: "世界観設定",
    labelRole: "職業/身分",
    labelGender: "性別",
    labelKeywords: "キーワード/手がかり",
    placeholderRole: "例：放浪の騎士",
    placeholderGender: "例：女性",
    placeholderKeywords: "例：神経質、古銭収集が趣味...",
    randomText: "運命に身を任せよう。\nシステムがゼロからユニークな魂を構築します。",
    btnGenerate: "生成開始",
    btnGenerating: "生成中...",
    errorApiKey: "設定（歯車アイコン）からAPIキーを設定してください。",
    currentModel: "現在のモデル:",
    waitingTitle: "入力待ち",
    waitingDesc: "右上部からモデルを設定して、生成を開始してください。",
    loadingText: "神経回路を構築中...",
    loadingProvider: "プロバイダー:",
    tabCard: "プロフィール",
    tabSysPrompt: "NPCプロンプト",
    tabPrompt: "画像プロンプト",
    tabJson: "JSONデータ",
    secPsychology: "心理プロファイル",
    labelMbti: "MBTI",
    labelDesire: "願望",
    labelFear: "恐怖",
    secAppearance: "外見の特徴",
    secBackground: "背景ストーリー",
    labelSecret: "隠された秘密",
    labelSysPrompt: "LLMシステム命令",
    labelDevGuide: "開発者ガイド",
    textDevGuide: "この命令はLLM（GPT-4など）にこのキャラクターを演じさせるための設定です。System Promptフィールドに貼り付けてください。",
    btnCopy: "コピー",
    btnCopied: "完了",
    labelImgPrompt: "Stable Diffusion / Midjourney プロンプト",
    textImgGuide: "キャラクターの立ち絵生成に最適化されています。MidjourneyやStable Diffusionで使用してください。",
    labelRawJson: "Raw JSONデータ",
    settingsTitle: "モデル設定",
    labelProvider: "AIプロバイダー",
    labelApiKey: "APIキー",
    labelBaseUrl: "ベースURL",
    labelModel: "モデル名",
    btnTest: "接続テスト",
    btnSave: "保存して閉じる",
    statusConnected: "接続成功",
    statusFailed: "接続失敗",
    statusTesting: "テスト中...",
    worldOptions: {
      fantasy: "ファンタジー - 剣と魔法",
      cyberpunk: "サイバーパンク - ハイテク・ローライフ",
      modern: "現代 - リアリズム/ミステリー",
      space: "スペースオペラ - 星間旅行",
      wasteland: "ポストアポカリプス - 荒廃と生存",
      wuxia: "武侠/仙侠 - 東洋ファンタジー",
      lovecraft: "ラヴクラフト - コズミック・ホラー"
    }
  },
  ko: {
    langName: "한국어",
    appTitle: "CharGen",
    appSubtitle: "Beta",
    heroSubtitle: "영감의 조각으로 완전한 영혼을 주조하세요.",
    modeCustom: "커스텀 모드",
    modeRandom: "완전 랜덤",
    labelWorld: "세계관 설정",
    labelRole: "직업/신분",
    labelGender: "성별",
    labelKeywords: "키워드/단서",
    placeholderRole: "예: 방랑 기사",
    placeholderGender: "예: 여성",
    placeholderKeywords: "예: 신경질적임, 오래된 동전 수집...",
    randomText: "운명에 맡기세요.\n시스템이 제로부터 독특한 영혼을 구축합니다.",
    btnGenerate: "생성 시작",
    btnGenerating: "생성 중...",
    errorApiKey: "먼저 설정(기어 아이콘)에서 API 키를 구성하세요.",
    currentModel: "현재 모델:",
    waitingTitle: "입력 대기 중",
    waitingDesc: "먼저 오른쪽 상단의 기어 아이콘을 클릭하여 모델을 설정하세요.",
    loadingText: "신경 회로 구축 중...",
    loadingProvider: "공급자:",
    tabCard: "프로필",
    tabSysPrompt: "NPC 프롬프트",
    tabPrompt: "이미지 프롬프트",
    tabJson: "JSON 데이터",
    secPsychology: "심리 프로필",
    labelMbti: "MBTI",
    labelDesire: "욕망",
    labelFear: "공포",
    secAppearance: "외모 특징",
    secBackground: "배경 이야기",
    labelSecret: "숨겨진 비밀",
    labelSysPrompt: "LLM 시스템 지침",
    labelDevGuide: "개발자 가이드",
    textDevGuide: "이 지침은 LLM(GPT-4 등)이 이 캐릭터를 연기하도록 구성하는 데 사용됩니다. System Prompt 필드에 붙여넣으세요.",
    btnCopy: "복사",
    btnCopied: "완료",
    labelImgPrompt: "Stable Diffusion / Midjourney 프롬프트",
    textImgGuide: "캐릭터 초상화 생성에 최적화되었습니다. Midjourney 또는 Stable Diffusion에서 사용하세요.",
    labelRawJson: "Raw JSON 데이터",
    settingsTitle: "모델 구성",
    labelProvider: "AI 공급자",
    labelApiKey: "API 키",
    labelBaseUrl: "기본 URL",
    labelModel: "모델 이름",
    btnTest: "연결 테스트",
    btnSave: "저장 및 닫기",
    statusConnected: "연결 성공",
    statusFailed: "연결 실패",
    statusTesting: "테스트 중...",
    worldOptions: {
      fantasy: "판타지 - 검과 마법",
      cyberpunk: "사이버펑크 - 하이테크 로우라이프",
      modern: "현대 - 리얼리즘/미스터리",
      space: "스페이스 오페라 - 성간 여행",
      wasteland: "포스트 아포칼립스 - 생존",
      wuxia: "무협/선협 - 동양 판타지",
      lovecraft: "러브크래프트 - 코스믹 호러"
    }
  }
};

const CharacterGenerator = () => {
  
  // --- 2. 状态定义 ---

  // 语言状态
  const [lang, setLang] = useState('zh'); // 默认中文

  // 用户输入状态
  const [mode, setMode] = useState('custom'); 
  const [worldSettingKey, setWorldSettingKey] = useState('fantasy'); // 存key而不是具体的文字
  const [role, setRole] = useState('');     
  const [gender, setGender] = useState(''); 
  const [keywords, setKeywords] = useState(''); 
  
  // 运行状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');             
  const [result, setResult] = useState(null);         
  const [activeTab, setActiveTab] = useState('card'); 
  const [copyFeedback, setCopyFeedback] = useState('');
  
  // === 设置面板状态 ===
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    provider: 'gemini', // 'gemini', 'openai', 'ollama'
    apiKey: '',
    baseUrl: '', // 仅用于 OpenAI/Ollama
    model: 'gemini-1.5-flash'
  });
  const [testStatus, setTestStatus] = useState(null); // 'testing', 'success', 'fail'

  // --- 3. 生命周期：加载保存的设置 ---
  useEffect(() => {
    const savedConfig = localStorage.getItem('chargen_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    // 尝试读取语言偏好
    const savedLang = localStorage.getItem('chargen_lang');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  // 切换语言时保存偏好
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('chargen_lang', newLang);
  };

  // --- 4. 辅助函数 ---
  
  // 获取当前语言的翻译文本
  const t = (key) => {
    return translations[lang][key] || translations['zh'][key] || key;
  };

  const copyToClipboard = (text, type) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy'); 
      setCopyFeedback(type); 
      setTimeout(() => setCopyFeedback(''), 2000); 
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea); 
  };

  // 保存设置到本地
  const saveConfig = () => {
    localStorage.setItem('chargen_config', JSON.stringify(config));
    setShowSettings(false);
    setError(''); 
  };

  // 测试连接
  const testConnection = async () => {
    if (config.provider !== 'ollama' && !config.apiKey) {
      setTestStatus('fail');
      return;
    }

    setTestStatus('testing');
    try {
      let response;
      if (config.provider === 'gemini') {
        if (!config.apiKey) throw new Error("Missing API Key");

        // 支持 v1beta (用于新模型) 和 v1 (用于稳定模型)
        const apiVersion = config.model.includes('2.0') || config.model.includes('2.5') || config.model.includes('exp') ? 'v1beta' : 'v1';
        const modelName = config.model.includes('/') ? config.model : `models/${config.model}`;
        response = await fetch(`https://generativelanguage.googleapis.com//${apiVersion}/${modelName}:generateContent?key=${config.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
        });
      } else {
        const url = config.provider === 'ollama' 
          ? `${config.baseUrl || 'http://localhost:11434'}/api/chat`
          : `${config.baseUrl || 'https://api.openai.com/v1'}/chat/completions`;
        
        const headers = { 'Content-Type': 'application/json' };
        if (config.provider === 'openai') headers['Authorization'] = `Bearer ${config.apiKey}`;

        const body = config.provider === 'ollama' 
          ? JSON.stringify({ model: config.model, messages: [{ role: 'user', content: 'hi' }], stream: false })
          : JSON.stringify({ model: config.model, messages: [{ role: 'user', content: 'hi' }] });

        response = await fetch(url, { method: 'POST', headers, body });
      }

      if (response.ok) {
        setTestStatus('success');
        setTimeout(() => setTestStatus(null), 2000);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (e) {
      console.error(e);
      setTestStatus('fail');
    }
  };

// --- 5. 核心逻辑：多模型适配 (防呆修复版) ---
  const handleGenerate = async () => {
    // 1. 自动清理空格 (防止复制粘贴带空格导致的 400 错误)
    const cleanApiKey = config.apiKey ? config.apiKey.trim() : "";
    const cleanModel = config.model ? config.model.trim() : "";

    if (config.provider !== 'ollama' && !cleanApiKey) {
      setError(t('errorApiKey'));
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    const currentWorldSetting = translations[lang].worldOptions[worldSettingKey];
    const targetLanguageName = translations[lang].langName;

    // 构建 Prompt
    let userPrompt = "";
    if (mode === 'random') {
      const keys = Object.keys(translations[lang].worldOptions);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const randomWorld = translations[lang].worldOptions[randomKey];
      userPrompt = `Please generate a detailed character completely at random. World setting: ${randomWorld}. Language of output MUST be: ${targetLanguageName}.`;
    } else {
      userPrompt = `Please generate and refine a detailed character based on the following clues:
      - World View: ${currentWorldSetting}
      - Role/Identity: ${role || 'Random'}
      - Gender: ${gender || 'Random'}
      - Keywords/Clues: ${keywords || 'None, please improvise'}
      If information is scarce, please complete it creatively. 
      IMPORTANT: The output content MUST be in ${targetLanguageName} language.`;
    }

    const systemInstruction = `
    You are a professional Character Generator API.
    Your task is to generate a highly detailed fictional character based on user input.
    You MUST output strictly in JSON format. NO Markdown tags.
    Use ${targetLanguageName} for all text fields (except image_prompt and system_prompt).

    JSON Structure:
    {
      "identity": { "name": "Name", "aliases": "Aliases", "age": "Age", "gender": "Gender", "race": "Race", "occupation": "Occupation", "alignment": "Alignment" },
      "appearance": { "summary": "Summary", "features": ["Feature1"] },
      "psychology": { "mbti": "MBTI", "personality_keywords": ["Key1"], "desire": "Desire", "fear": "Fear", "flaw": "Flaw" },
      "background": { "origin": "Origin", "story_summary": "Story", "secret": "Secret" },
      "image_prompt": "Visual description tags for Stable Diffusion/Midjourney (in English)",
      "system_prompt": "A detailed system instruction in ${targetLanguageName} that tells an LLM to roleplay as THIS specific character. It should include: the character's name, personality traits, background, speaking style, knowledge, and behavioral patterns. Example format: 'You are [Name], a [occupation] from [origin]. Your personality is [traits]. You speak in a [style] manner. You know about [knowledge]. When interacting, you tend to [behaviors]...'"
    }

    IMPORTANT: The "system_prompt" field MUST be a roleplay instruction for THIS SPECIFIC CHARACTER, NOT a general character generator instruction.
    `;

    try {
      let data;
      
      // === Google Gemini 分支 (兼容性写法) ===
      if (config.provider === 'gemini') {
        // 技巧：将 System Instruction 合并到 Prompt 中，避免 API 版本兼容问题导致的 400
        const finalPrompt = `${systemInstruction}\n\n---\n\nUser Request: ${userPrompt}`;

        // 支持 v1beta (用于新模型) 和 v1 (用于稳定模型)
        const apiVersion = cleanModel.includes('2.0') || cleanModel.includes('2.5') || cleanModel.includes('exp') ? 'v1beta' : 'v1';
        const modelName = cleanModel.includes('/') ? cleanModel : `models/${cleanModel}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/${apiVersion}/${modelName}:generateContent?key=${cleanApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: finalPrompt }] }]
            // 移除了复杂的 generationConfig 和 systemInstruction 字段，改用纯文本 Prompt 控制
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini Error Details:", errorText); // 在控制台打印详细错误
          throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
        }

        const resJson = await response.json();
        const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response");
        
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanJson);
      } 
      
      // === OpenAI / DeepSeek / Ollama 分支 ===
      else {
        let baseUrl = config.baseUrl || (config.provider === 'ollama' ? 'http://localhost:11434/v1' : 'https://api.openai.com/v1');
        baseUrl = baseUrl.replace(/\/$/, '');

        const headers = { 'Content-Type': 'application/json' };
        if (config.provider === 'openai') headers['Authorization'] = `Bearer ${cleanApiKey}`;

        const body = {
          model: cleanModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt }
          ],
          // Ollama 有些模型不支持 json_object 模式，为了兼容性这里先注释掉，靠 Prompt 约束
          // response_format: { type: "json_object" }, 
          temperature: 0.7
        };

        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`API Error (${response.status}): ${errText}`);
        }

        const resJson = await response.json();
        const text = resJson.choices?.[0]?.message?.content;
        if (!text) throw new Error("Empty response");

        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanJson);
      }

      setResult(data);

    } catch (err) {
      console.error(err);
      let msg = err.message;
      // 提取更友好的错误信息
      if (msg.includes("400")) msg = "请求格式错误 (400)。请检查 API Key 是否有多余空格，或者尝试更换模型名称。";
      else if (msg.includes("Failed to fetch")) msg = lang === 'zh' ? "无法连接服务器。请检查网络/魔法设置。" : "Network Error.";
      else if (msg.includes("JSON")) msg = lang === 'zh' ? "AI 生成的内容格式有误，请重试。" : "Invalid JSON format.";
      
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. UI 渲染 ---
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8 relative overflow-hidden">
      
      {/* 顶部栏：标题 + 语言 + 设置 */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
           <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
             {t('appTitle')}
           </h1>
           <span className="text-xs text-gray-500 font-mono border border-gray-700 rounded px-1">{t('appSubtitle')}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 语言选择器 */}
          <div className="relative group z-20">
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition-colors shadow-lg flex items-center gap-2 px-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300 font-medium hidden sm:inline">{translations[lang].langName}</span>
            </button>
            {/* 下拉菜单 (Hover显示) */}
            <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden hidden group-hover:block animate-fadeIn">
              {Object.keys(translations).map((l) => (
                <button 
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${lang === l ? 'text-indigo-400 font-bold' : 'text-gray-300'}`}
                >
                  {translations[l].langName}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition-colors shadow-lg group"
            title={t('settingsTitle')}
          >
            <Settings className={`w-6 h-6 text-gray-400 group-hover:text-white transition-transform ${showSettings ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-0">
        
        {/* === 设置面板 (Settings Modal) === */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  {t('settingsTitle')}
                </h2>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              
              <div className="p-6 space-y-5 overflow-y-auto">
                {/* 1. 供应商选择 */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('labelProvider')}</label>
                  <select 
                    value={config.provider}
                    onChange={(e) => {
                      const newProvider = e.target.value;
                      let newModel = config.model;
                      let newBaseUrl = '';
                      if (newProvider === 'gemini') newModel = 'gemini-2.0-flash-exp';
                      if (newProvider === 'ollama') { newModel = 'deepseek-r1'; newBaseUrl = 'http://localhost:11434'; }
                      if (newProvider === 'openai') { newModel = 'gpt-4o-mini'; newBaseUrl = 'https://api.openai.com/v1'; }
                      setConfig({ ...config, provider: newProvider, model: newModel, baseUrl: newBaseUrl });
                    }}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="gemini">Google Gemini (Free/Rec)</option>
                    <option value="openai">OpenAI / DeepSeek (Cloud)</option>
                    <option value="ollama">Local Ollama</option>
                  </select>
                </div>

                {/* 2. API Key */}
                {config.provider !== 'ollama' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('labelApiKey')}</label>
                    <input 
                      type="password" 
                      placeholder="sk-..." 
                      value={config.apiKey}
                      onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* 3. Base URL */}
                {config.provider !== 'gemini' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('labelBaseUrl')}</label>
                    <input 
                      type="text" 
                      placeholder={config.provider === 'ollama' ? "http://localhost:11434" : "https://api.openai.com/v1"}
                      value={config.baseUrl}
                      onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm"
                    />
                  </div>
                )}

                {/* 4. 模型名称 */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('labelModel')}</label>
                  <input 
                    type="text" 
                    value={config.model}
                    onChange={(e) => setConfig({...config, model: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 bg-gray-800 flex justify-between gap-4">
                <button 
                  onClick={testConnection}
                  disabled={testStatus === 'testing' || (config.provider !== 'ollama' && !config.apiKey)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    testStatus === 'success' ? 'bg-green-600 text-white' : 
                    testStatus === 'fail' ? 'bg-red-600 text-white' : 
                    (config.provider !== 'ollama' && !config.apiKey) ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 
                    'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                >
                  {testStatus === 'testing' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wifi className="w-4 h-4" />}
                  {testStatus === 'success' ? t('statusConnected') : testStatus === 'fail' ? t('statusFailed') : t('btnTest')}
                </button>
                
                <button 
                  onClick={saveConfig}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t('btnSave')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === 左侧栏：输入区 === */}
        <div className="lg:col-span-4 space-y-6">
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-400" />
              {t('appTitle')}
            </h1>
            <p className="text-gray-400 mt-2 ml-11">{t('heroSubtitle')}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
            {/* 模式切换 */}
            <div className="flex bg-gray-900/80 p-1 rounded-lg mb-6">
              <button
                onClick={() => setMode('custom')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'custom' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Fingerprint className="w-4 h-4" />
                {t('modeCustom')}
              </button>
              <button
                onClick={() => setMode('random')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'random' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Dices className="w-4 h-4" />
                {t('modeRandom')}
              </button>
            </div>

            {/* 表单 */}
            {mode === 'custom' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('labelWorld')}</label>
                  <select 
                    value={worldSettingKey} 
                    onChange={(e) => setWorldSettingKey(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {/* 使用当前语言渲染选项列表 */}
                    {Object.entries(translations[lang].worldOptions).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('labelRole')}</label>
                    <input 
                      type="text" placeholder={t('placeholderRole')} value={role} onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('labelGender')}</label>
                    <input 
                      type="text" placeholder={t('placeholderGender')} value={gender} onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('labelKeywords')}</label>
                  <textarea 
                    rows="3" placeholder={t('placeholderKeywords')} value={keywords} onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30">
                <Dices className="w-12 h-12 mx-auto mb-3 text-pink-500 opacity-50" />
                <p className="text-sm whitespace-pre-wrap">{t('randomText')}</p>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('btnGenerating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t('btnGenerate')}
                </>
              )}
            </button>
            
            {/* 错误提示区 */}
            {error && (
              <div className="mt-4 bg-red-900/20 border border-red-900/50 rounded-lg p-3 flex gap-3 text-sm text-red-200 animate-fadeIn">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <p>{error}</p>
              </div>
            )}
            
            {/* 当前配置状态提示 */}
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-600">
                {t('currentModel')} {config.provider} ({config.model})
              </span>
            </div>
          </div>
        </div>

        {/* === 右侧栏：结果展示 === */}
        <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden relative min-h-[500px]">
          
          {/* 状态1：等待输入 */}
          {!result && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-4 ring-1 ring-gray-700">
                <User className="w-10 h-10 opacity-50" />
              </div>
              <h3 className="text-xl font-medium text-gray-300">{t('waitingTitle')}</h3>
              <p className="max-w-xs mt-2 text-sm">{t('waitingDesc')}</p>
            </div>
          )}

          {/* 状态2：加载中 */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 z-10 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
              <p className="text-indigo-300 font-mono animate-pulse">{t('loadingText')}</p>
              <p className="text-xs text-gray-500 mt-2">{t('loadingProvider')} {config.provider}</p>
            </div>
          )}

          {/* 状态3：结果展示 */}
          {result && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-700 bg-gray-900/50 overflow-x-auto">
                <button onClick={() => setActiveTab('card')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'card' ? 'border-indigo-500 text-indigo-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}><BookOpen className="w-4 h-4" /> {t('tabCard')}</button>
                <button onClick={() => setActiveTab('sysprompt')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'sysprompt' ? 'border-yellow-500 text-yellow-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}><MessageSquare className="w-4 h-4" /> {t('tabSysPrompt')}</button>
                <button onClick={() => setActiveTab('prompt')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'prompt' ? 'border-pink-500 text-pink-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}><Palette className="w-4 h-4" /> {t('tabPrompt')}</button>
                <button onClick={() => setActiveTab('json')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'json' ? 'border-emerald-500 text-emerald-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}><Terminal className="w-4 h-4" /> {t('tabJson')}</button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {/* 角色卡片 */}
                {activeTab === 'card' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col md:flex-row gap-6 items-start border-b border-gray-700 pb-6">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2">
                          <h2 className="text-3xl font-bold text-white">{result.identity.name}</h2>
                          {result.identity.aliases && <span className="text-indigo-400 italic font-medium">"{result.identity.aliases}"</span>}
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                          <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.race}</span>
                          <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.gender}</span>
                          <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.age}</span>
                          <span className="bg-indigo-900/50 text-indigo-200 px-2 py-1 rounded border border-indigo-700/50">{result.identity.occupation}</span>
                          <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.alignment}</span>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Brain className="w-3 h-3" /> {t('secPsychology')}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-400">{t('labelMbti')}</span><span className="text-yellow-400 font-mono">{result.psychology.mbti}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">{t('labelDesire')}</span><span className="text-gray-200 text-right w-2/3 truncate">{result.psychology.desire}</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">{t('labelFear')}</span><span className="text-gray-200 text-right w-2/3 truncate">{result.psychology.fear}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-pink-400 flex items-center gap-2"><User className="w-5 h-5" /> {t('secAppearance')}</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">{result.appearance.summary}</p>
                        <ul className="space-y-2 mt-2">{result.appearance.features.map((feature, idx) => ( <li key={idx} className="flex items-start gap-2 text-sm text-gray-400"><span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-pink-500 flex-shrink-0"></span>{feature}</li>))}</ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2"><History className="w-5 h-5" /> {t('secBackground')}</h3>
                        <div className="bg-gray-900/30 p-4 rounded-lg border-l-2 border-indigo-500"><p className="text-gray-300 leading-relaxed text-sm italic">{result.background.story_summary}</p></div>
                        <div className="pt-2"><h4 className="text-xs font-bold text-red-400 uppercase mb-2">{t('labelSecret')}</h4><p className="text-sm text-gray-400 bg-red-900/10 p-2 rounded border border-red-900/30">{result.background.secret}</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NPC 指令 */}
                {activeTab === 'sysprompt' && (
                  <div className="animate-fadeIn space-y-6">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 relative group">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">{t('labelSysPrompt')}</h3>
                        <button onClick={() => copyToClipboard(result.system_prompt || "", 'sysprompt')} className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-colors border border-gray-600">{copyFeedback === 'sysprompt' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}{copyFeedback === 'sysprompt' ? t('btnCopied') : t('btnCopy')}</button>
                      </div>
                      <div className="font-mono text-sm text-yellow-300 leading-relaxed whitespace-pre-wrap bg-black/30 p-4 rounded-lg border-l-4 border-yellow-500">{result.system_prompt || "生成失败"}</div>
                    </div>
                    <div className="bg-yellow-900/10 p-4 rounded-lg border border-yellow-800/30 flex gap-3">
                       <div className="flex-shrink-0 mt-1"><MessageSquare className="w-5 h-5 text-yellow-500" /></div>
                       <div>
                         <h4 className="text-sm font-bold text-yellow-400 mb-1">{t('labelDevGuide')}</h4>
                         <p className="text-xs text-gray-400">{t('textDevGuide')}</p>
                       </div>
                    </div>
                  </div>
                )}

                {/* 绘图 Prompt */}
                {activeTab === 'prompt' && (
                  <div className="animate-fadeIn space-y-6">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                       <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('labelImgPrompt')}</h3>
                        <button onClick={() => copyToClipboard(result.image_prompt, 'prompt')} className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-colors border border-gray-600">{copyFeedback === 'prompt' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}{copyFeedback === 'prompt' ? t('btnCopied') : t('btnCopy')}</button>
                      </div>
                      <p className="font-mono text-sm text-pink-300 leading-relaxed break-words bg-black/30 p-4 rounded-lg">{result.image_prompt}</p>
                    </div>
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30 flex gap-3">
                       <div className="flex-shrink-0 mt-1"><Palette className="w-5 h-5 text-blue-400" /></div>
                       <div><h4 className="text-sm font-bold text-blue-300 mb-1">{t('labelDevGuide')}</h4><p className="text-xs text-gray-400">{t('textImgGuide')}</p></div>
                    </div>
                  </div>
                )}

                {/* JSON Data */}
                {activeTab === 'json' && (
                  <div className="animate-fadeIn h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('labelRawJson')}</h3>
                      <button onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'json')} className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-colors border border-gray-600">{copyFeedback === 'json' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}{copyFeedback === 'json' ? t('btnCopied') : t('btnCopy')}</button>
                    </div>
                    <pre className="bg-gray-950 p-4 rounded-lg text-emerald-400 font-mono text-xs overflow-auto custom-scrollbar flex-1 border border-gray-800">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                )}
                
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.8); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(107, 114, 128, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CharacterGenerator;