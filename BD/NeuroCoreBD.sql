CREATE DATABASE Neurocore

CREATE TABLE Usuarios(
	id_usuarios INT PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR (255) NOT NULL
);

CREATE TABLE Projeto(
	id_projeto INT PRIMARY KEY,
	NumVar INT NOT NULL,
	msm varchar(200),
	id_criador INT,
	CONSTRAINT fk_criador_projeto FOREIGN KEY(id_criador) REFERENCES Usuarios(id_usuarios)
);

CREATE TABLE Conversa(
	id_conversa VARCHAR(200) PRIMARY KEY,
	usuarios_1_id INT,
	usuarios_2_id INT,
	CONSTRAINT fk_usuario_1 FOREIGN KEY(usuarios_1_id) REFERENCES Usuarios(id_usuarios),
	CONSTRAINT fk_usuario_2 FOREIGN KEY(usuarios_2_id) REFERENCES Usuarios(id_usuarios),
	criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Mensagens(
	id_mensagens VARCHAR(900) PRIMARY KEY,
	id_conversa VARCHAR(200),
	Conteudo TEXT NOT NULL,
	remetente_id INT,
	CONSTRAINT conversa_id FOREIGN KEY(id_conversa) REFERENCES Conversa(id_conversa),
	CONSTRAINT fk_remetente_id FOREIGN KEY(remetente_id) REFERENCES Usuarios(id_usuarios),
);

INSERT INTO Usuarios (id_usuarios, nome, email, senha) VALUES
(1, 'Gustavo', 'Gustavo@gmail.com', 'DONO'),
(2, 'Leonardo', 'Leonardo@gmail.com', 'Ajudante'),
(3, 'Vinicius', 'Vinicius@gmail.com', 'Homossexual'),
(4, 'Elon Moska', 'ElonMusk@gmail.com', 'SerjaoFoguetesAmante');

SELECT * FROM Usuarios
