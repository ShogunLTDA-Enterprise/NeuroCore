import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function testarConexao() {
  console.log('⏳ Enviando requisição para o Gemini...');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Responda apenas: "A API do Gemini está funcionando perfeitamente!"',
    });

    console.log('\n✅ SUCESSO! Resposta recebida:\n');
    console.log(response.text);
  } catch (error) {
    console.error('\n❌ ERRO ao conectar com a API:\n');
    console.error(error.message);
  }
}

testarConexao();