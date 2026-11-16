// Acesso de administrador (acesso local, sem banco de dados).
const ADMIN = { email: 'elonmusk@gmail.com', senha: 'Bolsolula' };

const form = document.querySelector('.login-form');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const mensagem = document.getElementById('mensagem-login');
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

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!email || !senha) {
        mostrarErro('Preencha e-mail e senha.');
        return;
    }

    if (email.toLowerCase() === ADMIN.email && senha === ADMIN.senha) {
        sessionStorage.setItem('neurocore.admin', '1');
        window.location.href = '/admin/admin.html';
        return;
    }

    botao.disabled = true;
    try {
        const resposta = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarErro(dados.erro || 'Não consegui entrar.');
            return;
        }

        localStorage.setItem('neurocore.usuario', JSON.stringify({ id: dados.id, nome: dados.nome, email: dados.email }));
        window.location.href = '/home/home.html';
    } catch (erro) {
        console.error(erro);
        mostrarErro('Não consegui falar com o servidor. Tente de novo.');
        registrarErro('login', erro);
    } finally {
        botao.disabled = false;
    }
});
