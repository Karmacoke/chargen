/**
 * apiAdapters - API 适配器模块
 * 职责：统一多种 AI 提供商的调用接口
 */

import { safeParseJson } from './helpers';
import { fetchWithTimeout } from './fetchWithTimeout';

// ============================================
// Gemini 适配器
// ============================================

export const geminiAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();
  const finalPrompt = `${systemInstruction}\n\n---\n\nUser Request: ${userPrompt}`;

  // 选择 API 版本（2.0/2.5/exp 使用 v1beta，其他使用 v1）
  const apiVersion = cleanModel.includes('2.0') || cleanModel.includes('2.5') || cleanModel.includes('exp')
    ? 'v1beta'
    : 'v1';

  const modelName = cleanModel.includes('/') ? cleanModel : `models/${cleanModel}`;

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/${apiVersion}/${modelName}:generateContent?key=${cleanApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: finalPrompt }] }] })
    },
    30000 // 30秒超时
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini Error Details:", errorText);
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const resJson = await response.json();
  const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  return safeParseJson(text);
};

// ============================================
// OpenAI/DeepSeek 适配器
// ============================================

export const openaiAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();
  let baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  baseUrl = baseUrl.replace(/\/$/, '');

  const response = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
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
  }, 30000);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI");

  return safeParseJson(text);
};

// ============================================
// Ollama 适配器
// ============================================

export const ollamaAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanModel = config.model.trim();
  let baseUrl = config.baseUrl || 'http://localhost:11434/v1';
  baseUrl = baseUrl.replace(/\/$/, '');

  const response = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
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
  }, 30000);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Ollama");

  return safeParseJson(text);
};

// ============================================
// Claude 适配器
// ============================================

export const claudeAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
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
  }, 30000);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Claude");

  return safeParseJson(text);
};

// ============================================
// ChatGLM 适配器
// ============================================

export const chatglmAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetchWithTimeout('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
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
  }, 30000);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ChatGLM API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from ChatGLM");

  return safeParseJson(text);
};

// ============================================
// Kimi 适配器
// ============================================

export const kimiAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetchWithTimeout('https://api.moonshot.cn/v1/chat/completions', {
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
  }, 30000);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Kimi API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Kimi");

  return safeParseJson(text);
};

// ============================================
// Qwen 适配器
// ============================================

export const qwenAdapter = async (config, systemInstruction, userPrompt) => {
  const cleanApiKey = config.apiKey.trim();
  const cleanModel = config.model.trim();

  const response = await fetchWithTimeout('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
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
  }, 30000);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Qwen API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Qwen");

  return safeParseJson(text);
};

// ============================================
// 连接测试函数
// ============================================

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
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: 'hi' }],
          stream: false
        })
      });
      return response.ok;

    } else {
      const url = `${config.baseUrl || 'https://api.openai.com/v1'}/chat/completions`;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: 'hi' }]
        })
      });
      return response.ok;
    }

  } catch (e) {
    console.error('Connection test failed:', e);
    return false;
  }
};
