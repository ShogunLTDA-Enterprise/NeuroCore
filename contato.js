// Formulário de contato da página inicial.
const campos = document.querySelector('.contato-form');
const botao = campos.querySelector('.btn-enviar');
const emailInput = document.getElementById('email');
const assuntoInput = document.getElementById('assunto');
const mensagemInput = document.getElementById('mensagem');

const aviso = document.createElement('p');
aviso.className = 'mensagem-erro';
aviso.setAttribute('role', 'status');
aviso.hidden = true;
botao.before(aviso);

function mostrarAviso(texto, sucesso = false) {
    aviso.textContent = texto;
    aviso.classList.toggle('mensagem-sucesso', sucesso);
    aviso.hidden = false;
}

botao.addEventListener('click', async () => {
    aviso.hidden = true;
    if (![emailInput, assuntoInput, mensagemInput].every((campo) => campo.reportValidity())) return;

    botao.disabled = true;
    try {
        const resposta = await fetch('/api/contato', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailInput.value,
                assunto: assuntoInput.value,
                mensagem: mensagemInput.value,
            }),
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarAviso(dados.erro || 'Não consegui enviar. Tente de novo.');
            return;
        }

        mostrarAviso('Recebemos sua mensagem. Obrigado!', true);
        assuntoInput.value = '';
        mensagemInput.value = '';
    } catch (erro) {
        console.error(erro);
        mostrarAviso('Não consegui falar com o servidor. Tente de novo.');
        fetch('/api/erros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origem: 'contato', mensagem: erro.message }),
        }).catch(() => {});
    } finally {
        botao.disabled = false;
    }
});
