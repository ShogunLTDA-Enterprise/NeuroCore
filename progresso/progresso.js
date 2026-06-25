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