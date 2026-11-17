const form = document.getElementById('form-perfil');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const feedback = document.getElementById('feedback-perfil');
const botao = document.getElementById('btn-perfil');

function mostrarFeedback(texto, tipo) {
    feedback.textContent = texto;
    feedback.className = `feedback ${tipo}`;
    feedback.hidden = false;
}

async function carregarPerfil() {
    if (!window.usuarioAtual) return;
    try {
        const resposta = await fetch(`/api/usuarios/${window.usuarioAtual.id}`);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();
        campoNome.value = dados.nome;
        campoEmail.value = dados.email;
    } catch (erro) {
        console.error(erro);
        mostrarFeedback('Não consegui carregar seu perfil.', 'erro');
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedback.hidden = true;

    const nome = campoNome.value.trim();
    if (!nome) {
        mostrarFeedback('Escreva seu nome.', 'erro');
        return;
    }

    botao.disabled = true;
    try {
        const resposta = await fetch(`/api/usuarios/${window.usuarioAtual.id}/perfil`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome }),
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarFeedback(dados.erro || 'Não consegui salvar.', 'erro');
            return;
        }

        window.salvarUsuario({ nome: dados.nome });
        campoNome.value = dados.nome;
        mostrarFeedback('Pronto, nome salvo.', 'sucesso');
    } catch (erro) {
        console.error(erro);
        mostrarFeedback('Não consegui falar com o servidor. Tente de novo.', 'erro');
    } finally {
        botao.disabled = false;
    }
});

carregarPerfil();
