import 'dotenv/config';
import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost', 
    port: 1433,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function conectarBanco() {
    try {
        let pool = await sql.connect(config);
        console.log("✅ Conectado ao SQL Server com sucesso!");
        return pool;
    } catch (err) {
        console.error("❌ Erro ao conectar ao banco de dados:", err);
    }
}

export { conectarBanco, sql };