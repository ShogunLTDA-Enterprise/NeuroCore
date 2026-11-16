# NeuroCore

**Bem-vindos ao NeuroCore!**

NeuroCore é um projeto de TCC do curso técnico em Análise e Desenvolvimento de Sistemas que ajuda no planejamento e na organização de projetos pessoais e empresariais.

## Como executar

Requisitos: Node.js 22.5 ou superior (testado no 22 e no 24). Não é preciso Visual Studio nem compilador.

```bash
npm install
npm start
```

Acesse http://localhost:3000

O banco de dados (SQLite, via o módulo `node:sqlite` embutido no Node) é criado automaticamente em `data/neurocore.db` na primeira execução, a partir do esquema em `BD/schema.sql`.

## Estrutura do banco

- `BD/schema.sql`: esquema em uso (SQLite), baseado no script original `BD/NeuroCoreBD.sql` (SQL Server).
- Tabelas: `Usuarios`, `Projeto`, `Conversa`, `Mensagens`, `Tarefas`, `Contatos` e `Erros`.

## Acesso administrativo

Na tela de login, use o e-mail e a senha de administrador para acessar o painel em `/admin/admin.html`. O painel mostra usuários cadastrados e ativos (últimos 30 dias), projetos, tarefas, contatos recebidos e erros registrados.

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/cadastro` | Cria uma conta (nome, e-mail, senha) |
| POST | `/api/login` | Autentica um usuário |
| POST | `/api/contato` | Registra uma mensagem do formulário de contato |
| POST | `/api/erros` | Registra um erro enviado pelo front-end |
| GET | `/api/admin/resumo` | Dados consolidados para o painel administrativo |
