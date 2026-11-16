// Comum às páginas de configurações: sessão, menu do usuário e sair.

const CHAVE_USUARIO = 'neurocore.usuario';

function lerUsuario() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIO) || 'null');
    } catch {
        return null;
    }
}

window.usuarioAtual = lerUsuario();
if (!window.usuarioAtual) {
    window.location.replace('/Login/login.html');
}

window.salvarUsuario = (dados) => {
    const atual = lerUsuario() || {};
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify({ ...atual, ...dados }));
    window.usuarioAtual = lerUsuario();
};

function toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('menuUsuario').classList.toggle('mostrar');
}
window.toggleMenu = toggleMenu;

document.addEventListener('click', (event) => {
    const menu = document.getElementById('menuUsuario');
    const botao = document.getElementById('btn-usuario');
    if (menu && botao && !botao.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('mostrar');
    }
});

document.querySelectorAll('[data-sair]').forEach((link) => {
    link.addEventListener('click', () => {
        localStorage.removeItem(CHAVE_USUARIO);
    });
});
