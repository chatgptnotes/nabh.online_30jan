import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from '../lib/supabase';
import type { InfographicConfig } from './infographicGenerator';

export const generateGeminiInfographic = async (config: InfographicConfig, customKey?: string): Promise<string> => {
  const apiKey = customKey || getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please enter a valid key.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Model fallback strategy
  // Trying strict model names that are compatible with older API keys
  const modelsToTry = ['gemini-1.0-pro', 'gemini-pro', 'gemini-1.5-flash'];
  let model = null;
  let text = '';
  let lastError = null;

  const prompt = `
    You are an expert graphic designer and SVG artist.
    Create a modern, stylish, professional SVG infographic for a hospital accreditation objective.
    
    Data:
    - Title: ${config.title}
    - Objective Code: ${config.code}
    - Description: ${config.description}
    - Hospital Name: ${config.hospitalName || 'Hospital'}
    - Key Points: ${config.keyPoints?.join(', ') || 'N/A'}

    CRITICAL REQUIREMENTS:
    1. **BILINGUAL (English + Hindi)**: You MUST translate the Title, Description, and all Key Points into Hindi. Display English text prominently, with Hindi translation immediately below or beside it for every section.
    2. **VISUAL FLOW**: Break down the Description/Key Points into a clear Step-by-Step flow or Process Diagram. Use arrows or dotted lines to connect steps.
    3. **ICONS**: You MUST include embedded SVG path icons for every step (e.g., documents, safety shield, doctor, patient, hygiene, checklist). Do not use external images; draw the icons with <path> tags.

    Design Specifications:
    - Output ONLY valid SVG code.
    - Dimensions: ${config.width || 800}x${config.height || 1200} (Portrait).
    - Style: Modern, clean, flat design with gradients and soft shadows (using SVG defs/filters).
    - Color Palette: Professional Healthcare (Teals, Blues, Clean Greens). Use 'Red' only for "Core" compliance alerts.
    - Typography: Use standard sans-serif fonts (Arial, Roboto, Segoe UI). Ensure text is readable.
    
    Structure:
    - **Header**: Hospital Name (Bilingual), Objective Code (Badge style).
    - **Main Title**: Bilingual Title.
    - **Visual Body**: 3-5 distinct steps/cards showing the process or requirements. Each card must have an Icon + English Text + Hindi Text.
    - **Footer**: Compliance tagline in English & Hindi.
  `;

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
