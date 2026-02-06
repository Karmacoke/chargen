/**
 * API Key 检测与提供商识别工具
 * 自动识别 API Key 类型并推荐配置
 */

/**
 * API Key 模式匹配规则
 */
const API_KEY_PATTERNS = {
  gemini: {
    pattern: /^AIza[A-Za-z0-9_-]{35}$/,
    name: 'Google Gemini',
    provider: 'gemini',
    defaultModels: [
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash-8b'
    ],
    baseUrl: null
  },
  openai: {
    pattern: /^sk-[A-Za-z0-9]{32,}$/,
    name: 'OpenAI',
    provider: 'openai',
    defaultModels: [
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-3.5-turbo',
      'gpt-4-turbo'
    ],
    baseUrl: 'https://api.openai.com/v1'
  },
  deepseek: {
    pattern: /^sk-[a-f0-9]{32}$/,
    name: 'DeepSeek',
    provider: 'openai',
    defaultModels: [
      'deepseek-chat',
      'deepseek-coder'
    ],
    baseUrl: 'https://api.deepseek.com'
  },
  claude: {
    pattern: /^sk-ant-[A-Za-z0-9_-]+$/,
    name: 'Anthropic Claude',
    provider: 'claude',
    defaultModels: [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229'
    ],
    baseUrl: 'https://api.anthropic.com/v1'
  },
  chatglm: {
    pattern: /^[a-f0-9]{32}\.[A-Za-z0-9]{6,}$/,
    name: '智谱 ChatGLM',
    provider: 'chatglm',
    defaultModels: [
      'glm-4-flash',
      'glm-4-plus',
      'glm-4'
    ],
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  },
  kimi: {
    pattern: /^sk-[A-Za-z0-9]{48,}$/,
    name: 'Moonshot Kimi',
    provider: 'kimi',
    defaultModels: [
      'moonshot-v1-8k',
      'moonshot-v1-32k',
      'moonshot-v1-128k'
    ],
    baseUrl: 'https://api.moonshot.cn/v1'
  },
  qwen: {
    pattern: /^sk-[a-z0-9]{32}$/,
    name: '通义千问 Qwen',
    provider: 'qwen',
    defaultModels: [
      'qwen-plus',
      'qwen-turbo',
      'qwen-max'
    ],
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  }
};

/**
 * 检测 API Key 类型
 * @param {string} apiKey - 用户输入的 API Key
 * @returns {Object|null} - { type, name, provider, models, baseUrl } 或 null
 */
export const detectApiKeyType = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') return null;

  const cleanKey = apiKey.trim();

  for (const [type, config] of Object.entries(API_KEY_PATTERNS)) {
    if (config.pattern.test(cleanKey)) {
      return {
        type,
        name: config.name,
        provider: config.provider,
        models: config.defaultModels,
        baseUrl: config.baseUrl
      };
    }
  }

  return null;
};

/**
 * 根据提供商推荐模型
 * @param {string} provider - 提供商类型
 * @returns {string[]} - 推荐的模型列表
 */
export const getRecommendedModels = (provider) => {
  const recommendations = {
    gemini: [
      { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash Exp (推荐 - 最新)', recommended: true },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (稳定)', recommended: false },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (强大)', recommended: false },
      { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B (快速)', recommended: false },
      { value: '__custom__', label: '✏️ 自定义模型名称...', recommended: false }
    ],
    openai: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (推荐 - 性价比高)', recommended: true },
      { value: 'gpt-4o', label: 'GPT-4o (强大)', recommended: false },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (经济)', recommended: false },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (平衡)', recommended: false },
      { value: 'deepseek-chat', label: 'DeepSeek Chat (兼容)', recommended: false },
      { value: '__custom__', label: '✏️ 自定义模型名称...', recommended: false }
    ],
    claude: [
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (推荐)', recommended: true },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (快速)', recommended: false },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (强大)', recommended: false },
      { value: '__custom__', label: '✏️ 自定义模型名称...', recommended: false }
    ],
    chatglm: [
      { value: 'glm-4-flash', label: 'GLM-4 Flash (推荐 - 快速)', recommended: true },
      { value: 'glm-4-plus', label: 'GLM-4 Plus (强大)', recommended: false },
      { value: 'glm-4', label: 'GLM-4 (标准)', recommended: false },
      { value: '__custom__', label: '✏️ 自定义模型名称...', recommended: false }
    ],
    kimi: [
      { value: 'moonshot-v1-8k', label: 'Moonshot v1 8K (推荐)', recommended: true },
      { value: 'moonshot-v1-32k', label: 'Moonshot v1 32K', recommended: false },
      { value: 'moonshot-v1-128k', label: 'Moonshot v1 128K (长文本)', recommended: false },
      { value: '__custom__', label: '✏️ 自定义模型名称...', recommended: false }
    ],
    qwen: [
      { value: 'qwen-plus', label: 'Qwen Plus (推荐 - 平衡)', recommended: true },
      { value: 'qwen-turbo', label: 'Qwen Turbo (快速)', recommended: false },
      { value: 'qwen-max', label: 'Qwen Max (强大)', recommended: false },
      { value: '__custom__', label: '✏️ 自定义模型名称...', recommended: false }
    ],
    ollama: [
      { value: 'deepseek-r1:7b', label: 'DeepSeek R1 7B (推荐)', recommended: true },
      { value: 'deepseek-r1:14b', label: 'DeepSeek R1 14B', recommended: false },
      { value: 'llama3.2', label: 'Llama 3.2', recommended: false },
      { value: 'qwen2.5', label: 'Qwen 2.5', recommended: false },
      { value: '__custom__', label: '✏️ 自定义模型名称...', recommended: false }
    ]
  };

  return recommendations[provider] || [];
};

