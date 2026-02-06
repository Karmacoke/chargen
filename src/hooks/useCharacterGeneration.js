/**
 * 角色生成业务逻辑 Hook
 * 封装所有状态管理、API 调用逻辑和副作用
 */

import { useState, useEffect } from 'react';
import { geminiAdapter, openaiAdapter, ollamaAdapter, claudeAdapter, chatglmAdapter, kimiAdapter, qwenAdapter, testConnection } from '../utils/apiAdapters';
import { buildUserPrompt, buildSystemInstruction } from '../utils/helpers';
import { format404Error } from '../utils/apiKeyDetector';
import { translations } from '../i18n/translations';

export const useCharacterGeneration = () => {
  // === 语言状态 ===
  const [lang, setLang] = useState('zh');

  // === 用户输入状态 ===
  const [mode, setMode] = useState('custom');
  const [worldSettingKey, setWorldSettingKey] = useState('fantasy');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [keywords, setKeywords] = useState('');

  // === 运行状态 ===
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // === 配置状态 ===
  const [config, setConfig] = useState({
    provider: 'gemini',
    apiKey: '',
    baseUrl: '',
    model: 'gemini-1.5-flash'
  });

  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'fail' | null

  // === 生命周期：加载保存的配置 ===
  useEffect(() => {
    const savedConfig = localStorage.getItem('chargen_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    const savedLang = localStorage.getItem('chargen_lang');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  // === 语言切换 ===
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('chargen_lang', newLang);
  };

  // === 保存配置 ===
  const saveConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('chargen_config', JSON.stringify(newConfig));
    setError('');
  };

  // === 测试连接 ===
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

  // === 核心生成逻辑 ===
  const handleGenerate = async () => {
    // 1. 验证配置
    const cleanApiKey = config.apiKey ? config.apiKey.trim() : "";
    if (config.provider !== 'ollama' && !cleanApiKey) {
      setError(translations[lang].errorApiKey || '请先配置 API Key');
      return { needsConfig: true };
    }

    // 2. 准备生成参数
    setIsLoading(true);
    setError('');
    setResult(null);

    const currentWorldSetting = translations[lang].worldOptions[worldSettingKey];
    const targetLanguageName = translations[lang].langName;

    const userPrompt = buildUserPrompt({
      mode,
      worldSetting: currentWorldSetting,
      role,
      gender,
      keywords,
      targetLanguage: targetLanguageName,
      worldOptions: translations[lang].worldOptions
    });

    const systemInstruction = buildSystemInstruction(targetLanguageName);

    // 3. 调用对应的 API 适配器
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

      setResult(data);
      return { success: true, data };

    } catch (err) {
      console.error(err);

      // 友好的错误提示
      let msg = err.message;
      if (msg.includes("404")) {
        // 使用智能 404 错误提示，显示推荐模型
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

  // === 返回状态和方法 ===
  return {
    // 状态
    lang,
    mode,
    worldSettingKey,
    role,
    gender,
    keywords,
    isLoading,
    error,
    result,
    config,
    testStatus,

    // 方法
    setMode,
    setWorldSettingKey,
    setRole,
    setGender,
    setKeywords,
    changeLanguage,
    saveConfig,
    setConfig,
    handleTestConnection,
    handleGenerate,
    setError,
    setTestStatus
  };
};
