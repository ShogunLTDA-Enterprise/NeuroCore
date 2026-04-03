const container = document.getElementById('container');
const registerBtn = document.getElementById('cadastro');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("ativo");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("ativo");
});