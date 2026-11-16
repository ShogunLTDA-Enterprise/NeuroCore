const CHAVE_PROJETOS = 'neurocore.projetos';
const COR_PADRAO_PROJETO = '#A78BFA';

document.addEventListener('DOMContentLoaded', () => {
    let projetos;
    try {
        projetos = JSON.parse(localStorage.getItem(CHAVE_PROJETOS) || '[]');
    } catch (error) {
        console.error('Não foi possível ler os projetos salvos.', error);
        return;
    }

    if (!Array.isArray(projetos)) {
        console.error('Os dados salvos dos projetos estão inválidos.');
        return;
    }

    const conteudo = document.querySelector('.conteudo');
    if (!conteudo) return;

    projetos.forEach((projeto) => {
        if (!projeto || typeof projeto.nome !== 'string' || typeof projeto.cor !== 'string') {
            console.error('Um projeto salvo possui dados inválidos.', projeto);
            return;
        }

        const caixa = document.createElement('div');
        caixa.className = 'caixa_proj';
        caixa.style.setProperty(
            '--cor-projeto',
            /^#[0-9a-f]{6}$/i.test(projeto.cor) ? projeto.cor : COR_PADRAO_PROJETO
        );

        const texto = document.createElement('div');
        texto.className = 'text_proj';

        const nome = document.createElement('p');
        nome.className = 'nome_proj';
        nome.textContent = typeof projeto.template === 'string' && projeto.template
            ? `${projeto.nome} - ${projeto.template}`
            : projeto.nome;
        texto.appendChild(nome);

        const emailsMembros = Array.isArray(projeto.emailsMembros)
            ? projeto.emailsMembros
            : typeof projeto.emailMembro === 'string' ? [projeto.emailMembro] : [];
        const convidados = new Set(
            emailsMembros
                .filter((email) => typeof email === 'string' && email.trim())
                .map((email) => email.trim().toLowerCase())
        );
        const quantidadeMembros = 1 + convidados.size;
        const membros = document.createElement('p');
        membros.className = 'membros_proj';
        membros.textContent = `${quantidadeMembros} membros`;
        texto.appendChild(membros);

        if (projeto.descricao) {
            const descricao = document.createElement('p');
            descricao.className = 'descricao_proj';
            descricao.textContent = `Descrição: ${projeto.descricao}`;
            texto.appendChild(descricao);
        }

        const abrir = document.createElement('a');
        abrir.className = 'abrir_proj';
        abrir.href = '/projetos/projetos.html';
        abrir.textContent = 'Abrir Projeto';
        texto.appendChild(abrir);

        caixa.appendChild(texto);
        conteudo.appendChild(caixa);
    });
});
