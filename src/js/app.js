let paso = 1;
const PasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSecion(); //Mostrar la sección inicial
    tabs(); //Cambia la sección cuando presionen los tabs
    botonesPaginador();//Agrega o quita los botones de paginación
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend

    idCliente(); // id del cliente
    nombreCliente(); // nombre del cliente
    seleccionarFecha(); // fecha del cliente
    selecionarHora(); // hora del cliente
    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSecion() {

    // Ocultar la sección actual
    const seccionAnterior = document.querySelector('.mostrar');
    if((seccionAnterior != null)){
        seccionAnterior.classList.remove('mostrar');
    }

    //Seleccionar la seccion con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //Quita la clase de la sección anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //Resalta el boton de la sección
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {

    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton =>{
        boton.addEventListener('click', function(e) {
            paso = parseInt ( e.target.dataset.paso);
            mostrarSecion();

            botonesPaginador();
        });
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSecion();

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {

        if(paso <= PasoInicial) return
        paso--;

        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {

        if(paso >= pasoFinal) return
        paso++;

        botonesPaginador();
    })

}

async function consultarAPI() {

        try {
            const url = '/api/servicios';
            const resultado = await fetch(url);
            const servicios = await resultado.json();
            mostrarServicios(servicios);

        } catch (error) {
            console.log(error);
        }
}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const{ servicios } = cita;

    // identificar el servicio seleccionado
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);


    //comprobar si un servicio ya esta seleccionado o quitarlo
    if( servicios.some( agregado => agregado.id === id)){
        //quitar el servicio
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');

    }else{
        //agregar el servicio
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');


    }

    // console.log(cita);

}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;

    
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {

        const dia = new Date(e.target.value).getUTCDay();

        if( [6, 0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
        
    });
}

function selecionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        

        const horaCita = e.target.value;
        const hora = horaCita.split(':')[0];
        if(hora < 10 || hora > 22){
            e.target.value = '';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
        }else{
            cita.hora = e.target.value;

            // console.log(cita);
            
        }
    })

}

function mostrarAlerta(mensaje, tipo, elemento, desparece = true){

    //Si ya existe una alerta previa, no se muestra otra
    const alertas = document.querySelectorAll('.alerta');
    if(alertas.Previa){
        alertas.Previa.remove();
    };

    //Si no existe una alerta previa, se muestra la nueva

    //Crea la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    //Elimina la alerta luego de 3 segundos
    if(desparece){
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el Contenido de Resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    }

    //Formatear el div de resumen
    const {nombre, fecha, hora,servicios} = cita;



    //Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios:';
    resumen.appendChild(headingServicios);

    //Iterear sobre los servicios y mostrando
    servicios.forEach(servicio => {
        const {id, precio, nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    
    //Heading para servicios en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita:';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML =`<span>Nombre:</span> ${nombre}`;


    //Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() +2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);
    // console.log(fechaFormateada);

    const FechaCita = document.createElement('P');
    FechaCita.innerHTML =`<span>Fecha:</span> ${fechaFormateada}`;

    const HoraCita = document.createElement('P');
    HoraCita.innerHTML =`<span>Hora:</span> ${hora} horas`;

    //boton para crear una cita

    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar cita';
    botonReservar.onclick = rervarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(FechaCita);
    resumen.appendChild(HoraCita);

    resumen.appendChild(botonReservar);

    
}

async function rervarCita() {
    
    const {nombre,fecha,hora, servicios, id} = cita;

    const idServicios = servicios.map(servicio => servicio.id);

    const datos = new FormData();
    
    datos.append('fecha',fecha);
    datos.append('hora',hora);
    datos.append('usuarioId',id);
    datos.append('servicios',idServicios);

    // console.log([...datos]);

    try {
        //Peticion a la API
        const url = '/api/citas';

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado.resultado);

        if(resultado.resultado){
            Swal.fire({
                icon: "success",
                title: "Cita creada",
                text: "Tu cita ha sido creada exitosamente",
                button: 'OK'
            }).then(()=>{
                setTimeout(() => {
                    window.location.reload();
               }, 3000);
            })
        // console.log([...datos]);
        }
        
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Hubo un error al crear tu cita",
          });
    }
 


    

}