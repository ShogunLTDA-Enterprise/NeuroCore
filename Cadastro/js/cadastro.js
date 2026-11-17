const form = document.querySelector('.login-form');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const confirmaInput = document.getElementById('confirma-senha');
const mensagem = document.getElementById('mensagem-cadastro');
const botao = form.querySelector('.btn-enviar');

function mostrarErro(texto) {
    mensagem.textContent = texto;
    mensagem.hidden = false;
}

async function registrarErro(origem, erro) {
    try {
        await fetch('/api/erros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origem, mensagem: erro.message }),
        });
    } catch {
        /* sem conexão: nada a fazer */
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensagem.hidden = true;

    if (senhaInput.value !== confirmaInput.value) {
        mostrarErro('As senhas não batem.');
        return;
    }

    botao.disabled = true;
    try {
        const resposta = await fetch('/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nomeInput.value,
                email: emailInput.value,
                senha: senhaInput.value,
            }),
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarErro(dados.erro || 'Não consegui criar sua conta.');
            return;
        }

        window.location.href = '/Login/login.html';
    } catch (erro) {
        console.error(erro);
        mostrarErro('Não consegui falar com o servidor. Tente de novo.');
        registrarErro('cadastro', erro);
    } finally {
        botao.disabled = false;
    }
});
