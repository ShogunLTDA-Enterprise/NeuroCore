import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';


const ai = new GoogleGenAI();

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Olá!',
  });
  console.log(response.text);
}

main();