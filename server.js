import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { conectarBanco, sql } from './database.js';

const app = express();
const ai = new GoogleGenAI({});

// Middlewares
app.use(cors());
app.use(express.json());

// Função para testar/buscar usuários do SQL Server
async function buscarUsuarios() {
    let pool = await conectarBanco();
    
    if (pool) {
        try {
            let resultado = await pool.request().query("SELECT * FROM Usuarios");
            console.log("📋 Usuários cadastrados no banco:");
            console.log(resultado.recordset);
        } catch (err) {
            console.error("Erro na consulta de usuários:", err);
        }
    }
}

// Rota para atender as requisições do Gemini vindas do Kanban
app.post('/api/kanban/ai', async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
        });

        res.json({ resposta: response.text });
    } catch (error) {
        console.error('Erro ao processar chamada do Gemini:', error);
        res.status(500).json({ error: error.message });
    }
});

// Inicialização do Servidor
const PORT = 3000;

app.listen(PORT, async () => {
    console.log(`🚀 Servidor NeuroCore rodando em http://localhost:${PORT}`);
    
    // Executa a busca de usuários logo após ligar o servidor
    await buscarUsuarios();
});