"use strict"

document.addEventListener("DOMContentLoaded", iniciarPagina);


function iniciarPagina() {
    let captcha = 0;
    let tabladatos = document.getElementById("tabladatos");
    let btncaptcha = document.getElementById("actualizacaptcha");
    btncaptcha.addEventListener("click", function () { captcha = actualizarCaptcha() });
    let btnenviar = document.getElementById("enviar");
    btnenviar.addEventListener("click", comprobarFormulario);
    let btnfiltrar = document.getElementById("filtrar");
    btnfiltrar.addEventListener("click", filtrarResultado);
    let btnquitarfiltro = document.getElementById("quitarfiltro");
    btnquitarfiltro.addEventListener("click", quitarFiltro);
    let btnagrtres = document.getElementById("agregartres");
    btnagrtres.addEventListener("click", agregarTres);
    let btnvaciartabla = document.getElementById("vaciartabla");
    btnvaciartabla.addEventListener("click", vaciarTabla);
    let errorformulario = document.getElementById("errorformulario");
    let errorcaptcha = document.getElementById("errorcaptcha");
    captcha = actualizarCaptcha();
    let btnfiltro = document.getElementById("abrirfiltro");
    btnfiltro.addEventListener("click", function (e) { document.getElementById("contenedorfiltro").classList.toggle("oculto") })
    let baseURL = 'https://web-unicen.herokuapp.com/api/groups/';
    let groupID = 'grupo5';
    let collectionID = 'resena';
    let elementos = [];
    obtenerDatos();

    let timer = setInterval(obtenerDatos, 5000);



    function actualizarCaptcha() {
        //asigna numeros al azar a los 4 digitos de captcha
        let d1 = generaAlazar();
        let d2 = generaAlazar();
        let d3 = generaAlazar();
        let d4 = generaAlazar();
        document.getElementById("dado1").src = "img/dado" + d1 + ".png";
        document.getElementById("dado2").src = "img/dado" + d2 + ".png";
        document.getElementById("dado3").src = "img/dado" + d3 + ".png";
        document.getElementById("dado4").src = "img/dado" + d4 + ".png";
        let sumacaptcha = (d1 * 1000) + (d2 * 100) + (d3 * 10) + (d4);
        errorcaptcha.classList.add("oculto");
        errorformulario.classList.add("oculto");
        return sumacaptcha;
    }

    function generaAlazar() {
        //devuelve un numero al azar de 1 a 6
        return Math.floor((Math.random() * 6) + 1);
    }

    function validarCaptcha() {
        // comprueba que el numero ingresado sea igual al captcha, si es asi, carga los datos del formulario en el arreglo

        let valoringresado = parseInt(document.getElementById("ingresado").value);
        if (captcha === valoringresado) {
            errorcaptcha.classList.add("oculto");
            guardarDatos();
        } else {
            errorcaptcha.classList.remove("oculto");
        }
    }

    function comprobarFormulario() {
        // comprueba que no haya campos vacios en el formulario si es asi llama a validarCaptcha
        let nombre = document.getElementById("nombre");
        let titulo = document.getElementById("titulo");
        let valoracion = document.getElementById("valoracion");
        let comentario = document.getElementById("comentario");
        if ((nombre.value === "") || (titulo.value === "") || (valoracion.value === "") || (comentario.value === "")) {
            errorformulario.classList.remove("oculto");
            errorcaptcha.classList.add("oculto");
        } else {
            errorformulario.classList.add("oculto");
            validarCaptcha();
        }
    }

    function guardarDatos() {
        // guarda en un objeto los datos obtenidos del formulario


        let datos = {
            "thing": {
                "Nombre": nombre.value,
                "Titulo": titulo.value,
                "Valoracion": valoracion.value,
                "Comentario": comentario.value,
            }
        }
        agregarServidor(datos);

    }

    function agregarServidor(datos)
    // agrega un objeto al servidor
    {
        fetch(baseURL + groupID + "/" + collectionID, {
            "method": "POST",
            "mode": 'cors',
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(datos)
        }).then(function (r) {
            if (!r.ok) {
                console.log("error")
            }
            return r.json()
        })
            .then(function (json) {
                motrarFila(json.information);
            })
            .catch(function (e) {
                console.log(e)
            })
    }



    function motrarFila(datos) {
        // carga en la tabla html una fila
        if (datos.thing.Valoracion === "5 estrellas") {
            tabladatos.innerHTML += "<tr class='resaltado'><td>" + datos.thing.Nombre + "</td><td>" + datos.thing.Titulo + "</td><td>" + datos.thing.Valoracion + "</td><td>" + datos.thing.Comentario + "</td> <td><button id='" + datos._id + "' class='btn-eliminar'>X</button></td></td> <td><button id='" + datos._id + "' class='btn-editar'>Editar</button></td></tr>";
        } else {
            tabladatos.innerHTML += "<tr><td>" + datos.thing.Nombre + "</td><td>" + datos.thing.Titulo + "</td><td>" + datos.thing.Valoracion + "</td><td>" + datos.thing.Comentario + "</td> <td><button id='" + datos._id + "' class='btn-eliminar'>X</button></td></td> <td><button id='" + datos._id + "' class='btn-editar'>Editar</button></td></tr>";
        }
        asignarBtns();
    }

    function asignarBtns() {

        let btnseliminar = document.querySelectorAll(".btn-eliminar");
        for (let i = 0; i < btnseliminar.length; i++) { //Agrega eventos a todos los botones eliminar
            btnseliminar[i].addEventListener("click", eliminarFila);
        }
        let btnseditar = document.querySelectorAll(".btn-editar");
        for (let i = 0; i < btnseditar.length; i++) { //Agrega eventos a todos los botones editar
            btnseditar[i].addEventListener("click", editarFila);
        }
    }

    function editarFila() {
        let btnmodificar = document.getElementById("modificar");
        let nombre = document.getElementById("nombre");
        let titulo = document.getElementById("titulo");
        let valoracion = document.getElementById("valoracion");
        let comentario = document.getElementById("comentario");
        let id = this.getAttribute("id");
        let todosloscampos = this.parentElement.parentElement.children;
        let botones = document.querySelectorAll("button");
        let btncancelar = document.getElementById("cancelar");
        btncancelar.addEventListener("click", cancelarModificacion);
        for (let i = 1; i < botones.length; i++) {
            botones[i].classList.add("oculto");
        }
        btnmodificar.classList.remove("oculto");
        btncancelar.classList.remove("oculto");

        clearInterval(timer);
        nombre.value = todosloscampos[0].innerText;
        titulo.value = todosloscampos[1].innerText;
        valoracion.value = todosloscampos[2].innerText;
        comentario.value = todosloscampos[3].innerText;
        btnmodificar.addEventListener("click", editarServidor);
        function editarServidor() {
            let datos = {
                "thing": {
                    "Nombre": nombre.value,
                    "Titulo": titulo.value,
                    "Valoracion": valoracion.value,
                    "Comentario": comentario.value,
                }
            }
            fetch(baseURL + groupID + "/" + collectionID + "/" + id, {
                "method": "PUT",
                "mode": 'cors',
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(datos)
            }).then(function (r) {
                if (!r.ok) {
                    console.log("error")
                }
                return r.json()
            })
                .then(function (json) {
                    for (let i = 1; i < botones.length; i++) {
                        botones[i].classList.remove("oculto");
                    }
                    btnmodificar.classList.add("oculto");
                    btncancelar.classList.add("oculto");
                    btnquitarfiltro.classList.add("oculto");

                    obtenerDatos();
                    timer = setInterval(obtenerDatos, 5000);
                    btnmodificar.removeEventListener("click", editarServidor);
                    btncancelar.removeEventListener("click", cancelarModificacion);
                })
                .catch(function (e) {
                    console.log(e)
                })
        }
        function cancelarModificacion() {

            for (let i = 1; i < botones.length; i++) {
                botones[i].classList.remove("oculto");
            }
            btnmodificar.classList.add("oculto");
            btncancelar.classList.add("oculto");
            btnquitarfiltro.classList.add("oculto");

            obtenerDatos();
            timer = setInterval(obtenerDatos, 5000);
            btnmodificar.removeEventListener("click", editarServidor);
            btncancelar.removeEventListener("click", cancelarModificacion);

        }
    }

    function eliminarFila() {
        borrarElemento(this.getAttribute("id"));
    }

    function borrarElemento(id) {
        fetch(baseURL + groupID + "/" + collectionID + "/" + id, {
            "method": "DELETE",
            "mode": 'cors',
            "headers": { "Content-Type": "application/json" },
        }).then(function (r) {
            if (!r.ok) {
                console.log("error")
            }
            return r.json()
        })
            .then(function (json) {
                obtenerDatos();
            })
            .catch(function (e) {
                console.log(e)
            })


    }

    function obtenerDatos() {
        fetch(baseURL + groupID + "/" + collectionID, {
            "method": "GET",
            "mode": 'cors',
            "headers": { "Content-Type": "application/json" },
        }).then(function (r) {
            if (!r.ok) {
                console.log("error")
            }
            return r.json()
        })
            .then(function (json) {
                elementos = json.resena;
                refrescarTabla();
            })
            .catch(function (e) {
                console.log(e)
            })
    }

    function filtrarResultado() {
        fetch(baseURL + groupID + "/" + collectionID, {
            "method": "GET",
            "mode": 'cors',
            "headers": { "Content-Type": "application/json" },
        }).then(function (r) {
            if (!r.ok) {
                console.log("error")
            }
            return r.json()
        })
            .then(function (json) {
                elementos = json.resena;
                clearInterval(timer);
                let filtropor = document.getElementById("filtrarpor").value;
                let filtro = document.getElementById("filtro").value;
                tabladatos.innerHTML = "";
                btnquitarfiltro.classList.remove("oculto");
                switch (filtropor) {
                    case "Nombre":
                        {
                            for (let i = 0; i < elementos.length; i++) {
                                if (elementos[i].thing.Nombre === filtro) {
                                    motrarFila(elementos[i]);
                                }
                            }
                            break;
                        }
                    case "Titulo":
                        {
                            for (let i = 0; i < elementos.length; i++) {
                                if (elementos[i].thing.Titulo === filtro) {
                                    motrarFila(elementos[i]);
                                }
                            }
                            break;
                        }
                    case "Valoracion":
                        {
                            for (let i = 0; i < elementos.length; i++) {
                                if (elementos[i].thing.Valoracion === filtro) {
                                    motrarFila(elementos[i]);
                                }
                            }
                            break;
                        }
                    case "Comentario":
                        {
                            for (let i = 0; i < elementos.length; i++) {
                                if (elementos[i].thing.Comentario === filtro) {
                                    motrarFila(elementos[i]);
                                }
                            }
                        }
                }
            })
            .catch(function (e) {
                console.log(e)
            })
    }

    function refrescarTabla() {
        tabladatos.innerHTML = "";
        for (let data of elementos) {
            motrarFila(data);
        };

    }


    function vaciarTabla() {
        for (let data of elementos) {
            borrarElemento(data._id);
        }
        tabladatos.innerHTML = "";
    }


    function quitarFiltro() {
        btnquitarfiltro.classList.add("oculto");
        timer = setInterval(obtenerDatos, 5000);
        tabladatos.innerHTML = "";

    }


    function agregarTres() {
        let arraleatoriosnom = ["Juana", "Pedro", "Romina", "Yamila", "Juan", "Roberta"];
        let arraleatoriostit = ["El tunel", "La invension de Morel", "Ficciones", "God bye Lenin!", "Balada triste de trompeta", "Delicatessen"];
        let arraleatorioscom = ["Buena", "Regular", "Extraña", "Esperaba mas", "Sin comentarios. Una locura.", "Podria ser mejor"]
        for (let i = 1; i <= 3; i++) {
            let datosaleatorios = {
                "thing": {
                    Nombre: arraleatoriosnom[generaAlazar() - 1],
                    Titulo: arraleatoriostit[generaAlazar() - 1],
                    Valoracion: [generaAlazar() - 1] + " estrellas",
                    Comentario: arraleatorioscom[generaAlazar() - 1],
                }
            }
            agregarServidor(datosaleatorios);
        }
    }
}