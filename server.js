const { conectarBanco, sql } = require('./database');

async function buscarUsuarios() {
    let pool = await conectarBanco();
    
    try {
        let resultado = await pool.request().query("SELECT * FROM Usuarios");
        console.log(resultado.recordset);
    } catch (err) {
        console.error("Erro na consulta:", err);
    }
}