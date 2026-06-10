const express = require('express')
const app = express()
const port = 3000

// criar rota padrão ou raiz
app.get('/', (req, res) => {
    res.send('Olá Mundo')
})

// escutar a porta 300
app.listen(port, () =>{
    console.log(`O servidor está rodando no endereço: http://localhost:${port}`)
})