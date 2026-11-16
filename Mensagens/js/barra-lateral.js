const CHAVE_PROJETOS = 'neurocore.projetos';

document.addEventListener('DOMContentLoaded', () => {
    const botaoMenu = document.getElementById('btn-menu-lateral');
    const barraLateral = document.getElementById('barra-lateral-esquerda');
    const botaoFechar = document.getElementById('btn-fechar-lateral');
    const listaMembros = document.getElementById('lista-membros-lateral');
    const estadoMembros = document.getElementById('estado-membros-lateral');

    function definirBarraAberta(aberta) {
        barraLateral.classList.toggle('aberta', aberta);
        document.body.classList.toggle('barra-lateral-aberta', aberta);
        barraLateral.setAttribute('aria-hidden', String(!aberta));
        botaoMenu.setAttribute('aria-expanded', String(aberta));
    }

    botaoMenu.addEventListener('click', () => definirBarraAberta(true));
    botaoFechar.addEventListener('click', () => definirBarraAberta(false));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') definirBarraAberta(false);
    });

    let projetos;
    try {
        projetos = JSON.parse(localStorage.getItem(CHAVE_PROJETOS) || '[]');
    } catch (error) {
        console.error('Não foi possível carregar os membros dos projetos.', error);
        estadoMembros.textContent = 'Não foi possível carregar os membros.';
        return;
    }

    if (!Array.isArray(projetos)) {
        console.error('Os dados salvos dos projetos estão inválidos.');
        estadoMembros.textContent = 'Não foi possível carregar os membros.';
        return;
    }

    const emailsVistos = new Set();
    projetos.forEach((projeto) => {
        if (!projeto) return;

        const emailsMembros = Array.isArray(projeto.emailsMembros)
            ? projeto.emailsMembros
            : typeof projeto.emailMembro === 'string' ? [projeto.emailMembro] : [];

        emailsMembros.forEach((emailMembro) => {
            if (typeof emailMembro !== 'string') return;

            const email = emailMembro.trim();
            if (!email) return;

            const chaveEmail = email.toLowerCase();
            if (emailsVistos.has(chaveEmail)) return;
            emailsVistos.add(chaveEmail);

            const item = document.createElement('li');
            item.className = 'membro-lateral';

            const icone = document.createElement('i');
            icone.className = 'bi bi-person-circle';
            icone.setAttribute('aria-hidden', 'true');

            const nome = document.createElement('span');
            nome.textContent = email.split('@')[0];

            item.append(icone, nome);
            listaMembros.appendChild(item);
        });
    });

    estadoMembros.textContent = emailsVistos.size
        ? ''
        : 'Nenhum membro convidado ainda.';
    estadoMembros.hidden = emailsVistos.size > 0;
});
