# Estado-de-Servicios
# Panel de estado del sistema

Un panel que comprueba cuatro servicios en paralelo y muestra que el tiempo total es el del más lento, no la suma
## Demo
Enlace a GitHub Pages + una captura.

## Qué hace
Comprueba cuatro servicios simulados en paralelo y muestra el estado
de cada uno, el tiempo que tardó y un resumen final.

Los cuatro servicios, con sus duraciones y probabilidades de fallo.

## Decisiones técnicas

## Contador --> Operativos
    Debido a que la variable operativos se puede calcular a partir de los datos, no se se necesitó una variable global

### Por qué `allSettled` y no `all`

    Se utilizó allSettled y no all porque el objetivo de la página es que el usuario pueda ingresar a los servicios operativos, no importan si algunos fallan y otros no. Usar all no es la mejor decisión ya que no permitiría cargar ningún servicio si uno solo falla, lo cual no valdría la pena si lo que queremos es que el usuario pueda usar los servicios, sin importar si unos fallaron y otros no. 


### Concurrencia: el total es el del más lento
← El dato concreto. 300 + 1200 + 800 + 450 = 2750 ms en secuencia.
   Medido en paralelo: ~1200 ms. Se demuestra que al llamar las cuatro promesas al mismo tiempo, se permite que las 4 promesas se ejecuten en paralelo en la webAPI, haciendo que el método allSettled solo tarde lo de la más larga, en este caso alrededor de 1200ms, para ojos del usuario es instantáneo.

## Los cuatro métodos de Promise

| Método               | Qué hace                                                                                                                                                                                                                                                           | Caso de negocio                                                                                                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Promise.all`        | toma un array de promesas y devuelve un solo resultado en este caso el resultado(value) es el resultado de todas las promesas, por ejemplo [1,2,3,4] si hay un error la reason va a hacer el error, solo eso, más nada.                                            | por ejemplo en un banco al hacer una transferencia en la cual necesitas consultar varios servicios al hacer una transacción, si uno de estos falla, no puedes hacer la transacción por ejemplo servicio antifraude, servicio de cuentas y servicio de destinatario |
| `Promise.allSettled` | no importa si alguna falla, el output es un objeto literal con dos valores status y value (si fue resolved) o reason (si fue rejected). por ejemplo [status: fulfilled, value: resolved!]                                                                          | por ejemplo en Amazon donde si pides ver tus pedidos antiguos y no se cargó uno correctamente muestra los que sí se cargaron bien y ese no. No vale la pena romper la página                                                                                       |
| `Promise.race`       | aquí lo que hace es que devuelve la primera que se ejecutó más rápido, no importa si fue resolved o rejected, no cancela la más lenta, solo te dice quién llegó primero; el timeout se construye haciendo competir la operación contra una espera que lanza error. | por ejemplo en WhatsApp cuando vas a descargar una imagen en el chat pero alcanza el limite de tiempo permitido y no se descargó la imagen.                                                                                                                        |
| `Promise.any`        | aquí lo que hace es que devuelve la primera respuesta correcta (resolved) que fue más rápida.                                                                                                                                                                      | por ejemplo en Netflix para ver una pelicula la misma app web tiene esa pelicula en tres servidores distintos, la primera a la que se llame y se ejecute correctamente, gana.                                                                                      
   

## Limitaciones conocidas
   Las promesas en marcha no se pueden cancelar por lo cual si se decidiera cancelar un setTimeout que tenía una promesa y nunca se resuelve o se rejecta con resolve() o reject() su estado quedaría en 'pending' para siempre.

    El testedServer no hace solo una cosa, también llama a funciones que tocan el DOM.
