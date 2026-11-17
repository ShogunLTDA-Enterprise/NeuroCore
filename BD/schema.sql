-- NeuroCore: esquema do banco (SQLite).
-- Versão funcional do script original BD/NeuroCoreBD.sql (SQL Server),
-- com as tabelas de usuários, projetos, conversas, mensagens e tarefas,
-- mais as tabelas Contatos e Erros usadas pelo painel administrativo.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuarios   INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL COLLATE NOCASE,
    senha         TEXT NOT NULL,
    criado_em     TEXT DEFAULT (datetime('now', 'localtime')),
    ultimo_login  TEXT
);

CREATE TABLE IF NOT EXISTS Projeto (
    id_projeto   INTEGER PRIMARY KEY AUTOINCREMENT,
    NumVar       INTEGER NOT NULL DEFAULT 0,
    msm          TEXT,
    id_criador   INTEGER,
    FOREIGN KEY (id_criador) REFERENCES Usuarios (id_usuarios) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Conversa (
    id_conversa     INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarios_1_id   INTEGER,
    usuarios_2_id   INTEGER,
    criado_em       TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (usuarios_1_id) REFERENCES Usuarios (id_usuarios) ON DELETE CASCADE,
    FOREIGN KEY (usuarios_2_id) REFERENCES Usuarios (id_usuarios)
);

CREATE TABLE IF NOT EXISTS Mensagens (
    id_mensagens  INTEGER PRIMARY KEY AUTOINCREMENT,
    id_conversa   INTEGER,
    Conteudo      TEXT NOT NULL,
    remetente_id  INTEGER,
    FOREIGN KEY (id_conversa) REFERENCES Conversa (id_conversa) ON DELETE CASCADE,
    FOREIGN KEY (remetente_id) REFERENCES Usuarios (id_usuarios)
);

CREATE TABLE IF NOT EXISTS Tarefas (
    id_tarefas   INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo       TEXT NOT NULL CHECK (length(titulo) <= 100),
    descricao    TEXT CHECK (length(descricao) <= 500),
    statu        TEXT NOT NULL,
    ordem        INTEGER NOT NULL,
    id_projeto   INTEGER,
    FOREIGN KEY (id_projeto) REFERENCES Projeto (id_projeto) ON DELETE CASCADE
);

-- Contatos enviados pelo formulário da página inicial (empresas / interessados)
CREATE TABLE IF NOT EXISTS Contatos (
    id_contato  INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT NOT NULL,
    assunto     TEXT NOT NULL,
    mensagem    TEXT NOT NULL,
    criado_em   TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Erros registrados pelo servidor e pelo front-end
CREATE TABLE IF NOT EXISTS Erros (
    id_erro     INTEGER PRIMARY KEY AUTOINCREMENT,
    origem      TEXT NOT NULL,
    mensagem    TEXT NOT NULL,
    criado_em   TEXT DEFAULT (datetime('now', 'localtime'))
);
