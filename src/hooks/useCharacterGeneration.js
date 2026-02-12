/**
 * useCharacterGeneration - 角色生成业务逻辑 Hook
 * 职责：管理所有状态、处理所有业务逻辑、提供统一接口
 */

import { useState, useEffect } from 'react';
import {
  geminiAdapter,
  openaiAdapter,
  ollamaAdapter,
  claudeAdapter,
  chatglmAdapter,
  kimiAdapter,
  qwenAdapter,
  testConnection
} from '../utils/apiAdapters';
import {
  buildUserPrompt,
  buildSystemInstruction
} from '../utils/helpers';
import { format404Error } from '../utils/apiKeyDetector';
import { translations } from '../i18n/translations';

export const useCharacterGeneration = () => {
  // 语言状态
  const [lang, setLang] = useState('zh');

  // 主题状态（默认暗色）
  const [theme, setTheme] = useState('dark');

  // 用户输入状态
  const [mode, setMode] = useState('custom');
  const [worldSettingKey, setWorldSettingKey] = useState('fantasy');
  const [customWorldSetting, setCustomWorldSetting] = useState('');
  const [subversionLevel, setSubversionLevel] = useState('ordinary');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [keywords, setKeywords] = useState('');

  // 运行状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // 配置状态
  const [config, setConfig] = useState({
    provider: 'gemini',
    apiKey: '',
    baseUrl: '',
    model: 'gemini-2.5-flash'
  });
  const [testStatus, setTestStatus] = useState(null);
  const [shouldShowSettings, setShouldShowSettings] = useState(false);

  // 派生状态：是否已配置 API Key
  const isApiKeyConfigured =
    config.provider === 'ollama' ||
    (config.apiKey && config.apiKey.trim() !== '');

  // 初始化：从 localStorage 加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('chargen_config');
    let loadedConfig = null;

    if (savedConfig) {
      try {
        loadedConfig = JSON.parse(savedConfig);
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to parse saved config:', error);
        localStorage.removeItem('chargen_config'); // 清除损坏的数据
      }
    }

    const savedLang = localStorage.getItem('chargen_lang');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }

    // 加载主题设置
    const savedTheme = localStorage.getItem('chargen_theme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setTheme(savedTheme);
      // 应用到 HTML 根元素
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // 默认暗色模式
      document.documentElement.classList.add('dark');
    }

    // 检测是否需要自动弹出设置面板
    const finalConfig = loadedConfig || { provider: 'gemini', apiKey: '' };
    const hasKey = finalConfig.provider === 'ollama' ||
      (finalConfig.apiKey && finalConfig.apiKey.trim() !== '');

    if (!hasKey) {
      setShouldShowSettings(true);
    }
  }, []);

  // 切换界面语言
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('chargen_lang', newLang);
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('chargen_theme', newTheme);

    // 更新 HTML 根元素 class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 保存 API 配置
  const saveConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('chargen_config', JSON.stringify(newConfig));
    setError('');
  };

  // 测试 API 连接
  const handleTestConnection = async () => {
    if (config.provider !== 'ollama' && !config.apiKey) {
      setTestStatus('fail');
      return;
    }

    setTestStatus('testing');

    try {
      const success = await testConnection(config);
      setTestStatus(success ? 'success' : 'fail');

      if (success) {
        setTimeout(() => setTestStatus(null), 2000);
      }
    } catch (e) {
      console.error(e);
      setTestStatus('fail');
    }
  };

  // 核心业务逻辑：生成角色
  const handleGenerate = async () => {
    // 防止重复调用
    if (isLoading) {
      console.warn('Generation already in progress');
      return { success: false, error: 'Already generating' };
    }

    // 验证配置
    const cleanApiKey = config.apiKey ? config.apiKey.trim() : "";

    if (config.provider !== 'ollama' && !cleanApiKey) {
      setError(translations[lang].errorApiKey || '请先配置 API Key');
      return { needsConfig: true };
    }

    // 准备生成参数
    setIsLoading(true);
    setError('');
    setResult(null);

    const currentWorldSetting = worldSettingKey === '__custom__'
      ? customWorldSetting
      : translations[lang].worldOptions[worldSettingKey];

    const targetLanguageName = translations[lang].langName;

    const userPrompt = buildUserPrompt({
      mode,
      worldSetting: currentWorldSetting,
      role,
      gender,
      keywords,
      targetLanguage: targetLanguageName,
      worldOptions: translations[lang].worldOptions,
      subversionLevel
    });

    const systemInstruction = buildSystemInstruction(targetLanguageName);

    // 调用 API 适配器
    try {
      let data;

      if (config.provider === 'gemini') {
        data = await geminiAdapter(config, systemInstruction, userPrompt);
      } else if (config.provider === 'openai') {
        data = await openaiAdapter(config, systemInstruction, userPrompt);
      } else if (config.provider === 'ollama') {
        data = await ollamaAdapter(config, systemInstruction, userPrompt);
      } else if (config.provider === 'claude') {
        data = await claudeAdapter(config, systemInstruction, userPrompt);
      } else if (config.provider === 'chatglm') {
        data = await chatglmAdapter(config, systemInstruction, userPrompt);
      } else if (config.provider === 'kimi') {
        data = await kimiAdapter(config, systemInstruction, userPrompt);
      } else if (config.provider === 'qwen') {
        data = await qwenAdapter(config, systemInstruction, userPrompt);
      }

      // 提取 AI 生成的 portrait 提示词
      const portraitPrompt = typeof data.image_prompt === 'string'
        ? data.image_prompt
        : data.image_prompt?.portrait || '';

      // JSON 中只保存 portrait，固定模板在前端动态加载
      data.image_prompt = {
        portrait: portraitPrompt
      };

      setResult(data);
      return { success: true, data };

    } catch (err) {
      console.error(err);

      let msg = err.message;

      if (msg.includes("404")) {
        msg = format404Error(config.provider, config.model);
      } else if (msg.includes("400")) {
        msg = "请求格式错误 (400)。请检查 API Key 是否有多余空格，或者尝试更换模型名称。";
      } else if (msg.includes("Failed to fetch")) {
        msg = lang === 'zh' ? "无法连接服务器。请检查网络/魔法设置。" : "Network Error.";
      } else if (msg.includes("JSON")) {
        msg = lang === 'zh' ? "AI 生成的内容格式有误，请重试。" : "Invalid JSON format.";
      }

      setError(msg);
      return { success: false, error: msg };

    } finally {
      setIsLoading(false);
    }
  };

  // 返回所有状态和方法
  return {
    lang,
    theme,
    mode,
    worldSettingKey,
    customWorldSetting,
    subversionLevel,
    role,
    gender,
    keywords,
    isLoading,
    error,
    result,
    config,
    testStatus,
    isApiKeyConfigured,
    shouldShowSettings,
    setMode,
    setWorldSettingKey,
    setCustomWorldSetting,
    setSubversionLevel,
    setRole,
    setGender,
    setKeywords,
    changeLanguage,
    toggleTheme,
    saveConfig,
    setConfig,
    handleTestConnection,
    handleGenerate,
    setError,
    setTestStatus
  };
};
