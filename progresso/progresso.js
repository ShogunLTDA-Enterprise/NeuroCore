document.querySelectorAll('.nada').forEach(nada => {
    nada.addEventListener('dragstart', e => {
        e.currentTarget.classList.add('dragging'); 
    })

    nada.addEventListener('dragend', e => {
        e.currentTarget.classList.remove('dragging');
    })
})

document.querySelectorAll('.kanban1').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        e.currentTarget.classList.add('nada-hover');
    })

    column.addEventListener('dragleave', e => {
        e.currentTarget.classList.remove('nada-hover');
    })

    column.addEventListener('drop', e =>{
        e.currentTarget.classList.remove('nada-hover');

        const dragNada = document.querySelector('.nada.dragging');
        e.currentTarget.appendChild(dragNada);
    })
})

function toggleMenu(event) {
    event.preventDefault(); 
    
    const menu = document.getElementById('menuUsuario');
    
    menu.classList.toggle('mostrar');
}


window.addEventListener('click', function(event) {
    const menu = document.getElementById('menuUsuario');
    const btn = document.getElementById('btn-usuario');
    

    if (!btn.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('mostrar');
    }
});


// Aguarda o HTML carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    // Substitua pela sua chave REAL apenas para testes locais.
    const API_KEY = "SUA_CHAVE_DE_API_AQUI"; 

    // Seleciona todos os botões do Gemini que estão dentro dos cards do Kanban
    // Usamos um seletor que pega qualquer classe que comece com "gemini-botao"
    const botoesGemini = document.querySelectorAll("[class^='gemini-botao']");

    botoesGemini.forEach(botao => {
        botao.addEventListener("click", async (event) => {
            event.preventDefault(); // Evita que o link <a> recarregue a página

            // 1. Encontra o card "nada" onde o botão foi clicado
            const card = botao.closest(".nada");
            
            // 2. Pega o texto do parágrafo <p> que está dentro desse card específico
            const textoTarefa = card.querySelector("p").innerText;

            // Mensagem de feedback visual no console
            console.log(`Enviando para o Gemini: "${textoTarefa}"`);

            try {
                // 3. Faz a chamada para a API oficial do Gemini (Modelo Flash, que é rápido e ideal para resumos)
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Faça um resumo bem curto e direto da seguinte tarefa de um Kanban: "${textoTarefa}"`
                            }]
                        }]
                    })
                });

                const dados = await response.json();

                // 4. Trata a resposta recebida da API
                if (dados.candidates && dados.candidates[0].content.parts[0].text) {
                    const resumo = dados.candidates[0].content.parts[0].text;
                    
                    // Exibe o resumo para o usuário (pode ser um alert ou um modal customizado)
                    alert(`Resumo do Gemini:\n\n${resumo}`);
                } else {
                    alert("Não foi possível gerar o resumo. Verifique o console.");
                    console.error("Resposta inesperada da API:", dados);
                }

            } catch (erro) {
                console.error("Erro ao conectar com a API do Gemini:", erro);
                alert("Houve um erro ao tentar conectar com a Inteligência Artificial.");
            }
        });
    });
});