/**
 * 验证模型名称格式
 * @param {string} provider - 提供商类型
 * @param {string} modelName - 模型名称
 * @returns {Object} - { valid, suggestion }
 */
export const validateModelName = (provider, modelName) => {
  if (!modelName) {
    return { valid: false, suggestion: '请输入模型名称' };
  }

  const models = getRecommendedModels(provider);
  const cleanName = modelName.trim();

  // 检查是否在推荐列表中
  const exactMatch = models.find(m => m.value === cleanName);
  if (exactMatch) {
    return { valid: true };
  }

  // 模糊匹配建议
  const fuzzyMatch = models.find(m =>
    m.value.toLowerCase().includes(cleanName.toLowerCase()) ||
    cleanName.toLowerCase().includes(m.value.toLowerCase())
  );

  if (fuzzyMatch) {
    return {
      valid: false,
      suggestion: `您是否想要使用 "${fuzzyMatch.value}"？`
    };
  }

  // 提供商特定的验证
  if (provider === 'gemini') {
    if (!cleanName.startsWith('gemini-') && !cleanName.startsWith('models/')) {
      return {
        valid: false,
        suggestion: `Gemini 模型名称应以 "gemini-" 开头，例如：${models[0].value}`
      };
    }
  }

  if (provider === 'openai') {
    if (!cleanName.startsWith('gpt-') && !cleanName.startsWith('deepseek-') && !cleanName.startsWith('claude-')) {
      return {
        valid: false,
        suggestion: `常见模型名称格式：${models[0].value}`
      };
    }
  }

  // 通过验证但提供建议
  return {
    valid: true,
    warning: `您输入的模型 "${cleanName}" 不在推荐列表中，请确认模型名称正确。`
  };
};

/**
 * 生成智能配置建议
 * @param {string} apiKey - API Key
 * @returns {Object} - 建议的完整配置
 */
export const generateSmartConfig = (apiKey) => {
  const detected = detectApiKeyType(apiKey);

  if (!detected) {
    return {
      success: false,
      message: 'API Key 格式无法识别，请手动选择提供商'
    };
  }

  return {
    success: true,
    message: `检测到 ${detected.name} API Key`,
    config: {
      provider: detected.provider,
      apiKey: apiKey.trim(),
      baseUrl: detected.baseUrl || '',
      model: detected.models[0] // 使用第一个推荐模型
    },
    recommendations: {
      providerName: detected.name,
      models: detected.models,
      baseUrl: detected.baseUrl
    }
  };
};

/**
 * 格式化 404 错误提示
 * @param {string} provider - 提供商
 * @param {string} attemptedModel - 尝试的模型名称
 * @returns {string} - 友好的错误提示
 */
export const format404Error = (provider, attemptedModel) => {
  const models = getRecommendedModels(provider);
  const recommendedModel = models.find(m => m.recommended) || models[0];

  return `模型 "${attemptedModel}" 不存在 (404)。\n\n推荐尝试：${recommendedModel.value}\n\n其他可用模型：\n${models.slice(0, 3).map(m => `  • ${m.value}`).join('\n')}`;
};
