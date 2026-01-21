import { GoogleGenAI } from '@google/genai';

// Ensure we have a valid initialization, fallback to empty string to prevent constructor crash
const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getLegalAdvice = async (query: string, category: string, language: string = 'en') => {
  if (!API_KEY) throw new Error('API Key is not configured.');

  const langPrompt = language === 'pt' ? 'Respond in Portuguese.' : 'Respond in English.';

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Acting as a professional consultant for PLS Consultants, provide high-level, preliminary legal context for the following ${category} query.
    Use Google Search to ensure the information reflects the current 2024-2025 regulatory landscape in the UK and Portugal.
    ${langPrompt}
    Disclaimer: This is not formal legal advice.
    Query: ${query}`,
    config: {
      systemInstruction:
        'You are the AI Legal Assistant for PLS Consultants. You are knowledgeable about UK and Portuguese law. Be professional, cautious, and always recommend a consultation with a specialist. Reference search sources clearly.',
      temperature: 0.3,
      tools: [{ googleSearch: {} }],
    },
  });

  return response;
};

export const chatWithNoVo = async (
  message: string,
  history: { role: 'user' | 'model'; content: string }[],
  language: string = 'en'
) => {
  if (!API_KEY) return 'System Offline: No API Key.';

  const langPrompt =
    language === 'pt'
      ? 'Ensure you respond in Portuguese to the user.'
      : 'Ensure you respond in English to the user.';

  const contents = history.map((h) => ({
    role: h.role,
    parts: [{ text: h.content }],
  }));

  contents.push({ role: 'user', parts: [{ text: message }] });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents,
    config: {
      systemInstruction: `You are 'NoVo', the intelligent AI Avatar for PLS Consultants.
      You help clients navigate our services (Legal, Accountancy, Translation, Business Consultancy).
      CEO: Pedro Xavier. Locations: London (Vauxhall) & Portugal.
      Be sophisticated and professional. ${langPrompt}`,
    },
  });

  return response.text || 'No response received.';
};

export const translateDocument = async (
  sourceText: string,
  sourceFileBase64: string | null,
  fileMimeType: string | null,
  sourceLang: string,
  targetLang: string
) => {
  if (!API_KEY) return 'Service Unavailable.';

  const prompt = `Act as a CIOL Chartered Linguist for PLS Consultants.
  Extract all text from the provided document and translate from ${sourceLang} to ${targetLang}.
  Return ONLY the translated text, preserving formatting where possible.
  Terminology: Legal/Business.
  ${sourceText ? `Additional text input: ${sourceText}` : ''}`;

  const parts: any[] = [{ text: prompt }];

  if (sourceFileBase64 && fileMimeType) {
    parts.push({
      inlineData: {
        mimeType: fileMimeType,
        data: sourceFileBase64,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts }],
    config: {
      systemInstruction:
        'You are a CIOL-certified professional translator specializing in legal and business documents.',
      temperature: 0.1,
    },
  });

  return response.text || 'Translation failed.';
};

export const analyzeImage = async (
  imageBase64: string,
  userPrompt: string,
  language: string = 'en'
) => {
  if (!API_KEY) return 'Service Unavailable.';

  const langPrompt =
    language === 'pt' ? 'Provide analysis in Portuguese.' : 'Provide analysis in English.';
  const prompt = `Analyze this image for PLS Consultants. ${langPrompt} Inquiry: ${
    userPrompt || 'General analysis.'
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [{ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }, { text: prompt }],
    },
    config: {
      systemInstruction: 'You are a senior analyst for PLS Consultants.',
      temperature: 0.3,
    },
  });

  return response.text || 'Analysis failed.';
};
