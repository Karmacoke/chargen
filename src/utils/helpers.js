/**
 * 工具函数模块
 * 提供通用的辅助功能（剪贴板、Prompt 构建等）
 */

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {boolean} - 是否成功
 */
export const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (err) {
    console.error('Copy failed', err);
    document.body.removeChild(textArea);
    return false;
  }
};

/**
 * 构建角色生成的用户 Prompt
 * @param {Object} params - { mode, worldSetting, role, gender, keywords, targetLanguage, worldOptions }
 * @returns {string} - 用户 Prompt
 */
export const buildUserPrompt = ({ mode, worldSetting, role, gender, keywords, targetLanguage, worldOptions }) => {
  if (mode === 'random') {
    const keys = Object.keys(worldOptions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomWorld = worldOptions[randomKey];
    return `Please generate a detailed character completely at random. World setting: ${randomWorld}. Language of output MUST be: ${targetLanguage}.`;
  }

  return `Please generate and refine a detailed character based on the following clues:
  - World View: ${worldSetting}
  - Role/Identity: ${role || 'Random'}
  - Gender: ${gender || 'Random'}
  - Keywords/Clues: ${keywords || 'None, please improvise'}
  If information is scarce, please complete it creatively.
  IMPORTANT: The output content MUST be in ${targetLanguage} language.`;
};

/**
 * 构建系统指令
 * @param {string} targetLanguage - 目标语言名称
 * @returns {string} - System Instruction
 */
export const buildSystemInstruction = (targetLanguage) => {
  return `
You are a professional Character Generator API.
Your task is to generate a highly detailed fictional character based on user input.
You MUST output strictly in JSON format. NO Markdown tags.
Use ${targetLanguage} for all text fields (except image_prompt and system_prompt).

JSON Structure:
{
  "identity": { "name": "Name", "aliases": "Aliases", "age": "Age", "gender": "Gender", "race": "Race", "occupation": "Occupation", "alignment": "Alignment" },
  "appearance": { "summary": "Summary", "features": ["Feature1"] },
  "psychology": { "mbti": "MBTI", "personality_keywords": ["Key1"], "desire": "Desire", "fear": "Fear", "flaw": "Flaw" },
  "background": { "origin": "Origin", "story_summary": "Story", "secret": "Secret" },
  "image_prompt": "Visual description tags for Stable Diffusion/Midjourney (in English)",
  "system_prompt": "A detailed system instruction in ${targetLanguage} that tells an LLM to roleplay as THIS specific character. It should include: the character's name, personality traits, background, speaking style, knowledge, and behavioral patterns. Example format: 'You are [Name], a [occupation] from [origin]. Your personality is [traits]. You speak in a [style] manner. You know about [knowledge]. When interacting, you tend to [behaviors]...'"
}

IMPORTANT: The "system_prompt" field MUST be a roleplay instruction for THIS SPECIFIC CHARACTER, NOT a general character generator instruction.
  `.trim();
};

/**
 * 清理 JSON 字符串（移除 Markdown 代码块标记并修复常见格式问题）
 * @param {string} text - 原始文本
 * @returns {string} - 清理后的 JSON 字符串
 */
export const cleanJsonResponse = (text) => {
  let cleaned = text
    // 移除 Markdown 代码块标记
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // 尝试提取 JSON 对象（处理前后有额外文本的情况）
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  // 修复常见的 JSON 格式问题
  cleaned = cleaned
    // 移除尾部逗号（对象和数组）
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    // 修复换行符在字符串内的问题（将实际换行转为 \n）
    .replace(/[\r\n]+/g, (match, offset, string) => {
      // 检查是否在字符串内（简化检测）
      const before = string.substring(0, offset);
      const quotes = (before.match(/(?<!\\)"/g) || []).length;
      // 如果引号数量为奇数，说明在字符串内
      if (quotes % 2 === 1) {
        return '\\n';
      }
      return ' ';
    })
    // 移除控制字符
    .replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === '\n' || char === '\r' || char === '\t') {
        return ' ';
      }
      return '';
    });

  return cleaned;
};

/**
 * 安全解析 JSON，带有错误恢复机制
 * @param {string} text - JSON 字符串
 * @returns {Object} - 解析后的对象
 */
export const safeParseJson = (text) => {
  const cleaned = cleanJsonResponse(text);

  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    console.warn('First JSON parse attempt failed, trying recovery...', firstError.message);

    // 尝试更激进的修复
    let recovered = cleaned
      // 将单引号替换为双引号（仅用于属性名）
      .replace(/(\{|,)\s*'([^']+)'\s*:/g, '$1"$2":')
      // 将单引号值替换为双引号（简单情况）
      .replace(/:\s*'([^']*)'/g, ':"$1"')
      // 移除可能的 JavaScript 注释
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    try {
      return JSON.parse(recovered);
    } catch (secondError) {
      console.error('JSON recovery failed:', secondError.message);
      console.error('Problematic JSON:', cleaned.substring(0, 500) + '...');
      throw new Error(`JSON 解析失败: ${firstError.message}. 请重试生成。`);
    }
  }
};
