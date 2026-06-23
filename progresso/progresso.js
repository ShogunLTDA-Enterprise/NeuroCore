document.querySelectorAll('.kanban1').forEach(nada => {
    nada.addEventListener('dragstart', e => {
        e.currentTarget.classList.add('dragging'); 
    })

    nada.addEventListener('dragstart', e => {
        e.currentTarget.classList.remove('dragging');
    })
})

document.querySelectorAll('.coluna-kanban').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        e.currentTarget.classList.add('nada-hover');
    })

    column.addEventListener('dragleave', e => {
        e.currentTarget.classList.remove('nada-hover');
    })

    column.addEventListener('drop', e =>{
        e.currentTarget.classList.remove('nada-hover');

        const dragNada = document.querySelector('.coluna-kanban.dragging');
        e.currentTarget.appendChild(dragNada);
    })
})