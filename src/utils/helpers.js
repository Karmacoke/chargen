/**
 * helpers - 工具函数模块
 * 职责：剪贴板操作、Prompt 构建、JSON 清理、视觉模板
 */

// ============================================
// 剪贴板操作
// ============================================

export const copyToClipboard = async (text) => {
  // 优先使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed:', err);
    }
  }

  // 降级方案：使用已废弃的 execCommand
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Copy failed', err);
    document.body.removeChild(textArea);
    return false;
  }
};

// ============================================
// 反套路系统
// ============================================

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

// ============================================
// Prompt 构建
// ============================================

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
  "image_prompt": "(SEE IMAGE PROMPT RULES BELOW)",
  "system_prompt": "A detailed system instruction in ${targetLanguage} that tells an LLM to roleplay as THIS specific character. Include: name, personality, background, speaking style, knowledge, behavioral patterns, and quirks."
}

## IMAGE PROMPT RULES (CRITICAL - FOLLOW EXACTLY):
The "image_prompt" field must be a FULL BODY character portrait prompt in English, structured in this EXACT order:

1. **Identity**: [Character name], [race] [occupation], full body standing pose
2. **Appearance**: [Detailed facial features], [body type], [distinguishing marks/scars/tattoos]
3. **Clothing & Props**: [Costume details], [weapons], [accessories], [materials/textures]
4. **Pose & Expression**: standing pose, [facial expression that reflects personality]
5. **Format & Composition**: 9:16 aspect ratio, vertical portrait orientation, full body composition from head to feet
6. **Quality & Style**: masterpiece, best quality, 8K resolution, highly detailed, 2D game character concept art, digital illustration, flat color, cell shading, clean lines, sharp focus, white background
7. **Style Constraints**: The image must NOT be photorealistic, 3D rendered, or sketch-like. Avoid pencil drawings, black and white styles, monochrome, blurry effects, cropped compositions, half-body shots, portrait-only frames, messy linework, watercolor styles, oil painting aesthetics, depth of field effects, or motion blur.

RULES:
- The aspect ratio is 9:16 (vertical portrait orientation).
- MUST be FULL BODY (head to feet visible). NEVER half-body or portrait-only.
- MUST include quality keywords: "8K resolution", "masterpiece", "2D game character concept art".
- MUST include style constraints as natural language descriptions (not bracketed negative prompts).
- The prompt should be rich and descriptive (150-250 words), painting a vivid picture of the character.
- Use English only for this field.

