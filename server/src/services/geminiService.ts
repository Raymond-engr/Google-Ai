import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function generateResponse(query: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    throw new Error('API key is missing');
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `For "${query}", give a definition if it's a word. For phrases, provide a brief meaning. For calculations, give the result. For questions about people, events, or concepts, search the web and give a brief latest and accurate answer.`
          }]
        }]
      }
    );
    
    console.log('API Response:', response.data);
    
    if (response.data.candidates[0].finishReason === 'SAFETY') {
      return 'The query was flagged for safety reasons, and a response cannot be generated.';
    }

    if (response.data && response.data.candidates && response.data.candidates[0].content) {
  const content = response.data.candidates[0].content.parts ? response.data.candidates[0].content.parts[0].text : 'No content available';
  return content;
} else {
  console.error('Unexpected response structure:', response.data);
  throw new Error('Unexpected response format');
}
  } catch (error: any) {
    if (error.response) {
      console.error('Error response from API:', error.response.status, error.response.data);
    } else {
      console.error('Request error:', error.message);
    }
    throw new Error('Failed to generate response');
  }
}