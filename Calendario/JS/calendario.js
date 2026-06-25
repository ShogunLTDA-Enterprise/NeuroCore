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
