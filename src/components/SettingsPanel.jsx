/**
 * 设置面板组件（简化版）
 * 职责：API 配置管理（提供商 + API Key + 模型名称）
 */

import { Server, Wifi, Save } from './Icons';

const SettingsPanel = ({
  showSettings,
  setShowSettings,
  config,
  setConfig,
  testStatus,
  handleTestConnection,
  saveConfig,
  translations,
  lang
}) => {
  const t = (key) => translations[lang]?.[key] || key;

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* 标题栏 */}
        <div className="p-6 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-200">
            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-colors duration-200" />
            {t('settingsTitle')}
          </h2>
          <button onClick={() => setShowSettings(false)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-2xl leading-none">✕</button>
        </div>

        {/* 配置表单 */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* 1. 提供商选择 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase mb-2 transition-colors duration-200">
              {t('labelProvider')}
            </label>
            <select
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value })}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="gemini">🌟 Google Gemini</option>
              <option value="claude">🤖 Anthropic Claude</option>
              <option value="chatglm">🧠 智谱 ChatGLM</option>
              <option value="kimi">🌙 Moonshot Kimi</option>
              <option value="qwen">☁️ 通义千问 Qwen</option>
              <option value="openai">💬 OpenAI / DeepSeek</option>
              <option value="ollama">🏠 {t('localOllama') || '本地 Ollama'}</option>
            </select>
          </div>

          {/* 2. API Key（Ollama 不需要） */}
          {config.provider !== 'ollama' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase mb-2 transition-colors duration-200">
                {t('labelApiKey')}
              </label>
              <input
                type="password"
                placeholder={t('placeholderApiKey') || '粘贴 API Key'}
                value={config.apiKey}
                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {/* 3. Base URL（仅 OpenAI/Ollama 需要） */}
          {(config.provider === 'openai' || config.provider === 'ollama') && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase mb-2 transition-colors duration-200">
                {t('labelBaseUrl')}
              </label>
              <input
                type="text"
                placeholder={config.provider === 'ollama' ? "http://localhost:11434" : "https://api.openai.com/v1"}
                value={config.baseUrl}
                onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {/* 4. 模型名称（纯文本输入） */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase mb-2 transition-colors duration-200">
              {t('labelModel')}
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({...config, model: e.target.value})}
              placeholder={t('placeholderModel') || '输入完整模型名称，如 gemini-2.0-flash'}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-gray-900 dark:text-gray-100 transition-colors duration-200 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-500 transition-colors duration-200">
              💡 {t('modelHint') || '提示：请从官方文档复制准确的模型名称'}
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex justify-between gap-4 transition-colors duration-200">
          <button
            onClick={handleTestConnection}
            disabled={testStatus === 'testing' || (config.provider !== 'ollama' && !config.apiKey)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              testStatus === 'success' ? 'bg-green-600 text-white' :
              testStatus === 'fail' ? 'bg-red-600 text-white' :
              (config.provider !== 'ollama' && !config.apiKey) ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' :
              'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
            }`}
          >
            {testStatus === 'testing' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wifi className="w-4 h-4" />}
            {testStatus === 'success' ? t('statusConnected') : testStatus === 'fail' ? t('statusFailed') : t('btnTest')}
          </button>

          <button
            onClick={() => saveConfig(config)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {t('btnSave')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
