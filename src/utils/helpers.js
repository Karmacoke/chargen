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
 * 获取反套路程度的 AI 指导文本
 * @param {string} level - 反套路等级 key
 * @returns {string} - AI 指导文本
 */
const getSubversionGuidance = (level) => {
  const guidance = {
    ordinary: `SUBVERSION LEVEL: Ordinary (0/4)
Create an ARCHETYPAL character. They should perfectly match expectations for their role.
- A knight: honorable, brave, armored, sword-wielding
- A witch: mysterious, dark robes, pointy hat, cauldron
- A merchant: shrewd, money-focused, well-dressed
NO surprising contradictions. This is a classic, textbook example of their profession.`,

    surprising: `SUBVERSION LEVEL: Surprising (1/4)
Create a character with ONE OR TWO small unexpected traits that make them interesting.
- A knight who secretly writes poetry
- A witch who is terrible at remembering spell ingredients
- A merchant who gives discounts to the poor
These quirks are charming but don't fundamentally challenge the character's core identity.`,

    memorable: `SUBVERSION LEVEL: Memorable (2/4)
Create a character with CLEAR INNER CONTRADICTIONS that create dramatic tension.
- A knight who is terrified of blood but fights anyway
- A witch who doesn't believe in magic but uses it daily
- A merchant who secretly hates wealth
The contradiction should be central to who they are, not just a quirk.`,

    unconventional: `SUBVERSION LEVEL: Unconventional (3/4)
Create a character who STRONGLY DEFIES expectations for their role.
- A gentle orc barbarian who prefers diplomacy
- A cowardly dragon slayer who runs from mice
- A healer who secretly enjoys watching suffering
The subversion should be immediately obvious and create constant tension with their role.`,

    extreme: `SUBVERSION LEVEL: Extreme Rebel (4/4)
Create a character who COMPLETELY SHATTERS the mold. They are a walking paradox.
- A pacifist assassin who has never killed
- A devout nun who curses constantly but has unshakeable faith
- A fire mage who is deathly afraid of flames
- A thief who compulsively returns what they steal
Every aspect of this character should challenge assumptions. They are unforgettable BECAUSE they make no sense at first glance.`
  };

  return guidance[level] || guidance.ordinary;
};

/**
 * 构建角色生成的用户 Prompt
 * @param {Object} params - { mode, worldSetting, role, gender, keywords, targetLanguage, worldOptions, subversionLevel }
 * @returns {string} - 用户 Prompt
 */
export const buildUserPrompt = ({ mode, worldSetting, role, gender, keywords, targetLanguage, worldOptions, subversionLevel }) => {
  if (mode === 'random') {
    const keys = Object.keys(worldOptions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomWorld = worldOptions[randomKey];
    return `Please generate a detailed character completely at random. World setting: ${randomWorld}. Language of output MUST be: ${targetLanguage}.`;
  }

  const subversionGuidance = getSubversionGuidance(subversionLevel || 'ordinary');

  return `Please generate and refine a detailed character based on the following clues:
  - World View: ${worldSetting}
  - Role/Identity: ${role || 'Random'}
  - Gender: ${gender || 'Random'}
  - Keywords/Clues: ${keywords || 'None, please improvise'}

${subversionGuidance}

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

## DRAMATIC SEASONING (IMPORTANT!)
You are NOT creating a background NPC. You are forging a PROTAGONIST-level character.
- Functional NPCs only have roles (shopkeeper, quest-giver). AVOID this.
- Protagonists have SPECIFIC visual symbols and behavioral quirks that make them instantly memorable.
- Think: "What single image or gesture would make this character iconic?"
- Add contradictions: A gentle giant who faints at the sight of blood. A fearless warrior who talks to plants.
- Give them a "camera-ready" moment: What would their movie poster look like?

## JSON Structure:
{
  "identity": { "name": "Name", "aliases": "Aliases/Title", "age": "Age", "gender": "Gender", "race": "Race", "occupation": "Occupation", "alignment": "Alignment" },
  "appearance": { "summary": "Summary", "features": ["Feature1", "Feature2"] },
  "psychology": {
    "mbti": "MBTI",
    "personality_keywords": ["Key1", "Key2"],
    "desire": "Core Desire",
    "fear": "Core Fear",
    "flaw": "Character Flaw",
    "high_concept": "A one-sentence character pitch (e.g., 'An immortal cursed bounty hunter who must hunt his own kind to survive')",
    "quirks": "A specific, visual behavioral quirk (e.g., 'Always taps the table three times with left hand before speaking', 'Collects teeth from defeated enemies')"
  },
  "background": { "origin": "Origin", "story_summary": "Story", "secret": "Dark Secret" },
  "image_prompt": "Visual description tags for Stable Diffusion/Midjourney (in English)",
  "system_prompt": "A detailed system instruction in ${targetLanguage} that tells an LLM to roleplay as THIS specific character. Include: name, personality, background, speaking style, knowledge, behavioral patterns, and quirks."
}

IMPORTANT:
- The "high_concept" is the elevator pitch - if you had 10 seconds to describe this character to a movie producer, what would you say?
- The "quirks" must be SPECIFIC and VISUAL - not "is nervous" but "constantly adjusts glasses even when not wearing any"
- The "system_prompt" field MUST be a roleplay instruction for THIS SPECIFIC CHARACTER, NOT a general character generator instruction.
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
