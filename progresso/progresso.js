var itemBarra = document.querySelectorAll('.icone')

function selectLink(){
    itemBarra.forEach((item) =>
        item.classList.remove('ativo') //remove o botão ativado anteriormente
    )
    this.classList.add('ativo') //ativa o botão atual
}

itemBarra.forEach((item)=>
    item.addEventListener('click', selectLink)
)

//expandir menu
var btnExp = document.querySelector('#btn-exp')
var barLat = document.querySelector('.barra_lateral')

btnExp.addEventListener('click', function(){
    barLat.classList.toggle('expandir')
})