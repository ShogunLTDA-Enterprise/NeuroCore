document.addEventListener('DOMContentLoaded', () => {
    const campoMensagem = document.querySelector('.chat-input');
    const botaoEnviar = document.querySelector('.btn-envio');
    const containerMensagens = document.querySelector('.container-msg');

    if (!campoMensagem || !botaoEnviar || !containerMensagens) {
        console.error('Não foi possível inicializar o envio de mensagens.');
        return;
    }

    function enviarMensagem() {
        const texto = campoMensagem.value.trim();
        if (!texto) return;

        const mensagem = document.createElement('div');
        mensagem.className = 'card-msg self';

        const conteudo = document.createElement('p');
        conteudo.className = 'text-msg';
        conteudo.textContent = texto;

        mensagem.appendChild(conteudo);
        containerMensagens.appendChild(mensagem);
        campoMensagem.value = '';
        containerMensagens.scrollTop = containerMensagens.scrollHeight;
        campoMensagem.focus();
    }

    botaoEnviar.addEventListener('click', enviarMensagem);
    campoMensagem.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            enviarMensagem();
        }
    });
});