CREATE DATABASE Neurocore

CREATE TABLE Usuarios(
	id_usuarios INT IDENTITY(1,1) PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR (255) NOT NULL
);

CREATE TABLE Projeto(
	id_projeto INT IDENTITY(1,1) PRIMARY KEY,
	NumVar INT NOT NULL,
	msm varchar(200),
	id_criador INT,
	CONSTRAINT fk_criador_projeto FOREIGN KEY(id_criador) REFERENCES Usuarios(id_usuarios)
);

CREATE TABLE Conversa(
	id_conversa int identity(1,1) PRIMARY KEY,
	usuarios_1_id INT,
	usuarios_2_id INT,
	CONSTRAINT fk_usuario_1 FOREIGN KEY(usuarios_1_id) REFERENCES Usuarios(id_usuarios),
	CONSTRAINT fk_usuario_2 FOREIGN KEY(usuarios_2_id) REFERENCES Usuarios(id_usuarios),
	criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Mensagens(
	id_mensagens int IDENTITY(1,1) PRIMARY KEY,
	id_conversa int,
	Conteudo TEXT NOT NULL,
	remetente_id INT,
	CONSTRAINT conversa_id FOREIGN KEY(id_conversa) REFERENCES Conversa(id_conversa),
	CONSTRAINT fk_remetente_id FOREIGN KEY(remetente_id) REFERENCES Usuarios(id_usuarios)
);

CREATE TABLE Tarefas (
	id_tarefas INT IDENTITY(1,1) PRIMARY KEY,
	titulo VARCHAR(100) NOT NULL,
	descricao VARCHAR(500),
	statu VARCHAR(100) NOT NULL,
	ordem INT NOT NULL,
	id_projeto INT,
	CONSTRAINT fk_tarefa_projeto FOREIGN KEY (id_projeto) REFERENCES Projeto(id_projeto) ON DELETE CASCADE
);
