
//Cria os números do mês
let el = document.querySelector('.num_dias');
for (i = 1; i < 31; i++) {
    el.innerHTML += '<span>'+ i +'</span>'; 
}

const wraper = document.querySelector('.wraper')

wraper.addEventListener('click', () => {
    document.body.style.backgroundColor = 'black'
})

let el = document.querySelector('.wraper');
for (i = 1; i < 31; i++) {
    el.innerHTML += '<span>'+ i +'</span>'; 
}
