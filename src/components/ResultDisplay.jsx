/**
 * 结果展示组件
 * 职责：展示生成的角色数据（4 个 Tab：角色卡、NPC 指令、绘图咒语、JSON）
 */

import React, { useState } from 'react';
import { User, BookOpen, MessageSquare, Palette, Terminal, History, Brain, Check, Copy, Download } from './Icons';
import { copyToClipboard } from '../utils/helpers';

const ResultDisplay = ({ result, isLoading, config, translations, lang }) => {
  const [activeTab, setActiveTab] = useState('card');
  const [copyFeedback, setCopyFeedback] = useState('');

  const t = (key) => translations[lang]?.[key] || key;

  const handleCopy = (text, type) => {
    const success = copyToClipboard(text);
    if (success) {
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  // 生成 Markdown 内容
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

- **MBTI**: ${result.psychology.mbti}
- **${t('mdCoreDesire')}**: ${result.psychology.desire}
- **${t('mdCoreFear')}**: ${result.psychology.fear}
${result.psychology.flaw ? `- **${t('mdFlaw')}**: ${result.psychology.flaw}` : ''}
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

## ${t('mdNpcSection')}

\`\`\`
${result.system_prompt || t('mdGenerateFailed')}
\`\`\`

---

## ${t('mdImageSection')}

\`\`\`
${result.image_prompt || ''}
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

  // 下载 Markdown 文件
  const handleDownloadMarkdown = () => {
    if (!result) return;

    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    // 使用角色名作为文件名，移除特殊字符
    const fileName = `${result.identity.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_character.md`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    // 显示下载反馈
    setCopyFeedback('download');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  // 状态1：等待输入
  if (!result && !isLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-4 ring-1 ring-gray-700">
          <User className="w-10 h-10 opacity-50" />
        </div>
        <h3 className="text-xl font-medium text-gray-300">{t('waitingTitle')}</h3>
        <p className="max-w-xs mt-2 text-sm">{t('waitingDesc')}</p>
      </div>
    );
  }

  // 状态2：加载中
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 z-10 backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-300 font-mono animate-pulse">{t('loadingText')}</p>
        <p className="text-xs text-gray-500 mt-2">{t('loadingProvider')} {config.provider}</p>
      </div>
    );
  }

  // 状态3：结果展示
  return (
    <>
      {/* Tab 导航 + 下载按钮 */}
      <div className="flex border-b border-gray-700 bg-gray-900/50">
        <div className="flex-1 flex overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('card')} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'card' ? 'border-indigo-500 text-indigo-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <BookOpen className="w-4 h-4" /> <span className="hidden xs:inline sm:inline">{t('tabCard')}</span>
          </button>
          <button onClick={() => setActiveTab('sysprompt')} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'sysprompt' ? 'border-yellow-500 text-yellow-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <MessageSquare className="w-4 h-4" /> <span className="hidden xs:inline sm:inline">{t('tabSysPrompt')}</span>
          </button>
          <button onClick={() => setActiveTab('prompt')} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'prompt' ? 'border-pink-500 text-pink-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <Palette className="w-4 h-4" /> <span className="hidden xs:inline sm:inline">{t('tabPrompt')}</span>
          </button>
          <button onClick={() => setActiveTab('json')} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'json' ? 'border-emerald-500 text-emerald-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <Terminal className="w-4 h-4" /> <span className="hidden xs:inline sm:inline">{t('tabJson')}</span>
          </button>
        </div>
        {/* 下载按钮 */}
        <button
          onClick={handleDownloadMarkdown}
          className={`flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors flex-shrink-0 border-l border-gray-700 ${
            copyFeedback === 'download'
              ? 'text-green-400 bg-green-900/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          title={t('btnDownloadMd')}
        >
          {copyFeedback === 'download' ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span className="hidden sm:inline">{copyFeedback === 'download' ? t('btnDownloaded') : t('btnDownloadMd')}</span>
        </button>
      </div>

      {/* Tab 内容 */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
        {/* 角色卡片 */}
        {activeTab === 'card' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="flex flex-col gap-4 sm:gap-6 items-start border-b border-gray-700 pb-4 sm:pb-6">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{result.identity.name}</h2>
                  {result.identity.aliases && <span className="text-indigo-400 italic font-medium text-sm sm:text-base">"{result.identity.aliases}"</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-300">
                  <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.race}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.gender}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.age}</span>
                  <span className="bg-indigo-900/50 text-indigo-200 px-2 py-1 rounded border border-indigo-700/50">{result.identity.occupation}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">{result.identity.alignment}</span>
                </div>
              </div>
              <div className="w-full bg-gray-900/50 p-3 sm:p-4 rounded-lg border border-gray-700">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 sm:mb-3 flex items-center gap-2">
                  <Brain className="w-3 h-3" /> {t('secPsychology')}
                </h4>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">{t('labelMbti')}</span><span className="text-yellow-400 font-mono">{result.psychology.mbti}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-gray-400 flex-shrink-0">{t('labelDesire')}</span><span className="text-gray-200 text-right truncate">{result.psychology.desire}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-gray-400 flex-shrink-0">{t('labelFear')}</span><span className="text-gray-200 text-right truncate">{result.psychology.fear}</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-pink-400 flex items-center gap-2"><User className="w-4 sm:w-5 h-4 sm:h-5" /> {t('secAppearance')}</h3>
                <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">{result.appearance.summary}</p>
                <ul className="space-y-1.5 sm:space-y-2 mt-2">{result.appearance.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-pink-500 flex-shrink-0"></span>{feature}
                  </li>
                ))}</ul>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-indigo-400 flex items-center gap-2"><History className="w-4 sm:w-5 h-4 sm:h-5" /> {t('secBackground')}</h3>
                <div className="bg-gray-900/30 p-3 sm:p-4 rounded-lg border-l-2 border-indigo-500"><p className="text-gray-300 leading-relaxed text-xs sm:text-sm italic">{result.background.story_summary}</p></div>
                <div className="pt-2"><h4 className="text-xs font-bold text-red-400 uppercase mb-2">{t('labelSecret')}</h4><p className="text-xs sm:text-sm text-gray-400 bg-red-900/10 p-2 rounded border border-red-900/30">{result.background.secret}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* NPC 指令 */}
        {activeTab === 'sysprompt' && (
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-700 relative group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">{t('labelSysPrompt')}</h3>
                <button onClick={() => handleCopy(result.system_prompt || "", 'sysprompt')} className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-colors border border-gray-600 self-start sm:self-auto">
                  {copyFeedback === 'sysprompt' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copyFeedback === 'sysprompt' ? t('btnCopied') : t('btnCopy')}
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm text-yellow-300 leading-relaxed whitespace-pre-wrap bg-black/30 p-3 sm:p-4 rounded-lg border-l-4 border-yellow-500 max-h-[300px] sm:max-h-none overflow-y-auto">{result.system_prompt || "生成失败"}</div>
            </div>
            <div className="bg-yellow-900/10 p-3 sm:p-4 rounded-lg border border-yellow-800/30 flex gap-3">
              <div className="flex-shrink-0 mt-1"><MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" /></div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-yellow-400 mb-1">{t('labelDevGuide')}</h4>
                <p className="text-xs text-gray-400">{t('textDevGuide')}</p>
              </div>
            </div>
          </div>
        )}

        {/* 绘图 Prompt */}
        {activeTab === 'prompt' && (
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider">{t('labelImgPrompt')}</h3>
                <button onClick={() => handleCopy(result.image_prompt, 'prompt')} className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-colors border border-gray-600 self-start sm:self-auto">
                  {copyFeedback === 'prompt' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copyFeedback === 'prompt' ? t('btnCopied') : t('btnCopy')}
                </button>
              </div>
              <p className="font-mono text-xs sm:text-sm text-pink-300 leading-relaxed break-words bg-black/30 p-3 sm:p-4 rounded-lg">{result.image_prompt}</p>
            </div>
            <div className="bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-800/30 flex gap-3">
              <div className="flex-shrink-0 mt-1"><Palette className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" /></div>
              <div><h4 className="text-xs sm:text-sm font-bold text-blue-300 mb-1">{t('labelDevGuide')}</h4><p className="text-xs text-gray-400">{t('textImgGuide')}</p></div>
            </div>
          </div>
        )}

        {/* JSON Data */}
        {activeTab === 'json' && (
          <div className="animate-fadeIn h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider">{t('labelRawJson')}</h3>
              <button onClick={() => handleCopy(JSON.stringify(result, null, 2), 'json')} className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition-colors border border-gray-600 self-start sm:self-auto">
                {copyFeedback === 'json' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copyFeedback === 'json' ? t('btnCopied') : t('btnCopy')}
              </button>
            </div>
            <pre className="bg-gray-950 p-3 sm:p-4 rounded-lg text-emerald-400 font-mono text-[10px] sm:text-xs overflow-auto custom-scrollbar flex-1 border border-gray-800">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultDisplay;
