import { GoogleGenAI } from '@google/genai';

// O SDK busca automaticamente a variável de ambiente GEMINI_API_KEY
const ai = new GoogleGenAI();

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Escreva uma mensagem curta de boas-vindas para um desenvolvedor JavaScript.',
    });

    console.log(response.text);
  } catch (error) {
    console.error('Erro ao chamar a API:', error);
  }
}

main();npm install dotenv