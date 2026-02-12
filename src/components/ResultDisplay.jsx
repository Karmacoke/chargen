/**
 * ResultDisplay - 结果展示组件
 * 职责：显示生成的角色数据、提供复制和导出功能
 */

import { useState, useMemo } from 'react';
import { User, BookOpen, MessageSquare, Palette, Terminal, History, Brain, Check, Copy, Download, Layout, Smile, Zap, Layers, Maximize } from './Icons';
import { copyToClipboard, VISUAL_TEMPLATES } from '../utils/helpers';

const ResultDisplay = ({ result, isLoading, config, translations, lang }) => {
  const [activeTab, setActiveTab] = useState('card');
  const [visualTab, setVisualTab] = useState('portrait');
  const [copyFeedback, setCopyFeedback] = useState('');

  const t = (key) => translations[lang]?.[key] || key;

  // 动态合并固定模板与 AI 生成的 portrait
  const fullImagePrompt = useMemo(() => {
    if (!result?.image_prompt) return null;
    return {
      portrait: result.image_prompt.portrait || '',
      ...VISUAL_TEMPLATES
    };
  }, [result]);

  const handleCopy = (text, type) => {
    const success = copyToClipboard(text);
    if (success) {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const VISUAL_TYPES = [
    { id: 'portrait', icon: User, label: 'portrait' },
    { id: 'three_views', icon: Layout, label: 'three_views' },
    { id: 'concept_breakdown', icon: Layers, label: 'concept_breakdown' },
    { id: 'expression_sheet', icon: Smile, label: 'expression_sheet' },
    { id: 'scale_chart', icon: Maximize, label: 'scale_chart' },
    { id: 'action_poses', icon: Zap, label: 'action_poses' },
  ];

  const formatStep = (idx) => idx.toString().padStart(2, '0');

  // Markdown 生成
  const generateMarkdown = () => {
    if (!result) return '';

    const md = `# ${result.identity.name}${result.identity.aliases ? ` "${result.identity.aliases}"` : ''}

## ${t('mdBasicInfo')}

| ${t('mdAttrHeader')} | ${t('mdValueHeader')} |
|------|-----|
| **${t('mdRace')}** | ${result.identity.race} |
| **${t('mdGender')}** | ${result.identity.gender} |
| **${t('mdAge')}** | ${result.identity.age} |
| **${t('mdOccupation')}** | ${result.identity.occupation} |
| **${t('mdAlignment')}** | ${result.identity.alignment} |

---

## ${t('secPsychology')}

${result.psychology.high_concept ? `> **${t('labelHighConcept')}**: "${result.psychology.high_concept}"` : ''}

- **MBTI**: ${result.psychology.mbti}
- **${t('mdCoreDesire')}**: ${result.psychology.desire}
- **${t('mdCoreFear')}**: ${result.psychology.fear}
${result.psychology.flaw ? `- **${t('mdFlaw')}**: ${result.psychology.flaw}` : ''}
${result.psychology.quirks ? `- **${t('labelQuirks')}**: ${result.psychology.quirks}` : ''}
${result.psychology.personality_keywords?.length ? `- **${t('mdPersonalityKeywords')}**: ${result.psychology.personality_keywords.join(', ')}` : ''}

---

## ${t('secAppearance')}

${result.appearance.summary}

${result.appearance.features?.map(f => `- ${f}`).join('\n') || ''}

---

## ${t('secBackground')}

**${t('mdOrigin')}**: ${result.background.origin || t('mdUnknown')}

> ${result.background.story_summary}

### 🔒 ${t('labelSecret')}

> ${t('mdSecretWarning')} ${result.background.secret}

---

## ${t('mdCharacterSection')}

\`\`\`
${result.system_prompt || t('mdGenerateFailed')}
\`\`\`

---

## ${t('mdImageSection')}

### ${t('visualTypes')['portrait'] || 'Portrait'}

\`\`\`
${result.image_prompt?.portrait || ''}
\`\`\`

---

## ${t('mdJsonSection')}

\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`

---

*${t('mdGeneratedBy')} - ${new Date().toLocaleDateString()}*
`;

    return md;
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;

    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (result?.identity?.name || 'character').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const fileName = `${safeName}_character.md`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopyFeedback('download');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  // 等待输入状态
  if (!result && !isLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 dark:text-gray-500 p-8 transition-colors duration-200 text-center">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 ring-1 ring-gray-400 dark:ring-gray-700 transition-colors duration-200">
          <User className="w-10 h-10 opacity-50" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-300 transition-colors duration-200">{t('waitingTitle')}</h3>
        <p className="max-w-xs mt-2 text-sm">{t('waitingDesc')}</p>
      </div>
    );
  }

  // 加载中状态
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200/90 dark:bg-gray-800/90 z-10 transition-colors duration-200 backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-300 font-mono animate-pulse">{t('loadingText')}</p>
        <p className="text-xs text-gray-600 dark:text-gray-500 mt-2 transition-colors duration-200">{t('loadingProvider')} {config.provider}</p>
      </div>
    );
  }

  // 结果展示
  return (
    <>
      {/* Tab 导航栏 */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 transition-colors duration-200">
        <div className="flex-1 flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${
              activeTab === 'card'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{t('tabCard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('sysprompt')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${
              activeTab === 'sysprompt'
                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-gray-800'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{t('tabSysPrompt')}</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${
              activeTab === 'prompt'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-gray-800'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{t('visualStudioTitle')}</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${
              activeTab === 'json'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-gray-800'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{t('tabJson')}</span>
          </button>
        </div>

        {/* 下载 Markdown 按钮 */}
        <button
          onClick={handleDownloadMarkdown}
          className={`flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors flex-shrink-0 border-l border-gray-300 dark:border-gray-700 transition-colors duration-200 ${
            copyFeedback === 'download'
              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
          title={t('btnDownloadMd')}
        >
          {copyFeedback === 'download' ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span className="hidden sm:inline">{copyFeedback === 'download' ? t('btnDownloaded') : t('btnDownloadMd')}</span>
        </button>
      </div>

      {/* Tab 内容区 */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
        {/* Tab 1: 角色卡 */}
        {activeTab === 'card' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="flex flex-col gap-4 sm:gap-6 items-start border-b border-gray-300 dark:border-gray-700 pb-4 sm:pb-6 transition-colors duration-200">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{result.identity.name}</h2>
                  {result.identity.aliases && <span className="text-indigo-600 dark:text-indigo-400 italic font-medium text-sm sm:text-base transition-colors duration-200">"{result.identity.aliases}"</span>}
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-800 dark:text-gray-300 transition-colors duration-200">
                  <span className="bg-gray-300 dark:bg-gray-700 px-2 py-1 transition-colors duration-200 rounded">{result.identity.race}</span>
                  <span className="bg-gray-300 dark:bg-gray-700 px-2 py-1 transition-colors duration-200 rounded">{result.identity.gender}</span>
                  <span className="bg-gray-300 dark:bg-gray-700 px-2 py-1 transition-colors duration-200 rounded">{result.identity.age}</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded border border-indigo-300 dark:border-indigo-700/50 transition-colors duration-200">{result.identity.occupation}</span>
                  <span className="bg-gray-300 dark:bg-gray-700 px-2 py-1 transition-colors duration-200 rounded">{result.identity.alignment}</span>
                </div>
              </div>

              {/* 心理侧写 */}
              <div className="w-full bg-gray-100 dark:bg-gray-900/50 p-3 transition-colors duration-200 sm:p-4 rounded-lg border border-gray-300 dark:border-gray-700 transition-colors duration-200">
                <h4 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase transition-colors duration-200 mb-2 sm:mb-3 flex items-center gap-2">
                  <Brain className="w-3 h-3" /> {t('secPsychology')}
                </h4>

                {result.psychology.high_concept && (
                  <div className="mb-3 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700/50 transition-colors duration-200">
                    <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium transition-colors duration-200">{t('labelHighConcept')}</span>
                    <p className="text-sm text-indigo-900 dark:text-indigo-100 mt-1 italic transition-colors duration-200">"{result.psychology.high_concept}"</p>
                  </div>
                )}

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-400 transition-colors duration-200">{t('labelMbti')}</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-mono transition-colors duration-200">{result.psychology.mbti}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-700 dark:text-gray-400 transition-colors duration-200">{t('labelDesire')}</span>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed transition-colors duration-200">{result.psychology.desire}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-700 dark:text-gray-400 transition-colors duration-200">{t('labelFear')}</span>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed transition-colors duration-200">{result.psychology.fear}</p>
                  </div>
                  {result.psychology.quirks && (
                    <div className="flex flex-col gap-1 pt-1 border-t border-gray-400 dark:border-gray-700/50 transition-colors duration-200">
                      <span className="text-gray-700 dark:text-gray-400 transition-colors duration-200">{t('labelQuirks')}</span>
                      <p className="text-orange-600 dark:text-orange-300 leading-relaxed transition-colors duration-200">{result.psychology.quirks}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 外貌 + 背景 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2 transition-colors duration-200">
                  <User className="w-4 sm:w-5 h-4 sm:h-5" /> {t('secAppearance')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm transition-colors duration-200">{result.appearance.summary}</p>
                <ul className="space-y-1.5 sm:space-y-2 mt-2">
                  {result.appearance.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-pink-500 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 transition-colors duration-200">
                  <History className="w-4 sm:w-5 h-4 sm:h-5" /> {t('secBackground')}
                </h3>
                <div className="bg-indigo-50 dark:bg-gray-900/30 p-3 transition-colors duration-200 sm:p-4 rounded-lg border-l-2 border-indigo-500">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm italic transition-colors duration-200">{result.background.story_summary}</p>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-2 transition-colors duration-200">{t('labelSecret')}</h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-200 dark:border-red-900/30 transition-colors duration-200">{result.background.secret}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: NPC 指令 */}
        {activeTab === 'sysprompt' && (
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200 sm:p-6 rounded-xl border border-gray-300 dark:border-gray-700 relative group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 transition-colors duration-200">
                  {t('labelSysPrompt')}
                </h3>
                <button
                  onClick={() => handleCopy(result.system_prompt || "", 'sysprompt')}
                  className="text-xs flex items-center gap-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-1.5 rounded transition-colors duration-200 border border-gray-400 dark:border-gray-600 self-start sm:self-auto"
                >
                  {copyFeedback === 'sysprompt' ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copyFeedback === 'sysprompt' ? t('btnCopied') : t('btnCopy')}
                </button>
              </div>

              <div className="font-mono text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed whitespace-pre-wrap bg-yellow-50 dark:bg-black/30 p-3 sm:p-4 rounded-lg border-l-4 border-yellow-500 max-h-[300px] sm:max-h-none overflow-y-auto transition-colors duration-200">
                {result.system_prompt || "生成失败"}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 sm:p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/30 flex gap-3 transition-colors duration-200">
              <div className="flex-shrink-0 mt-1">
                <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-600 dark:text-yellow-500 transition-colors duration-200" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-yellow-700 dark:text-yellow-400 mb-1 transition-colors duration-200">{t('labelDevGuide')}</h4>
                <p className="text-xs text-gray-700 dark:text-gray-400 transition-colors duration-200">{t('textDevGuide')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 视觉设计室 */}
        {activeTab === 'prompt' && (
          <div className="animate-fadeIn h-full flex flex-col gap-4 sm:gap-6">
            {/* 使用指南 */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-500/30 rounded-xl p-4 flex gap-3 transition-colors duration-200">
              <div className="flex-shrink-0 mt-0.5">
                <Palette className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors duration-200" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-green-700 dark:text-green-300 mb-1.5 transition-colors duration-200">{t('visualUsageGuide')}</h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">{t('visualUsageGuideText')}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 flex-1">
              {/* 视觉类型选择器 */}
              <div className="w-full md:w-48 flex-shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {VISUAL_TYPES.map((type, idx) => (
                  <button
                    key={type.id}
                    onClick={() => setVisualTab(type.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal ${
                      visualTab === type.id
                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-750 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className={`font-mono text-xs opacity-50 ${visualTab === type.id ? 'text-pink-200' : 'text-gray-600 dark:text-gray-500'}`}>
                      {formatStep(idx + 1)}
                    </span>
                    <type.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{t('visualTypes')[type.label] || type.label}</span>
                  </button>
                ))}
              </div>

              {/* 视觉内容区 */}
              <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200 sm:p-6 rounded-xl border border-gray-300 dark:border-gray-700 min-h-[300px] flex flex-col">
                {(() => {
                  const currentPrompt = fullImagePrompt?.[visualTab];

                  if (!currentPrompt) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-600 dark:text-gray-500 transition-colors duration-200">
                        <p>{t('mdGenerateFailed')}</p>
                      </div>
                    );
                  }

                  return (
                    <div className="animate-fadeIn flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 transition-colors duration-200">
                          <Palette className="w-4 h-4" /> {t('visualTypes')[visualTab] || visualTab}
                        </h3>
                        <button
                          onClick={() => handleCopy(currentPrompt, visualTab)}
                          className="text-xs flex items-center gap-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-1.5 rounded transition-colors duration-200 border border-gray-400 dark:border-gray-600"
                        >
                          {copyFeedback === visualTab ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copyFeedback === visualTab ? t('btnCopied') : t('btnCopy')}
                        </button>
                      </div>

                      {/* Tab 描述 - 移到标题下方 */}
                      <div className="mb-4 text-xs text-gray-600 dark:text-gray-500 transition-colors duration-200">
                        {t('visualDescriptions')[visualTab]}
                      </div>

                      {visualTab !== 'portrait' && (
                        <div className="mb-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900/30 rounded-lg p-3 text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed transition-colors duration-200">
                          {visualTab === 'three_views' ? t('guideRefPortrait') : t('guideRefSheet')}
                        </div>
                      )}

                      <p className="font-mono text-xs sm:text-sm text-pink-700 dark:text-pink-300 leading-relaxed break-words bg-pink-50 dark:bg-black/30 p-3 sm:p-4 rounded-lg flex-1 overflow-y-auto custom-scrollbar transition-colors duration-200">
                        {currentPrompt}
                      </p>

                      {/* 风格说明 */}
                      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-400 leading-relaxed transition-colors duration-200">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200">{t('visualStyleNotice')}</span> {t('visualStyleNoticeText')}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: JSON 数据 */}
        {activeTab === 'json' && (
          <div className="animate-fadeIn h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">{t('labelRawJson')}</h3>
              <button
                onClick={() => handleCopy(JSON.stringify(result, null, 2), 'json')}
                className="text-xs flex items-center gap-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-1.5 rounded transition-colors duration-200 border border-gray-400 dark:border-gray-600 self-start sm:self-auto"
              >
                {copyFeedback === 'json' ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" /> : <Copy className="w-3 h-3" />}
                {copyFeedback === 'json' ? t('btnCopied') : t('btnCopy')}
              </button>
            </div>

            <pre className="bg-gray-100 dark:bg-gray-950 p-3 sm:p-4 rounded-lg text-emerald-700 dark:text-emerald-400 font-mono text-[10px] sm:text-xs overflow-auto custom-scrollbar flex-1 border border-gray-300 dark:border-gray-800 transition-colors duration-200">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultDisplay;
