
const baseDatos = document.getElementById('srv-db');
const servicioPago = document.getElementById('srv-pagos');
const autenticacion = document.getElementById('srv-auth');
const correos = document.getElementById('srv-mail'); 
const comprobar = document.getElementById('btn-comprobar');
const resumen = document.getElementById('resumen');


function showDuracion(service, duracion){
    let detalle = service.querySelector('.detalle');
    if (detalle) {
        detalle.textContent = ` Duración de Ejecución: ${duracion.toFixed(2)} ms`;
    }
}

function createStyle(service, i){
        let icono = service.querySelector('.icono')

        if(!i)
        {
            icono.textContent = `✗`;
            service.classList.remove('comprobando')
            service.classList.add('caido')
        }

        else
        {
            icono.textContent = `✓`;
            service.classList.remove('comprobando')
            service.classList.add('operativo')
        }
}

function testedServer(service, ms, probabilidadFallo) {

    return new Promise((resolve, reject) => {

        let start = performance.now();

        setTimeout(() => {
            let fin = performance.now();
            let duracion = fin - start;
            showDuracion(service, duracion);

            if (Math.random() < probabilidadFallo) {
                createStyle(service, false)
                reject(`Error en ${service.id}`);

            } else {
                createStyle(service, true)
                resolve(`Éxito en ${service.id}`);
            }
        }, ms);
    });
}

comprobar.addEventListener('click', () => 
{
     const arrayServices = [baseDatos, servicioPago, autenticacion, correos]
    reiniciar(arrayServices)
    resumen.textContent = `Comprobando...`;
    comprobar.disabled = true;
    let beggining = performance.now()
    

    Promise.allSettled([
        testedServer(baseDatos, 300, 0.10), 
        testedServer(servicioPago, 1200, 0.40), 
        testedServer(autenticacion, 800, 0.20), 
        testedServer(correos, 450, 0.30)
    ])
    .then((resultado) => {

        let operativos = 0;

        for (let i = 0; i < resultado.length; i++) {
            if(resultado[i].status === 'fulfilled') operativos = operativos + 1
        }

            let ending = performance.now() - beggining
            resumen.textContent = `${operativos} de 4 operativos. Comprobado en ${ending.toFixed(2)}`
            comprobar.disabled = false
            console.log(resultado)
        
        });



});


function reiniciar(service){

    for(let i = 0; i < 4; i++)
    {
        let detalle = service[i].querySelector('.detalle')
        detalle.textContent = ''

        let icon = service[i].querySelector('.icono')
        icon.textContent = '🕐'
        
        if(service[i].classList.contains('caido'))
        {
            service[i].classList.remove('caido')
            service[i].classList.add('comprobando')
        }

        else if(service[i].classList.contains('operativo'))
        {
            service[i].classList.remove('operativo')
            service[i].classList.add('comprobando')
        }
    }

    resumen.textContent = 'Sin Comprobar.'
}