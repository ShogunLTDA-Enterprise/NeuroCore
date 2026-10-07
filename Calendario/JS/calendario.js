const mesAnoElement = document.getElementById('mesAno');
const datasElement = document.getElementById('datas');
const antesetElement = document.getElementById('anteset');
const postsetElement = document.getElementById('postset');

const painel = document.getElementById('painel-tarefas');
const painelTitulo = document.getElementById('painel-titulo');
const painelFechar = document.getElementById('painel-fechar');
const listaTarefas = document.getElementById('lista-tarefas');
const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');

let currentDate = new Date();
let dataSelecionada = null;
const tarefas = JSON.parse(localStorage.getItem('tarefas') || '{}');


const formatarData = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const updatecalendario = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    mesAnoElement.textContent = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    let datasHTML = '';

    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, -i + 1);
        datasHTML += `<div class="date off" data-data="${formatarData(prevDate)}">${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        datasHTML += `<div class="date ${activeClass}" data-data="${formatarData(date)}">${i}</div>`;
    }

    const remainingDays = lastDayIndex === 6 ? 0 : 6 - lastDayIndex;

    for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datasHTML += `<div class="date off" data-data="${formatarData(nextDate)}">${nextDate.getDate()}</div>`;
    }

    datasElement.innerHTML = datasHTML;
    marcarSelecionado();
};


const marcarSelecionado = () => {
    datasElement.querySelectorAll('.date').forEach((el) => {
        el.classList.toggle('selecionado', el.dataset.data === dataSelecionada);
    });
};



const salvarTarefas = () => localStorage.setItem('tarefas', JSON.stringify(tarefas));

const renderizarTarefas = () => {
    listaTarefas.innerHTML = '';
    (tarefas[dataSelecionada] || []).forEach((texto, i) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = texto;

        const btn = document.createElement('button');
        btn.innerHTML = '<i class="bi bi-trash"></i>';
        btn.addEventListener('click', () => {
            tarefas[dataSelecionada].splice(i, 1);
            salvarTarefas();
            renderizarTarefas();
        });

        li.append(span, btn);
        listaTarefas.appendChild(li);
    });
};

const abrirPainel = () => {
    const [ano, mes, dia] = dataSelecionada.split('-');
    painelTitulo.textContent = `Tarefas de ${dia}/${mes}/${ano}`;
    renderizarTarefas();
    painel.classList.add('aberto');
};

const fecharPainel = () => painel.classList.remove('aberto');


datasElement.addEventListener('click', (e) => {
    const dia = e.target.closest('.date');
    if (!dia) return;
    dataSelecionada = dia.dataset.data;
    marcarSelecionado();
    abrirPainel();
});

formTarefa.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = inputTarefa.value.trim();
    if (!texto) return;
    (tarefas[dataSelecionada] ||= []).push(texto);
    inputTarefa.value = '';
    salvarTarefas();
    renderizarTarefas();
});

painelFechar.addEventListener('click', fecharPainel);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharPainel(); });

antesetElement.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updatecalendario();
});

postsetElement.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updatecalendario();
});

updatecalendario();