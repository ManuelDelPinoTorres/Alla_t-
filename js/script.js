window.onload = function () {
    const CAJAS = 7;
    let premios = [10, 30, 50, 100, 200, 500, 1000, 5000, 18000, 35000, 60000, 90000, 150000, 300000, 600000];
    let cajas3 = document.getElementById("tableroUsuario");
    let cajas2 = document.getElementById("tableroCajas2");
    let cajas1 = document.getElementById("tableroCajas1");
    let tableroPremios = document.querySelector(".premios");
    let cajasJuego;
    let notificaciones = document.getElementsByClassName("notificacion");
    let valoresCajas;
    let estadoCajas;
    let cajaUsuario = 8;
    let puedesAbrir;
    let puedesCambiar;
    let momentoPregunta;
    let turnosConsecutivos;
    let ultimaJugada;

    //iniciamos las cajas 
    const establecerEstadoDecajas = () => {
        for (let i = 0; i < cajasJuego.length; i++) {
            estadoCajas[i] = 1;
        }
    }

    const generarCajas = (cajas, numeroCajas) => {
        for (let index = 0; index < numeroCajas; index++) {
            let nuevoDiv = document.createElement("div");
            nuevoDiv.setAttribute("class", "cajaJuego");
            nuevoDiv.style.setProperty("width", "5rem");
            cajas.appendChild(nuevoDiv);
        }
    }

    const generarAleatorio = () => {
        let valorRandom = premios[Math.floor(Math.random() * premios.length)];
        while (valoresCajas.includes(valorRandom)) {
            valorRandom = premios[Math.floor(Math.random() * premios.length)];
        }

        return valorRandom;
    }
    const darValores = () => {
        for (let i = 0; i < cajasJuego.length; i++) {
            let nuevoElemento = document.createElement("p");
            nuevoElemento.innerText = i + 1;
            cajasJuego[i].setAttribute("id", `${i + 1}`);
            valoresCajas[i] = generarAleatorio();
            cajasJuego[i].appendChild(nuevoElemento);
        }
    }

    const generarTablaPremios = () => {
        let contador = 1;
        for (const premio of premios) {
            let nuevoElemento = document.createElement("div");
            nuevoElemento.setAttribute("id", `${premio}`);
            nuevoElemento.setAttribute("class", `premio div${contador}`);
            let contenidoDiv = document.createTextNode(`${premio}`);
            nuevoElemento.appendChild(contenidoDiv);
            tableroPremios.appendChild(nuevoElemento);
            contador += 1;
        }
    }

    const abrirUltimasCajas = (numero) => {
        //apenchild y abrir caja
        let valorCajaFinal = valoresCajas[numero];
        let valorCajaUsuario = valoresCajas[cajaUsuario - 1];

        let elementoValorFinal = document.createElement("p");
        let elementoValorUsuario = document.createElement("p");
        elementoValorFinal.innerText = `${valorCajaFinal}€`;
        elementoValorUsuario.innerText = `${valorCajaUsuario}€`;

        cajasJuego[numero].appendChild(elementoValorFinal);
        cajasJuego[cajaUsuario - 1].appendChild(elementoValorUsuario);

        estadoCajas[numero] = 0;
        estadoCajas[cajaUsuario - 1] = 0;

        notificaciones[1].innerHTML = `<h3>La caja numero ${numero + 1} contenia ${valorCajaFinal}€</h3>`;
        document.getElementById(`${valoresCajas[numero]}`).style.visibility = "hidden";
        document.getElementById(`${valoresCajas[cajaUsuario - 1]}`).style.backgroundColor = "tomato";
        cajasJuego[numero].style.setProperty("background-image", " url(../img/cajaAbierta.png)");
        cajasJuego[cajaUsuario - 1].style.setProperty("background-image", " url(../img/cajaAbierta.png)");
        mostrarNotificacion(1);
        notificaciones[1].innerHTML = `<h3>Has ganado ${valorCajaUsuario}€</h3>`;
        mostrarNotificacion(1);
        ocultarNotificacion(1)
        mostrarNotificacion(2);
        ultimaJugada = false;
    }

    const abrirCaja = (numero, id) => {
        if (turnosConsecutivos >= 3) momentoPregunta = true;

        if (!momentoPregunta) {
            notificaciones[1].innerHTML = `<h3>Veamos que contiene la caja numero ${id}... </h3>`;
            mostrarNotificacion(1);

            setTimeout(() => {
                let valorCaja = valoresCajas[numero];
                let elementoValor = document.createElement("p");
                elementoValor.innerText = `${valorCaja}€`;
                cajasJuego[numero].appendChild(elementoValor);
                estadoCajas[id - 1] = 0;
                document.getElementById(`${valoresCajas[numero]}`).style.visibility = "hidden";
                cajasJuego[numero].style.setProperty("background-image", " url(../img/cajaAbierta.png)");
                //en funcion del valor podemos decir cosas distintas con un switch
                notificaciones[1].innerHTML = `<h3>La caja ${numero + 1} contiene ${valorCaja}€</h3>`;
                mostrarNotificacion(1);
            }, 2000);

        }

        if (turnosConsecutivos < 3 && !momentoPregunta & !ultimaJugada) {
            setTimeout(() => {
                notificaciones[1].innerHTML = `<h3>Show must go on!!, abramos mas cajas</h3>`;
                mostrarNotificacion(1);
                puedesAbrir = true;
            }, 5000);
            turnosConsecutivos++;
        }
        //a veces muestra de nuevo la notificacion
        if (turnosConsecutivos >= 3 && !momentoPregunta && !ultimaJugada) {
            puedesAbrir = false;
            setTimeout(() => {
                notificaciones[1].innerHTML = `<h3>Ahora puedes elegir entre cambiar o mantener tu caja</h3>`;
                mostrarNotificacion(1);
                setTimeout(() => {
                    ocultarNotificacion(1);
                    mostrarNotificacion(0);
                }, 2000);
            }, 5000);
        }

        if (comprobarJuegoActivo() == 3 && !momentoPregunta) {
            setTimeout(() => {
                notificaciones[1].innerHTML = `<h3>Entras en la ultima jugada, puedes cambiar tu caja o mantenerla</h3>`;
                mostrarNotificacion(1);
                setTimeout(() => {
                    mostrarNotificacion(0);
                    puedesAbrir = true;
                    ultimaJugada = true;
                }, 2000);
            }, 5000);

        }

        console.log(estadoCajas)

    }

    const cambiarCaja = (cajaCambiar) => {
        console.log(cajaUsuario);
        console.log(cajaCambiar);
        let valorCajaCambiar = valoresCajas[cajaCambiar - 1];
        valoresCajas[cajaCambiar - 1] = valoresCajas[cajaUsuario - 1];
        valoresCajas[cajaUsuario - 1] = valorCajaCambiar;

        //cambiamos id
        let idValorCajaCambiar = cajasJuego[cajaCambiar - 1].id;
        let idCajaUsuario = cajasJuego[cajaUsuario - 1].id;
    
        cajasJuego[cajaCambiar - 1].removeAttribute("id");
        cajasJuego[cajaUsuario - 1].removeAttribute("id");

        cajasJuego[cajaCambiar - 1].setAttribute("id", `${idCajaUsuario}`);
        cajasJuego[cajaUsuario - 1].setAttribute("id", `${idValorCajaCambiar}`);
        console.log(cajasJuego)
        let contenidoCajaCambiar = cajasJuego[cajaCambiar - 1].innerHTML;
        cajasJuego[cajaCambiar - 1].innerHTML = cajasJuego[cajaUsuario - 1].innerHTML;
        cajasJuego[cajaUsuario - 1].innerHTML = contenidoCajaCambiar;
        
        console.log(cajaUsuario);

        ocultarNotificacion(1);
        notificaciones[1].innerHTML = `<h3>Caja cambiada, ahora tu caja es la ${cajaCambiar}</h3>`;
        mostrarNotificacion(1);
        setTimeout(() => {
            if (!ultimaJugada) {
                notificaciones[1].innerHTML = `<h3>Despues de este cambio,¿que caja quieres abrir?</h3>`;
            } else {
                notificaciones[1].innerHTML = `<h3>Abre la caja para ver el premio...¿Que sera?</h3>`;
            }
            mostrarNotificacion(1);
            puedesAbrir = true;
        }, 3000);
    }


    const asignarEventosCajas = () => {
        for (let index = 0; index < cajasJuego.length; index++) {
            cajasJuego[index].onclick = function () {

                if (ultimaJugada && estadoCajas[index] > 0 && !momentoPregunta && index != 7 && comprobarJuegoActivo() < 3 && !puedesCambiar) {
                    puedesAbrir = true;
                    abrirUltimasCajas(index);
                } else if (index == 7) {
                    notificaciones[1].innerHTML = `<h3>Tu caja se abrira cuando se abra la ultima caja.</h3>`;
                    mostrarNotificacion(1);
                    puedesAbrir = true;
                } else if (estadoCajas[this.id - 1] > 0 && puedesAbrir && !puedesCambiar && !ultimaJugada) {
                    abrirCaja(index, this.id);
                    puedesAbrir = false;
                } else {
                    puedesAbrir = false;
                }

                if (puedesCambiar && estadoCajas[this.id - 1] > 0) {
                    cambiarCaja(this.id);
                    puedesCambiar = false;
                } else if (puedesCambiar && estadoCajas[this.id - 1] < 1 && !ultimaJugada) {
                    notificaciones[1].innerHTML = `<h3>Solo puedes cambiar tu caja por cajas cerradas</h3>`;
                    mostrarNotificacion(1);
                    puedesCambiar = true;
                }
            }
        }

    }


    const mostrarNotificacion = (numeroNotificacion) => {
        // document.getElementById("contador").innerText = `Llevas ${turnosConsecutivos} turnos consecutivos`;
        // document.getElementById("contador").style.color="black";
        notificaciones[numeroNotificacion].style.display = "flex";
    }

    const ocultarNotificacion = (numeroNotificacion) => {
        notificaciones[numeroNotificacion].style.display = "none";

    }

    let botones = document.getElementsByTagName("button");

    botones[0].onclick = function () {
        turnosConsecutivos = 0;
        ocultarNotificacion(0);
        notificaciones[1].innerHTML = `<h3>¿Que caja quieres?</h3>`;
        mostrarNotificacion(1);
        puedesCambiar = true;
        momentoPregunta = false;
    }

    botones[1].onclick = function () {
        turnosConsecutivos = 0;
        ocultarNotificacion(0);
        notificaciones[1].innerHTML = `<h3>Nos quedamos con la caja, le ha cojido cariño que le vamos a hacer</h3>`;
        mostrarNotificacion(1);
        setTimeout(() => {
            notificaciones[1].innerHTML = `<h3>Ahora vamos al lio, a abrir cajas!!</h3>`;
            mostrarNotificacion(1);
        }, 3000);

        puedesAbrir = true;
        momentoPregunta = false;
    }

    const resetearCajas = (cajas) => {
        while (cajas.firstChild) {
            cajas.removeChild(cajas.firstChild);
        }
    }

    botones[2].onclick = function () {
        resetearCajas(cajas1);
        resetearCajas(cajas2);
        resetearCajas(cajas3);
        comenzarJuego();
    }

    const comenzarJuego = () => {
        valoresCajas = [];
        estadoCajas = [];
        ultimaJugada = false;
        puedesAbrir = false;
        puedesCambiar = false;
        momentoPregunta = false;
        turnosConsecutivos = 0;
        ultimaJugada = false;
        generarTablaPremios();
        generarCajas(cajas1, CAJAS);
        generarCajas(cajas2, CAJAS);
        generarCajas(cajas3, 1);
        cajasJuego = document.getElementsByClassName("cajaJuego");
        darValores();
        establecerEstadoDecajas();
        asignarEventosCajas();
        console.log(estadoCajas);
        notificacionInicio();
        setTimeout(() => {
            ocultarNotificacion(1);
            mostrarNotificacion(0);
        }, 6000);
        console.log(comprobarJuegoActivo())
    }

    const comprobarJuegoActivo = () => {
        return estadoCajas.filter((numero) => numero == 1).length;
    }

    const notificacionInicio = () => {
        notificaciones[1].innerHTML = `<h3>Bienvenid@...</h3>`;
        mostrarNotificacion(1);
        setTimeout(() => {
            notificaciones[1].innerHTML = `<h3>Antes de comenzar, ¿quieres cambiar tu caja?</h3>`;
            mostrarNotificacion(1);
        }, 3000);
    }

    comenzarJuego();

}