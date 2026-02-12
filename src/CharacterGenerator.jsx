/**
 * CharacterGenerator - 主组件
 * 职责：组合所有子组件、处理顶部导航栏、协调整体布局
 */

import React from 'react';
import { Sparkles, Settings, Globe, AlertTriangle, Sun, Moon } from './components/Icons';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import SettingsPanel from './components/SettingsPanel';
import { useCharacterGeneration } from './hooks/useCharacterGeneration';
import { translations } from './i18n/translations';

const CharacterGenerator = () => {
  // 从自定义 Hook 获取所有状态和方法
  const {
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
    handleGenerate
  } = useCharacterGeneration();

  const t = (key) => translations[lang]?.[key] || key;

  // 设置面板显示状态
  const [showSettings, setShowSettings] = React.useState(false);

  // 首次加载时自动弹窗
  React.useEffect(() => {
    if (shouldShowSettings) {
      setShowSettings(true);
    }
  }, [shouldShowSettings]);

  // 语言菜单状态
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const langMenuTimerRef = React.useRef(null);

  // 检测触摸设备
  const isTouchDevice = React.useMemo(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // 生成按钮点击处理
  const onGenerateClick = async () => {
    const result = await handleGenerate();
    if (result?.needsConfig) {
      setShowSettings(true);
    }
  };

  // 保存配置并关闭设置面板
  const handleSaveConfig = (newConfig) => {
    saveConfig(newConfig);
    setShowSettings(false);
  };

  // 语言菜单交互处理
  const MENU_CLOSE_DELAY = 300;

  const handleLangMenuEnter = () => {
    if (isTouchDevice) return;
    if (langMenuTimerRef.current) {
      clearTimeout(langMenuTimerRef.current);
    }
    setShowLangMenu(true);
  };

  const handleLangMenuLeave = () => {
    if (isTouchDevice) return;
    langMenuTimerRef.current = setTimeout(() => {
      setShowLangMenu(false);
    }, MENU_CLOSE_DELAY);
  };

  // 清理定时器（防止内存泄漏）
  React.useEffect(() => {
    return () => {
      if (langMenuTimerRef.current) {
        clearTimeout(langMenuTimerRef.current);
      }
    };
  }, []);

  const handleLangMenuToggle = () => {
    if (isTouchDevice) {
      setShowLangMenu(!showLangMenu);
    }
  };

  // 点击外部关闭语言菜单
  React.useEffect(() => {
    if (!showLangMenu || !isTouchDevice) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('.lang-menu-container')) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showLangMenu, isTouchDevice]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8 relative overflow-hidden transition-colors duration-200">
      {/* 顶部导航栏 */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            {t('appTitle')}
          </h1>
          <span className="text-xs text-gray-500 font-mono border border-gray-700 rounded px-1">
            {t('appSubtitle')}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-700 transition-colors shadow-lg"
            title={theme === 'dark' ? '切换到白天模式' : '切换到夜间模式'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* 语言选择器 */}
          <div
            className="relative z-20 lang-menu-container"
            onMouseEnter={handleLangMenuEnter}
            onMouseLeave={handleLangMenuLeave}
          >
            <button
              onClick={handleLangMenuToggle}
              className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-700 transition-colors shadow-lg flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
            >
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">
                {translations[lang].langName}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                {Object.keys(translations).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      changeLanguage(l);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      lang === l ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300'
                    }`}
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
            className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-700 transition-colors shadow-lg group"
            title={t('settingsTitle')}
          >
            <Settings className={`w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-transform ${
              showSettings ? 'rotate-90' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-0">
        {/* 设置面板 */}
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

        {/* 左侧：输入区 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              {t('appTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-11">
              {t('heroSubtitle')}
            </p>
          </div>

          <InputForm
            mode={mode}
            setMode={setMode}
            worldSettingKey={worldSettingKey}
            setWorldSettingKey={setWorldSettingKey}
            customWorldSetting={customWorldSetting}
            setCustomWorldSetting={setCustomWorldSetting}
            subversionLevel={subversionLevel}
            setSubversionLevel={setSubversionLevel}
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
          {isApiKeyConfigured ? (
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
          ) : (
            <button
              onClick={() => setShowSettings(true)}
              className="w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 hover:shadow-amber-500/25"
            >
              <Settings className="w-5 h-5" />
              {t('btnConfigureApiKey')}
            </button>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-900/50 rounded-lg p-3 flex gap-3 text-sm text-red-700 dark:text-red-200 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p>{error}</p>
            </div>
          )}

          {/* 当前配置状态 */}
          <div className="text-center">
            <span className="text-xs text-gray-500 dark:text-gray-600">
              {t('currentModel')} {config.provider} ({config.model})
            </span>
          </div>
        </div>

        {/* 右侧：结果展示 */}
        <div className="lg:col-span-8 flex flex-col min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden relative">
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(229, 231, 235, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.8);
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 1);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 1);
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .min-h-screen { padding-bottom: env(safe-area-inset-bottom); }
        }
      `}</style>
    </div>
  );
};

export default CharacterGenerator;
