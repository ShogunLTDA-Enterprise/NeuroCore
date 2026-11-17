// Só entra no painel quem passou pelo login de administrador.
if (sessionStorage.getItem('neurocore.admin') !== '1') {
    window.location.replace('/Login/login.html');
}

const mensagem = document.getElementById('mensagem-admin');
const filtroUsuarios = document.getElementById('filtro-usuarios');
let usuarios = [];

const formatarData = (texto) => {
    if (!texto) return '—';
    const data = new Date(texto.replace(' ', 'T'));
    return Number.isNaN(data.getTime()) ? texto : data.toLocaleString('pt-BR');
};

// Monta células com textContent, para que nenhum dado vindo do banco seja interpretado como HTML.
function preencherLinhas(corpo, linhas, colunas) {
    corpo.replaceChildren();
    if (linhas.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = colunas.length;
        td.className = 'vazio';
        td.textContent = 'Nenhum registro encontrado.';
        tr.appendChild(td);
        corpo.appendChild(tr);
        return;
    }
    linhas.forEach((linha) => {
        const tr = document.createElement('tr');
        colunas.forEach((coluna) => {
            const td = document.createElement('td');
            td.textContent = coluna.formatar ? coluna.formatar(linha[coluna.campo]) : (linha[coluna.campo] ?? '—');
            tr.appendChild(td);
        });
        corpo.appendChild(tr);
    });
}

function desenharUsuarios() {
    const termo = filtroUsuarios.value.trim().toLowerCase();
    const filtrados = usuarios.filter((u) =>
        !termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo));

    preencherLinhas(document.getElementById('corpo-usuarios'), filtrados, [
        { campo: 'nome' },
        { campo: 'email' },
        { campo: 'criadoEm', formatar: formatarData },
        { campo: 'ultimoLogin', formatar: formatarData },
    ]);
}

async function carregarResumo() {
    try {
        const resposta = await fetch('/api/admin/resumo');
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();

        const t = dados.totais;
        document.getElementById('total-usuarios').textContent = t.usuarios;
        document.getElementById('total-ativos').textContent = t.usuariosAtivos;
        document.getElementById('total-projetos').textContent = t.projetos;
        document.getElementById('total-tarefas').textContent = t.tarefas;
        document.getElementById('total-contatos').textContent = t.contatos;
        document.getElementById('total-erros').textContent = t.erros;

        usuarios = dados.usuarios;
        desenharUsuarios();

        preencherLinhas(document.getElementById('corpo-contatos'), dados.contatos, [
            { campo: 'criadoEm', formatar: formatarData },
            { campo: 'email' },
            { campo: 'assunto' },
            { campo: 'mensagem' },
        ]);

        preencherLinhas(document.getElementById('corpo-erros'), dados.erros, [
            { campo: 'criadoEm', formatar: formatarData },
            { campo: 'origem' },
            { campo: 'mensagem' },
        ]);
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = 'Não consegui carregar os dados. Confira se o servidor está rodando.';
        mensagem.hidden = false;
    }
}

filtroUsuarios.addEventListener('input', desenharUsuarios);

document.getElementById('btn-sair').addEventListener('click', () => {
    sessionStorage.removeItem('neurocore.admin');
    window.location.href = '/Login/login.html';
});

carregarResumo();
