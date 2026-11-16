const CORES_PROJETO = [
    { nome: 'Verde', valor: '#1D9E75' },
    { nome: 'Roxo', valor: '#7F77DD' },
    { nome: 'Rosa', valor: '#D4537E' },
    { nome: 'Azul', valor: '#378ADD' },
    { nome: 'Amarelo', valor: '#FDFF83' },
];

const CHAVE_PROJETOS = 'neurocore.projetos';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-projeto');
    const seletorCores = document.getElementById('cores-projeto');
    const mensagemErro = document.getElementById('erro-projeto');

    CORES_PROJETO.forEach((cor, indice) => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'cor';
        radio.value = cor.valor;
        radio.id = `cor-${indice + 1}`;
        radio.required = true;
        radio.style.position = 'absolute';
        radio.style.opacity = '0';
        radio.style.width = '0';
        radio.style.height = '0';

        const rotulo = document.createElement('label');
        rotulo.htmlFor = radio.id;
        rotulo.className = 'bolinha-cor';
        rotulo.style.backgroundColor = cor.valor;
        rotulo.title = cor.nome;
        rotulo.setAttribute('aria-label', cor.nome);

        seletorCores.append(radio, rotulo);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        mensagemErro.hidden = true;

        const corSelecionada = form.querySelector('input[name="cor"]:checked');
        if (!corSelecionada) {
            mensagemErro.textContent = 'Selecione uma cor para o projeto.';
            mensagemErro.hidden = false;
            return;
        }

        try {
            const projetosSalvos = JSON.parse(localStorage.getItem(CHAVE_PROJETOS) || '[]');
            if (!Array.isArray(projetosSalvos)) {
                throw new Error('Os dados salvos dos projetos estão inválidos.');
            }

            projetosSalvos.push({
                nome: document.getElementById('nome').value.trim(),
                descricao: document.getElementById('descricao').value.trim(),
                emailMembro: document.getElementById('membros').value.trim(),
                inicio: document.getElementById('inicio').value,
                prazo: document.getElementById('prazo').value,
                template: document.getElementById('Template').value,
                cor: corSelecionada.value,
            });

            localStorage.setItem(CHAVE_PROJETOS, JSON.stringify(projetosSalvos));
            window.location.href = '/home/home.html';
        } catch (error) {
            console.error('Não foi possível salvar o projeto.', error);
            mensagemErro.textContent = 'Não foi possível salvar o projeto neste navegador.';
            mensagemErro.hidden = false;
        }
    });
});
