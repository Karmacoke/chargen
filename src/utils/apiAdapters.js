/**
 * API 适配器模块
 * 封装三种 AI 提供商的 API 调用逻辑
 */

import { cleanJsonResponse } from './helpers';

/**
 * Google Gemini API 适配器
 * @param {Object} config - { apiKey, model }
 * @param {string} systemInstruction - 系统指令
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} - 解析后的角色数据
 */
export const geminiAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  // 合并系统指令到 Prompt（避免 API 版本兼容问题）
  const finalPrompt = `${systemInstruction}\n\n---\n\nUser Request: ${userPrompt}`;

  // 根据模型版本选择 API 版本
  const apiVersion = cleanModel.includes('2.0') || cleanModel.includes('2.5') || cleanModel.includes('exp')
    ? 'v1beta'
    : 'v1';
  const modelName = cleanModel.includes('/') ? cleanModel : `models/${cleanModel}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/${apiVersion}/${modelName}:generateContent?key=${cleanApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini Error Details:", errorText);
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const resJson = await response.json();
  const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  const cleanJson = cleanJsonResponse(text);
  return JSON.parse(cleanJson);
};

/**
 * OpenAI/DeepSeek API 适配器
 * @param {Object} config - { apiKey, baseUrl, model }
 * @param {string} systemInstruction - 系统指令
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} - 解析后的角色数据
 */
export const openaiAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();
  let baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  baseUrl = baseUrl.replace(/\/$/, ''); // 移除末尾斜杠

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanApiKey}`
    },
    body: JSON.stringify({
      model: cleanModel,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI");

  const cleanJson = cleanJsonResponse(text);
  return JSON.parse(cleanJson);
};

/**
 * Ollama API 适配器
 * @param {Object} config - { baseUrl, model }
 * @param {string} systemInstruction - 系统指令
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} - 解析后的角色数据
 */
export const ollamaAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanModel = config.model.trim();
  let baseUrl = config.baseUrl || 'http://localhost:11434/v1';
  baseUrl = baseUrl.replace(/\/$/, '');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cleanModel,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Ollama");

  const cleanJson = cleanJsonResponse(text);
  return JSON.parse(cleanJson);
};

/**
 * Claude API 适配器（Anthropic Messages API）
 * @param {Object} config - { apiKey, model }
 * @param {string} systemInstruction - 系统指令
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} - 解析后的角色数据
 */
export const claudeAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cleanApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: cleanModel,
      max_tokens: 4096,
      system: systemInstruction,
      messages: [
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Claude");

  const cleanJson = cleanJsonResponse(text);
  return JSON.parse(cleanJson);
};

/**
 * ChatGLM API 适配器（智谱 AI）
 * @param {Object} config - { apiKey, model }
 * @param {string} systemInstruction - 系统指令
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} - 解析后的角色数据
 */
export const chatglmAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanApiKey}`
    },
    body: JSON.stringify({
      model: cleanModel,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ChatGLM API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from ChatGLM");

  const cleanJson = cleanJsonResponse(text);
  return JSON.parse(cleanJson);
};

/**
 * Kimi API 适配器（Moonshot AI）
 * @param {Object} config - { apiKey, model }
 * @param {string} systemInstruction - 系统指令
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} - 解析后的角色数据
 */
export const kimiAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanApiKey}`
    },
    body: JSON.stringify({
      model: cleanModel,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Kimi API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Kimi");

  const cleanJson = cleanJsonResponse(text);
  return JSON.parse(cleanJson);
};

/**
 * Qwen API 适配器（通义千问）
 * @param {Object} config - { apiKey, model }
 * @param {string} systemInstruction - 系统指令
 * @param {string} userPrompt - 用户 Prompt
 * @returns {Promise<Object>} - 解析后的角色数据
 */
export const qwenAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanApiKey}`
    },
    body: JSON.stringify({
      model: cleanModel,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Qwen API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Qwen");

  const cleanJson = cleanJsonResponse(text);
  return JSON.parse(cleanJson);
};

/**
 * 测试 API 连接
 * @param {Object} config - { provider, apiKey, baseUrl, model }
 * @returns {Promise<boolean>} - 是否连接成功
 */
export const testConnection = async (config) => {
  if (config.provider !== 'ollama' && !config.apiKey) {
    throw new Error("Missing API Key");
  }

  try {
    if (config.provider === 'gemini') {
      const cleanApiKey = config.apiKey.trim();
      const cleanModel = config.model.trim();
      const apiVersion = cleanModel.includes('2.0') || cleanModel.includes('2.5') || cleanModel.includes('exp') ? 'v1beta' : 'v1';
      const modelName = cleanModel.includes('/') ? cleanModel : `models/${cleanModel}`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${apiVersion}/${modelName}:generateContent?key=${cleanApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
        }
      );
      return response.ok;
    } else if (config.provider === 'claude') {
      const cleanApiKey = config.apiKey.trim();
      const cleanModel = config.model.trim();
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': cleanApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: cleanModel,
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }]
        })
      });
      return response.ok;
    } else if (config.provider === 'chatglm') {
      const cleanApiKey = config.apiKey.trim();
      const cleanModel = config.model.trim();
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanApiKey}`
        },
        body: JSON.stringify({
          model: cleanModel,
          messages: [{ role: "user", content: "Hi" }]
        })
      });
      return response.ok;
    } else if (config.provider === 'kimi') {
      const cleanApiKey = config.apiKey.trim();
      const cleanModel = config.model.trim();
      const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanApiKey}`
        },
        body: JSON.stringify({
          model: cleanModel,
          messages: [{ role: "user", content: "Hi" }]
        })
      });
      return response.ok;
    } else if (config.provider === 'qwen') {
      const cleanApiKey = config.apiKey.trim();
      const cleanModel = config.model.trim();
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanApiKey}`
        },
        body: JSON.stringify({
          model: cleanModel,
          messages: [{ role: "user", content: "Hi" }]
        })
      });
      return response.ok;
    } else if (config.provider === 'ollama') {
      const url = `${config.baseUrl || 'http://localhost:11434'}/api/chat`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: config.model, messages: [{ role: 'user', content: 'hi' }], stream: false })
      });
      return response.ok;
    } else {
      // OpenAI 及兼容接口
      const url = `${config.baseUrl || 'https://api.openai.com/v1'}/chat/completions`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      };
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ model: config.model, messages: [{ role: 'user', content: 'hi' }] })
      });
      return response.ok;
    }
  } catch (e) {
    console.error('Connection test failed:', e);
    return false;
  }
};
