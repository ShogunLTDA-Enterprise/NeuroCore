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
function toggleMenu(event) {
    event.preventDefault(); 
    const menu = document.getElementById('menuUsuario');
    menu.classList.toggle('mostrar');
}

window.addEventListener('click', function(event) {
    const menu = document.getElementById('menuUsuario');
    const btn = document.getElementById('btn-usuario');
    
    if (btn && menu && !btn.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('mostrar');
    }
});

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