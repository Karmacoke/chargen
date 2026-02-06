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
 * 清理 JSON 字符串（移除 Markdown 代码块标记）
 * @param {string} text - 原始文本
 * @returns {string} - 清理后的 JSON 字符串
 */
export const cleanJsonResponse = (text) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};
