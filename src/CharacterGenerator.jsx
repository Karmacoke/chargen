/**
 * CharacterGenerator - 主组件（重构后）
 * 职责：组合子组件、处理整体布局、顶部导航栏
 * 从 1160 行简化到 ~200 行
 */

import React from 'react';
import { Sparkles, Settings, Globe, AlertTriangle } from './components/Icons';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import SettingsPanel from './components/SettingsPanel';
import { useCharacterGeneration } from './hooks/useCharacterGeneration';
import { translations } from './i18n/translations';

const CharacterGenerator = () => {
  // === 使用自定义 Hook 获取所有状态和方法 ===
  const {
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
    setMode,
    setWorldSettingKey,
    setRole,
    setGender,
    setKeywords,
    changeLanguage,
    saveConfig,
    setConfig,
    handleTestConnection,
    handleGenerate
  } = useCharacterGeneration();

  // === 翻译辅助函数 ===
  const t = (key) => translations[lang]?.[key] || key;

  // === 设置面板状态 ===
  const [showSettings, setShowSettings] = React.useState(false);

  // === 语言选择器状态 ===
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const langMenuTimerRef = React.useRef(null);

  // === 生成按钮点击处理 ===
  const onGenerateClick = async () => {
    const result = await handleGenerate();
    if (result?.needsConfig) {
      setShowSettings(true);
    }
  };

  // === 保存配置并关闭设置面板 ===
  const handleSaveConfig = (newConfig) => {
    saveConfig(newConfig);
    setShowSettings(false);
  };

  // === 语言菜单交互处理 ===
  const handleLangMenuEnter = () => {
    if (langMenuTimerRef.current) {
      clearTimeout(langMenuTimerRef.current);
    }
    setShowLangMenu(true);
  };

  const handleLangMenuLeave = () => {
    // 延迟 300ms 关闭，给用户时间移动鼠标
    langMenuTimerRef.current = setTimeout(() => {
      setShowLangMenu(false);
    }, 300);
  };

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
          <div
            className="relative z-20"
            onMouseEnter={handleLangMenuEnter}
            onMouseLeave={handleLangMenuLeave}
          >
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition-colors shadow-lg flex items-center gap-2 px-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300 font-medium hidden sm:inline">{translations[lang].langName}</span>
            </button>
            {/* 下拉菜单 */}
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                {Object.keys(translations).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      changeLanguage(l);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${lang === l ? 'text-indigo-400 font-bold' : 'text-gray-300'}`}
                  >
                    {translations[l].langName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 设置按钮 */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition-colors shadow-lg group"
            title={t('settingsTitle')}
          >
            <Settings className={`w-6 h-6 text-gray-400 group-hover:text-white transition-transform ${showSettings ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-0">

        {/* 设置面板 Modal */}
        <SettingsPanel
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          config={config}
          setConfig={setConfig}
          testStatus={testStatus}
          handleTestConnection={handleTestConnection}
          saveConfig={handleSaveConfig}
          translations={translations}
          lang={lang}
        />

        {/* 左侧栏：输入区 */}
        <div className="lg:col-span-4 space-y-6">
          {/* 标题（仅在大屏显示） */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-400" />
              {t('appTitle')}
            </h1>
            <p className="text-gray-400 mt-2 ml-11">{t('heroSubtitle')}</p>
          </div>

          {/* 输入表单组件 */}
          <InputForm
            mode={mode}
            setMode={setMode}
            worldSettingKey={worldSettingKey}
            setWorldSettingKey={setWorldSettingKey}
            role={role}
            setRole={setRole}
            gender={gender}
            setGender={setGender}
            keywords={keywords}
            setKeywords={setKeywords}
            translations={translations}
            lang={lang}
          />

          {/* 生成按钮 */}
          <button
            onClick={onGenerateClick}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
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
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 flex gap-3 text-sm text-red-200 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <p>{error}</p>
            </div>
          )}

          {/* 当前配置状态提示 */}
          <div className="text-center">
            <span className="text-xs text-gray-600">
              {t('currentModel')} {config.provider} ({config.model})
            </span>
          </div>
        </div>

        {/* 右侧栏：结果展示 */}
        <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-auto bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden relative min-h-[500px]">
          <ResultDisplay
            result={result}
            isLoading={isLoading}
            config={config}
            translations={translations}
            lang={lang}
          />
        </div>
      </div>

      {/* 全局样式 */}
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
