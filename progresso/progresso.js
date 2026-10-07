// --- LÓGICA DE DRAG & DROP DO KANBAN ---
document.querySelectorAll('.nada').forEach(nada => {
    nada.addEventListener('dragstart', e => {
        e.currentTarget.classList.add('dragging'); 
    });

    nada.addEventListener('dragend', e => {
        e.currentTarget.classList.remove('dragging');
    });
});

document.querySelectorAll('.kanban1').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        e.currentTarget.classList.add('nada-hover');
    });

    column.addEventListener('dragleave', e => {
        e.currentTarget.classList.remove('nada-hover');
    });

    column.addEventListener('drop', e => {
        e.currentTarget.classList.remove('nada-hover');

        const dragNada = document.querySelector('.nada.dragging');
        if (dragNada) {
            e.currentTarget.appendChild(dragNada);
        }
    });
});

// --- MENU DE USUÁRIO (DROPDOWN) ---
const popups = [
    { botao: document.getElementById('btn-usuario'), alvo: document.getElementById('menuUsuario'), classe: 'mostrar'   },
    { botao: document.getElementById('btn-notf'),    alvo: document.getElementById('barrinha'),    classe: 'aberto' },
].filter(p => p.botao && p.alvo);

function fecharTodos(exceto) {
    popups.forEach(p => {
        if (p !== exceto) p.alvo.classList.remove(p.classe);
    });
}

popups.forEach(p => {
    p.botao.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();               // impede o clique de "vazar" para o document
        const vaiAbrir = !p.alvo.classList.contains(p.classe);
        fecharTodos(p);                    // fecha os outros
        p.alvo.classList.toggle(p.classe, vaiAbrir);
    });

    // clicar dentro do popup não fecha ele
    p.alvo.addEventListener('click', (e) => e.stopPropagation());
});

// clicar fora ou apertar Esc fecha tudo
document.addEventListener('click', () => fecharTodos());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharTodos(); });



// --- INTEGRAÇÃO COM A API DO GEMINI VIA SERVIDOR EXPRESS ---
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os botões do Gemini nos cards
    const botoesGemini = document.querySelectorAll("[class^='gemini-botao']");

    botoesGemini.forEach(botao => {
        botao.addEventListener("click", async (event) => {
            event.preventDefault(); // Evita recarregar a página pelo link (#)

            // 1. Encontra o card "nada" onde o botão foi clicado
            const card = botao.closest(".nada");
            
            // 2. Pega o texto do parágrafo <p> que está dentro desse card específico
            const textoTarefa = card.querySelector("p").innerText;

            console.log(`🤖 Solicitando análise para: "${textoTarefa}"`);

            try {
                // 3. Faz a requisição para o seu servidor Node.js local
                const response = await fetch("http://localhost:3000/api/kanban/ai", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: `Faça um resumo bem curto e direto da seguinte tarefa de um Kanban: "${textoTarefa}"`
                    })
                });

                const dados = await response.json();

                // 4. Exibe o resultado do Gemini
                if (dados.resposta) {
                    alert(`💡 Resumo do Gemini:\n\n${dados.resposta}`);
                } else {
                    alert("Não foi possível gerar o resumo.");
                    console.error("Resposta inesperada do servidor:", dados);
                }

            } catch (erro) {
                console.error("Erro ao conectar com o servidor Node.js:", erro);
                alert("Erro ao conectar com o servidor Express local. Certifique-se de que ele está rodando na porta 3000.");
            }
        });
    });
});