IMPORTANT:
- The "high_concept" is the elevator pitch - if you had 10 seconds to describe this character to a movie producer, what would you say?
- The "quirks" must be SPECIFIC and VISUAL - not "is nervous" but "constantly adjusts glasses even when not wearing any"
- The "system_prompt" field MUST be a roleplay instruction for THIS SPECIFIC CHARACTER, NOT a general character generator instruction.
  `.trim();
};

// ============================================
// JSON 清理与解析
// ============================================

export const cleanJsonResponse = (text) => {
  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  cleaned = cleaned
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/[\r\n]+/g, (match, offset, string) => {
      const before = string.substring(0, offset);
      // 使用兼容性更好的方式计算未转义的引号数量
      const quotes = (before.split('"').length - 1) - (before.split('\\"').length - 1);
      if (quotes % 2 === 1) {
        return '\\n';
      }
      return ' ';
    })
    .replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === '\n' || char === '\r' || char === '\t') {
        return ' ';
      }
      return '';
    });

  return cleaned;
};

export const safeParseJson = (text) => {
  const cleaned = cleanJsonResponse(text);

  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    console.warn('First JSON parse attempt failed, trying recovery...', firstError.message);

    let recovered = cleaned
      .replace(/(\{|,)\s*'([^']+)'\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"')
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

// ============================================
// 固定视觉模板
// ============================================

export const VISUAL_TEMPLATES = {
  three_views: `Based on the attached reference image, create a character reference sheet with three views (turnaround). Show the SAME character from three angles: front view, side view (3/4 or profile), and back view. All three views on the same canvas, clearly separated, same scale. T-pose or A-pose for technical clarity. Full body, head to feet visible. 16:9 aspect ratio, horizontal landscape orientation. Game character design, character sheet, reference sheet, three views turnaround, flat color, clean lines, white background, concept art, 2D digital illustration, 8K resolution, masterpiece, best quality, highly detailed. The image must NOT be photorealistic, 3D rendered, or sketch-like. Avoid pencil drawings, black and white styles, monochrome, blurry effects, messy linework, watercolor styles, oil painting aesthetics, depth of field effects, or motion blur.`,

  concept_breakdown: `Based on the attached reference image, create a panoramic character deep concept breakdown sheet. This must be a comprehensive design document showing the character's full anatomy of design elements. Center: Place the character's full body 2D illustration or primary dynamic pose as the visual anchor point. Surrounding layout: Around the central figure, systematically arrange deconstructed elements in the surrounding white space. Include: 1) Clothing layers - deconstruct the outfit into individual garments, showing what's underneath when outer layers are removed, including intimate undergarments with design details and material focus. 2) Material close-ups - magnify 1-2 key areas to showcase texture details. 3) Life slice items - this is NOT limited to large props, must include the character's daily life objects: everyday bag or handbag shown "opened" with contents spilling out (wallet, keys, phone, cosmetics, medicines), small accessories they frequently use, intimate personal items that reveal hidden personality aspects (private diary, medication/supplement boxes, vape pen, or more personal objects based on character). Visual guidance: Use hand-drawn arrows or guide lines connecting peripheral breakdown items to corresponding body parts or areas on the central figure (e.g., bag connecting to hand). Annotation style: Simulate handwritten notes next to each deconstructed element, briefly explaining materials or brand/model hints. 16:9 aspect ratio, horizontal landscape orientation. Art style: High-quality 2D illustration or concept design sketch style, clean sharp lines. Background: Use beige, parchment, or light gray textured background creating design manuscript atmosphere. White or light neutral backdrop, flat color rendering, detailed illustration, 2D digital concept art, 8K resolution, masterpiece, best quality, highly detailed. The image must NOT be photorealistic, 3D rendered, or use realistic painting techniques. Avoid oil painting styles, watercolor effects, depth of field blur, motion blur, or messy sketchy lines.`,

  expression_sheet: `Based on the attached reference image, create a character expression sheet. Show 6-9 different headshots/portrait busts of the SAME character displaying different emotions: happy, sad, angry, surprised, neutral, excited, embarrassed, confident, fearful. Arrange in a grid layout, all clearly visible. FULL COLOR rendering required. 16:9 aspect ratio, horizontal landscape orientation. Game character design, expression sheet, facial expressions, emotion chart, character emotions, multiple headshots, various reactions, full color, flat color, clean lines, white background, concept art, 2D digital illustration, 8K resolution, masterpiece, best quality, highly detailed. The image must NOT be photorealistic, 3D rendered, or sketch-like. Avoid pencil drawings, black and white styles, monochrome, blurry effects, messy linework, watercolor styles, oil painting aesthetics, depth of field effects, or motion blur.`,

  scale_chart: `Based on the attached reference image, create a character scale chart. Show the character standing in a neutral pose next to a height measurement grid with clear measurement lines and height markers (metric and imperial). Full body, head to feet visible. 16:9 aspect ratio, horizontal landscape orientation. Game character design, scale chart, height comparison, reference sheet, full body standing pose, neutral pose, measurement grid, technical illustration, concept art, flat color, clean lines, white background, 2D digital concept art, 8K resolution, masterpiece, best quality, highly detailed. The image must NOT be photorealistic, 3D rendered, or sketch-like. Avoid pencil drawings, black and white styles, monochrome, blurry effects, messy linework, watercolor styles, oil painting aesthetics, depth of field effects, or motion blur.`,

  action_poses: `Based on the attached reference image, create a character action pose sheet. Show 3-5 dynamic poses of the SAME character: combat stance, running, jumping, attacking, and using special abilities. All poses on one canvas, sharp focus, NO motion blur. 16:9 aspect ratio, horizontal landscape orientation. Game character design, action poses, dynamic poses, combat stances, character action sheet, multiple poses, movement study, full body, sharp focus, dramatic angles, full color, flat color, clean lines, white background, concept art, 2D digital illustration, 8K resolution, masterpiece, best quality, highly detailed. The image must NOT be photorealistic, 3D rendered, or use motion blur effects. Avoid sketch-like styles, pencil drawings, black and white rendering, monochrome, blurry compositions, messy linework, watercolor styles, oil painting aesthetics, or depth of field blur.`
};

export const getVisualTemplate = (type) => {
  return VISUAL_TEMPLATES[type] || null;
};
