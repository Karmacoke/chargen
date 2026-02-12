/**
 * InputForm - 输入表单组件
 * 职责：收集用户输入、模式切换、表单验证
 */

import { Fingerprint, Dices } from './Icons';

const InputForm = ({
  mode,
  setMode,
  worldSettingKey,
  setWorldSettingKey,
  customWorldSetting,
  setCustomWorldSetting,
  subversionLevel,
  setSubversionLevel,
  role,
  setRole,
  gender,
  setGender,
  keywords,
  setKeywords,
  translations,
  lang
}) => {
  const t = (key) => translations[lang]?.[key] || key;

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-2xl p-6 shadow-xl transition-colors duration-200">
      {/* 模式切换 */}
      <div className="flex bg-gray-100 dark:bg-gray-900/80 p-1 rounded-lg mb-6">
        <button
          onClick={() => setMode('custom')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'custom' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          {t('modeCustom')}
        </button>
        <button
          onClick={() => setMode('random')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'random' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Dices className="w-4 h-4" />
          {t('modeRandom')}
        </button>
      </div>

      {/* 表单内容 */}
      {mode === 'custom' ? (
        <div className="space-y-4">
          {/* 世界观选择 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t('labelWorld')}
            </label>
            <select
              value={worldSettingKey}
              onChange={(e) => setWorldSettingKey(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-200"
            >
              {Object.entries(translations[lang].worldOptions).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
              <option value="__custom__">✏️ {t('worldOptionCustom')}</option>
            </select>

            {worldSettingKey === '__custom__' && (
              <input
                type="text"
                placeholder={t('placeholderCustomWorld')}
                value={customWorldSetting || ''}
                onChange={(e) => setCustomWorldSetting(e.target.value)}
                className="w-full mt-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-200"
              />
            )}
          </div>

          {/* 角色/性别 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                {t('labelRole')}
              </label>
              <input
                type="text"
                placeholder={t('placeholderRole')}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                {t('labelGender')}
              </label>
              <input
                type="text"
                placeholder={t('placeholderGender')}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* 关键词 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t('labelKeywords')}
            </label>
            <textarea
              rows="3"
              placeholder={t('placeholderKeywords')}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors duration-200"
            />
          </div>

          {/* 反套路程度 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              {t('labelSubversion')}
            </label>
            <select
              value={subversionLevel}
              onChange={(e) => setSubversionLevel(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors duration-200"
            >
              {Object.entries(translations[lang].subversionOptions).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-600 dark:text-gray-400 border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900/30 transition-colors duration-200">
          <Dices className="w-12 h-12 mx-auto mb-3 text-pink-500 opacity-50" />
          <p className="text-sm whitespace-pre-wrap">{t('randomText')}</p>
        </div>
      )}
    </div>
  );
};

export default InputForm;
