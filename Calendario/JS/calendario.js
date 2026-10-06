
const mesAnoElement = document.getElementById('mesAno');
const datasElement = document.getElementById('datas');
const antesetElement = document.getElementById('anteset');
const postsetElement = document.getElementById('postset');

let currentDate = new Date();

const updatecalendario = () => {
    const currentYear =currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear,currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const mesAnoString = currentDate.toLocaleString('PT-br', { month: 'long', year: 'numeric' })
    mesAnoElement.textContent = mesAnoString;

    let datasHTML = '';

    
    for(let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear,currentMonth,  - i + 1);
        datasHTML += `<div class="date off">${prevDate.getDate()}</div>`;
    } 

    for(let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        datasHTML += `<div class="date ${activeClass}"> ${i}</div>`;
    }
    const remainingDays = lastDayIndex === 6 ? 0 : 6 - lastDayIndex;

    for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datasHTML += `<div class="date off">${nextDate.getDate()}</div>`;
    }
    
    datasElement.innerHTML = datasHTML;
}

antesetElement.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updatecalendario();
})

postsetElement.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updatecalendario();
})

updatecalendario();

const feriados = [
    "2026-09-07", // Independência do Brasil
    "2026-10-12", // Nossa Sra. Aparecida
    "2026-11-02", // Finados
    "2026-11-15", // Proclamação da República
    "2026-12-25"  // Natal
  ];
  
  // Na função onde você gera os elementos dos dias do calendário:
  function renderizarDia(dataAtual, diaNumero) {
    const elementoDia = document.createElement('div');
    elementoDia.classList.add('day');
    elementoDia.textContent = diaNumero;
  
    // Formata a data atual para comparar ("2026-09-07")
    const dataFormatada = dataAtual.toISOString().split('T')[0];
  
    // Se for feriado, adiciona a classe correspondente
    if (feriados.includes(dataFormatada)) {
      elementoDia.classList.add('holiday');
      elementoDia.setAttribute('title', 'Feriado: Independência do Brasil'); // Tooltip ao passar o mouse
    }
  
    return elementoDia;
  }

