/**
 * SportZone Academy - Script de la Academia Deportiva
 * Gestiona el filtrado de secciones deportivas, búsqueda en glosario en tiempo real e interacciones.
 */

document.addEventListener('DOMContentLoaded', () => {
    inicializarFiltroDeportes();
    inicializarBuscadorGlosario();
});

/**
 * Permite filtrar las tarjetas de deportes en la página mediante las pestañas principales
 */
function inicializarFiltroDeportes() {
    const botonesFiltro = document.querySelectorAll('#selector-deportes .btn-deporte-tab');
    const bloquesDeporte = document.querySelectorAll('.bloque-deporte');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // 1. Gestionar estados visuales de los botones
            botonesFiltro.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            const categoria = boton.getAttribute('data-target');

            // 2. Mostrar u ocultar las secciones correspondientes
            bloquesDeporte.forEach(bloque => {
                if (categoria === 'todos') {
                    bloque.style.display = 'block';
                } else {
                    if (bloque.id === `deporte-${categoria}`) {
                        bloque.style.display = 'block';
                    } else {
                        bloque.style.display = 'none';
                    }
                }
            });
        });
    });
}

/**
 * Filtra las tarjetas del glosario "¿Qué significa?" dinámicamente conforme el usuario escribe
 */
function inicializarBuscadorGlosario() {
    const inputBuscador = document.getElementById('buscador-glosario');
    const tarjetasGlosario = document.querySelectorAll('#contenedor-glosario .item-glosario');

    if (!inputBuscador) return;

    inputBuscador.addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase().trim();

        tarjetasGlosario.forEach(tarjeta => {
            const contenidoTexto = tarjeta.textContent.toLowerCase();

            // Si el texto de la tarjeta incluye el término buscado, se muestra; si no, se oculta
            if (contenidoTexto.includes(textoBusqueda)) {
                tarjeta.style.display = 'block';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    });
}
