require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: true
    }
};

async function conectarBanco() {
    try {
        let pool = await sql.connect(config);
        console.log("Conectado ao SQL Server com sucesso!");
        return pool;
    } catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    }
}

module.exports = {
    sql,
    conectarBanco
};