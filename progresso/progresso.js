document.addEventListener('DOMContentLoaded', () => {
    const btnCriarCard = document.getElementById('btnCriarCard');
    const inputCardTexto = document.getElementById('novoCardTexto');
    const colunas = document.querySelectorAll('.coluna-kanban');

    window.toggleMenu = function(event) {
        event.preventDefault();
        const menu = document.getElementById('menuUsuario');
        menu.classList.toggle('ativo');
    };

    document.addEventListener('click', (e) => {
        const btnUsuario = document.getElementById('btn-usuario');
        const menuUsuario = document.getElementById('menuUsuario');
        
        if (menuUsuario && btnUsuario && !btnUsuario.contains(e.target) && !menuUsuario.contains(e.target)) {
            menuUsuario.classList.remove('ativo');
        }
    });

    if (btnCriarCard && inputCardTexto) {
        btnCriarCard.addEventListener('click', criarNovoCard);

        inputCardTexto.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                criarNovoCard();
            }
        });
    }

    function criarNovoCard() {
        const texto = inputCardTexto.value.trim();
        if (!texto) return;

        const card = document.createElement('div');
        card.className = 'nada';
        card.draggable = true;

        card.innerHTML = `
            <img class="user1" src="/imagens/user (3).png" alt="user_kanban">
            <p>${texto}</p>
            <div class="gemini-botao" draggable="false">
                <a href="#">
                    <img src="/imagens/Google_Gemini_icon_2025.svg.png" alt="Gemini">
                </a>
            </div>
        `;

        adicionarEventosDrag(card);

        const primeiraColuna = document.querySelector('.coluna-kanban .kanban1');
        if (primeiraColuna) {
            primeiraColuna.appendChild(card);
        }

        inputCardTexto.value = '';
    }

    const cardsExistentes = document.querySelectorAll('.nada');
    cardsExistentes.forEach(card => adicionarEventosDrag(card));

    function adicionarEventosDrag(card) {
        card.addEventListener('dragstart', (e) => {
            card.classList.add('arrastando');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('arrastando');
        });
    }

    colunas.forEach(coluna => {
        const conteinerColuna = coluna.querySelector('.kanban1');
        
        if (!conteinerColuna) return;

        coluna.addEventListener('dragover', (e) => {
            e.preventDefault();
            coluna.classList.add('drag-over');
        });

        coluna.addEventListener('dragleave', () => {
            coluna.classList.remove('drag-over');
        });

        coluna.addEventListener('drop', (e) => {
            e.preventDefault();
            coluna.classList.remove('drag-over');

            const cardArrastando = document.querySelector('.arrastando');
            if (cardArrastando) {
                conteinerColuna.appendChild(cardArrastando);
            }
        });
    });
});