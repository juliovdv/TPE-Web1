"use strict"
document.addEventListener("DOMContentLoaded", iniciarPagina);

function iniciarPagina() {
    let btnmenu = document.getElementById("botonmenu");
    btnmenu.addEventListener("click", desplegarNavegador);
    function desplegarNavegador() {
        let menu = document.getElementById("navegador");
        menu.classList.toggle("navoculto");
    }
}