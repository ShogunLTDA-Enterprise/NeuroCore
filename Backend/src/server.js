const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);   // o Socket.IO usa ESTE servidor
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const historico = []; // depois troque por um banco de dados

io.on('connection', (socket) => {
  const nome = String(socket.handshake.auth.nome || 'Anônimo').slice(0, 30);

  socket.emit('historico', historico);        // quem entra recebe as últimas mensagens

  socket.on('mensagem', (texto) => {
    texto = String(texto || '').trim().slice(0, 1000);
    if (!texto) return;

    const msg = { nome, texto, hora: new Date().toISOString() };
    historico.push(msg);
    if (historico.length > 100) historico.shift();

    io.emit('mensagem', msg);                 // envia para TODOS, inclusive quem mandou
  });
});

server.listen(3000, () => console.log('Rodando em http://localhost:3000'));