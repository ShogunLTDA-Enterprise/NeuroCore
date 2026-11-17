if (!window.usuarioAtual) { throw new Error("Sessão não encontrada."); }
const formatarData = (texto) => {
    if (!texto) return '—';
    const data = new Date(texto.replace(' ', 'T'));
    return Number.isNaN(data.getTime()) ? texto : data.toLocaleString('pt-BR');
};

const feedback = document.getElementById('feedback-senha');
const botao = document.getElementById('btn-senha');
const form = document.getElementById('form-senha');

function mostrarFeedback(texto, tipo) {
    feedback.textContent = texto;
    feedback.className = `feedback ${tipo}`;
    feedback.hidden = false;
}

async function carregarConta() {
    try {
        const resposta = await fetch(`/api/usuarios/${window.usuarioAtual.id}`);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();
        document.getElementById('info-email').textContent = dados.email;
        document.getElementById('info-criado').textContent = formatarData(dados.criadoEm);
        document.getElementById('info-login').textContent = formatarData(dados.ultimoLogin);
    } catch (erro) {
        console.error(erro);
        mostrarFeedback('Não consegui carregar seus dados.', 'erro');
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedback.hidden = true;

    const novaSenha = document.getElementById('nova-senha').value;
    if (novaSenha !== document.getElementById('confirma-nova-senha').value) {
        mostrarFeedback('As duas senhas novas não batem.', 'erro');
        return;
    }

    botao.disabled = true;
    try {
        const resposta = await fetch(`/api/usuarios/${window.usuarioAtual.id}/senha`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senhaAtual: document.getElementById('senha-atual').value,
                novaSenha,
            }),
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarFeedback(dados.erro || 'Não consegui trocar a senha.', 'erro');
            return;
        }

        form.reset();
        mostrarFeedback('Senha trocada.', 'sucesso');
    } catch (erro) {
        console.error(erro);
        mostrarFeedback('Não consegui falar com o servidor. Tente de novo.', 'erro');
    } finally {
        botao.disabled = false;
    }
});

carregarConta();
