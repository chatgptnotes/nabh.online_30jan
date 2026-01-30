import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from '../lib/supabase';
import type { InfographicConfig } from './infographicGenerator';

export const generateGeminiInfographic = async (config: InfographicConfig): Promise<string> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Model fallback strategy
  const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  let model = null;
  let text = '';
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting to generate with model: ${modelName}`);
      model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
      
      // If we got here, it worked
      break;
    } catch (error) {
      console.warn(`Failed with model ${modelName}:`, error);
      lastError = error;
      // Continue to next model
    }
  }

  if (!text && lastError) {
    throw lastError; // Throw the last error if all failed
  }

  try {
    // Cleanup markdown if present
    text = text.replace(/```svg/g, '').replace(/```/g, '').trim();
    
    // basic validation
    if (!text.startsWith('<svg')) {
       // If Gemini chatted a bit, try to find the SVG
       const svgStart = text.indexOf('<svg');
       const svgEnd = text.lastIndexOf('</svg>');
       if (svgStart !== -1 && svgEnd !== -1) {
         text = text.substring(svgStart, svgEnd + 6);
       } else {
         throw new Error('Gemini did not return valid SVG code.');
       }
    }

    return text;
  } catch (error) {
    console.error('Error generating Gemini infographic:', error);
    throw error;
  }
};
