
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