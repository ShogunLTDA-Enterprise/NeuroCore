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