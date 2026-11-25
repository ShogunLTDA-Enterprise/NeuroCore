import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './database.js';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100kb' }));
app.use(express.static(raiz, { extensions: ['html'] }));

// ---------- utilitários ----------

const texto = (valor, max) => (typeof valor === 'string' ? valor.trim().slice(0, max) : '');
const emailValido = (email) => email.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function gerarHashSenha(senha) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function senhaConfere(senha, armazenada) {
    const [salt, hash] = armazenada.split(':');
    const esperado = Buffer.from(hash, 'hex');
    const calculado = crypto.scryptSync(senha, salt, 64);
    return esperado.length === calculado.length && crypto.timingSafeEqual(esperado, calculado);
}

function registrarErro(origem, erro) {
    try {
        db.prepare('INSERT INTO Erros (origem, mensagem) VALUES (?, ?)')
          .run(origem, String(erro?.message ?? erro).slice(0, 500));
    } catch (e) {
        console.error('Falha ao registrar erro:', e);
    }
}

// ---------- rotas de conta ----------

const stmtCadastro = db.prepare('INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)');
const stmtUsuarioPorEmail = db.prepare('SELECT * FROM Usuarios WHERE email = ?');
const stmtUltimoLogin = db.prepare("UPDATE Usuarios SET ultimo_login = datetime('now', 'localtime') WHERE id_usuarios = ?");

app.post('/api/cadastro', (req, res) => {
    const nome = texto(req.body.nome, 100);
    const email = texto(req.body.email, 100).toLowerCase();
    const senha = typeof req.body.senha === 'string' ? req.body.senha : '';

    if (!nome) return res.status(400).json({ erro: 'Informe seu nome.' });
    if (!emailValido(email)) return res.status(400).json({ erro: 'E-mail inválido.' });
    if (senha.length < 6) return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });

    try {
        const info = stmtCadastro.run(nome, email, gerarHashSenha(senha));
        res.status(201).json({ id: info.lastInsertRowid, nome, email });
    } catch (erro) {
        if (String(erro.message).includes('UNIQUE constraint failed')) {
            return res.status(409).json({ erro: 'Já existe uma conta com este e-mail.' });
        }
        throw erro;
    }
});

app.post('/api/login', (req, res) => {
    const email = texto(req.body.email, 100).toLowerCase();
    const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
    const usuario = stmtUsuarioPorEmail.get(email);

    if (!usuario || !senhaConfere(senha, usuario.senha)) {
        return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    stmtUltimoLogin.run(usuario.id_usuarios);
    res.json({ id: usuario.id_usuarios, nome: usuario.nome, email: usuario.email });
});

// ---------- conta e perfil do usuário ----------

const stmtUsuarioPorId = db.prepare(`
    SELECT id_usuarios AS id, nome, email, senha, criado_em AS criadoEm, ultimo_login AS ultimoLogin
    FROM Usuarios WHERE id_usuarios = ?`);

function usuarioDaRota(req, res) {
    const id = Number(req.params.id);
    const usuario = Number.isInteger(id) ? stmtUsuarioPorId.get(id) : undefined;
    if (!usuario) {
        res.status(404).json({ erro: 'Usuário não encontrado.' });
        return null;
    }
    return usuario;
}

app.get('/api/usuarios/:id', (req, res) => {
    const usuario = usuarioDaRota(req, res);
    if (!usuario) return;
    const { id, nome, email, criadoEm, ultimoLogin } = usuario;
    res.json({ id, nome, email, criadoEm, ultimoLogin });
});

app.put('/api/usuarios/:id/perfil', (req, res) => {
    const usuario = usuarioDaRota(req, res);
    if (!usuario) return;

    const nome = texto(req.body.nome, 100);
    if (!nome) return res.status(400).json({ erro: 'O nome não pode ficar vazio.' });

    db.prepare('UPDATE Usuarios SET nome = ? WHERE id_usuarios = ?').run(nome, usuario.id);
    res.json({ id: usuario.id, nome, email: usuario.email });
});

app.put('/api/usuarios/:id/senha', (req, res) => {
    const usuario = usuarioDaRota(req, res);
    if (!usuario) return;

    const senhaAtual = typeof req.body.senhaAtual === 'string' ? req.body.senhaAtual : '';
    const novaSenha = typeof req.body.novaSenha === 'string' ? req.body.novaSenha : '';

    if (!senhaConfere(senhaAtual, usuario.senha)) {
        return res.status(401).json({ erro: 'A senha atual está incorreta.' });
    }
    if (novaSenha.length < 6) {
        return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres.' });
    }

    db.prepare('UPDATE Usuarios SET senha = ? WHERE id_usuarios = ?')
      .run(gerarHashSenha(novaSenha), usuario.id);
    res.json({ ok: true });
});

// ---------- contato e erros do front-end ----------

app.post('/api/contato', (req, res) => {
    const email = texto(req.body.email, 100);
    const assunto = texto(req.body.assunto, 150);
    const mensagem = texto(req.body.mensagem, 2000);

    if (!emailValido(email)) return res.status(400).json({ erro: 'E-mail inválido.' });
    if (!assunto || !mensagem) return res.status(400).json({ erro: 'Preencha assunto e mensagem.' });

    db.prepare('INSERT INTO Contatos (email, assunto, mensagem) VALUES (?, ?, ?)').run(email, assunto, mensagem);
    res.status(201).json({ ok: true });
});

app.post('/api/erros', (req, res) => {
    registrarErro(texto(req.body.origem, 100) || 'cliente', texto(req.body.mensagem, 500) || 'Erro desconhecido');
    res.status(201).json({ ok: true });
});

// ---------- painel administrativo ----------

app.get('/api/admin/resumo', (req, res) => {
    const contagem = (sql) => db.prepare(sql).get().total;

    res.json({
        totais: {
            usuarios: contagem('SELECT COUNT(*) AS total FROM Usuarios'),
            usuariosAtivos: contagem("SELECT COUNT(*) AS total FROM Usuarios WHERE ultimo_login >= datetime('now', '-30 days', 'localtime')"),
            projetos: contagem('SELECT COUNT(*) AS total FROM Projeto'),
            tarefas: contagem('SELECT COUNT(*) AS total FROM Tarefas'),
            contatos: contagem('SELECT COUNT(*) AS total FROM Contatos'),
            erros: contagem('SELECT COUNT(*) AS total FROM Erros'),
        },
        usuarios: db.prepare(`
            SELECT id_usuarios AS id, nome, email, criado_em AS criadoEm, ultimo_login AS ultimoLogin
            FROM Usuarios ORDER BY criado_em DESC LIMIT 100`).all(),
        contatos: db.prepare(`
            SELECT id_contato AS id, email, assunto, mensagem, criado_em AS criadoEm
            FROM Contatos ORDER BY criado_em DESC LIMIT 100`).all(),
        erros: db.prepare(`
            SELECT id_erro AS id, origem, mensagem, criado_em AS criadoEm
            FROM Erros ORDER BY criado_em DESC LIMIT 100`).all(),
    });
});

// ---------- tratamento de erros ----------

app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

app.use((erro, req, res, next) => {
    console.error(erro);
    registrarErro(`servidor ${req.method} ${req.path}`, erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
});

server.listen(3000, () => console.log('Rodando em http://localhost:3000'));