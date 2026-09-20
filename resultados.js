/**
 * SportZone Academy - Script de Resultados y Estadísticas
 * Maneja la carga asíncrona, renderizado de DOM y estados de interfaz (Loader, Error, Vacio).
 */

// Estado global de la aplicación
const AppState = {
    deporteSeleccionado: 'futbol',
    // Cambiar a 'true' cuando tengas la URL de tu API REST configurada
    usarApiReal: false,
    endpointApi: 'https://api.ejemplo-deportes.com/v1/'
};

// Base de datos estática de ejemplo para simular respuestas API
const MOCK_DATA = {
    futbol: {
        resultados: [
            { id: 1, local: "Real Madrid", visitante: "Barcelona", marcador: "3 - 1", fecha: "18 Sep, 2026", hora: "14:00", estado: "Finalizado" },
            { id: 2, local: "Manchester City", visitante: "Arsenal", marcador: "2 - 2", fecha: "18 Sep, 2026", hora: "12:30", estado: "Finalizado" },
            { id: 3, local: "PSG", visitante: "Marseille", marcador: "1 - 0", fecha: "17 Sep, 2026", hora: "15:00", estado: "Finalizado" }
        ],
        proximos: [
            { id: 101, local: "Bayern Múnich", visitante: "Dortmund", fecha: "21 Sep, 2026", hora: "11:30", estado: "Próximo" },
            { id: 102, local: "Juventus", visitante: "AC Milan", fecha: "22 Sep, 2026", hora: "13:45", estado: "Próximo" }
        ],
        clasificacion: [
            { pos: 1, equipo: "Real Madrid", pj: 5, pg: 4, pts: 13 },
            { pos: 2, equipo: "Barcelona", pj: 5, pg: 3, pts: 10 },
            { pos: 3, equipo: "Atlético Madrid", pj: 5, pg: 3, pts: 9 },
            { pos: 4, equipo: "Sevilla", pj: 5, pg: 2, pts: 7 }
        ]
    },
    nfl: {
        resultados: [
            { id: 4, local: "KC Chiefs", visitante: "SF 49ers", marcador: "27 - 24", fecha: "17 Sep, 2026", hora: "19:15", estado: "Finalizado" },
            { id: 5, local: "Dallas Cowboys", visitante: "NY Giants", marcador: "31 - 14", fecha: "17 Sep, 2026", hora: "15:25", estado: "Finalizado" }
        ],
        proximos: [
            { id: 103, local: "Philadelphia Eagles", visitante: "Green Bay Packers", fecha: "24 Sep, 2026", hora: "19:20", estado: "Próximo" },
            { id: 104, local: "Buffalo Bills", visitante: "Miami Dolphins", fecha: "25 Sep, 2026", hora: "12:00", estado: "Próximo" }
        ],
        clasificacion: [
            { pos: 1, equipo: "KC Chiefs", pj: 3, pg: 3, pts: "1.000" },
            { pos: 2, equipo: "Buffalo Bills", pj: 3, pg: 2, pts: ".667" },
            { pos: 3, equipo: "Philadelphia Eagles", pj: 3, pg: 2, pts: ".667" },
            { pos: 4, equipo: "SF 49ers", pj: 3, pg: 1, pts: ".333" }
        ]
    },
    f1: {
        resultados: [
            { id: 6, local: "GP de Italia (Monza)", visitante: "Carrera", marcador: "1° Verstappen | 2° Leclerc", fecha: "10 Sep, 2026", hora: "07:00", estado: "Finalizado" },
            { id: 7, local: "GP de Holanda", visitante: "Carrera", marcador: "1° Norris | 2° Verstappen", fecha: "27 Ago, 2026", hora: "07:00", estado: "Finalizado" }
        ],
        proximos: [
            { id: 105, local: "GP de Singapur", visitante: "Circuito Marina Bay", fecha: "27 Sep, 2026", hora: "06:00", estado: "Próximo" },
            { id: 106, local: "GP de Japón", visitante: "Circuito Suzuka", fecha: "11 Oct, 2026", hora: "00:00", estado: "Próximo" }
        ],
        clasificacion: [
            { pos: 1, equipo: "Max Verstappen (Red Bull)", pj: 16, pg: 8, pts: 301 },
            { pos: 2, equipo: "Lando Norris (McLaren)", pj: 16, pg: 4, pts: 241 },
            { pos: 3, equipo: "Charles Leclerc (Ferrari)", pj: 16, pg: 2, pts: 217 },
            { pos: 4, equipo: "Oscar Piastri (McLaren)", pj: 16, pg: 2, pts: 197 }
        ]
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    configurarEventosUI();
    obtenerYRenderizarDatos(AppState.deporteSeleccionado);
});

/**
 * Agrega los listeners a los botones de filtro y control
 */
function configurarEventosUI() {
    // Escuchar clicks en los botones de selección de deporte
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Cambiar clase active
            botonesFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Actualizar estado y recargar datos
            const deporte = btn.getAttribute('data-deporte');
            AppState.deporteSeleccionado = deporte;
            obtenerYRenderizarDatos(deporte);
        });
    });

    // Botón de actualizar/refrescar
    document.getElementById('btn-refrescar').addEventListener('click', () => {
        obtenerYRenderizarDatos(AppState.deporteSeleccionado);
    });

    // Botón de reintentar dentro de la vista de error
    document.getElementById('btn-reintentar').addEventListener('click', () => {
        obtenerYRenderizarDatos(AppState.deporteSeleccionado);
    });
}

/**
 * Función principal para consumir la API o datos locales utilizando Async/Await
 */
async function obtenerYRenderizarDatos(deporte) {
    mostrarEstado('cargando');

    try {
        let data;

        if (AppState.usarApiReal) {
            // Ejemplo de llamada a API REST real
            const response = await fetch(`${AppState.endpointApi}${deporte}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - No se pudo obtener la información.`);
            }
            data = await response.json();
        } else {
            // Simular respuesta con retardo asíncrono
            data = await simularPeticionAPI(deporte);
        }

        // Validar si la respuesta trae información
        if (!data || (!data.resultados.length && !data.proximos.length)) {
            mostrarEstado('vacio');
            return;
        }

        // Si todo está correcto, renderizar en el DOM
        renderizarInformacion(data, deporte);
        mostrarEstado('contenido');

    } catch (error) {
        console.error('Error al obtener datos deportivos:', error);
        document.getElementById('error-mensaje-texto').textContent = error.message || "Error al conectar con la API.";
        mostrarEstado('error');
    }
}

/**
 * Simula el comportamiento de una API REST con delay de red
 */
function simularPeticionAPI(deporte) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Descomentar la siguiente línea para probar la pantalla de error deliberadamente:
            // return reject(new Error("Fallo de conexión simulado con el servidor."));

            if (MOCK_DATA[deporte]) {
                resolve(MOCK_DATA[deporte]);
            } else {
                reject(new Error("Deporte no encontrado en la base de datos."));
            }
        }, 800); // 800ms de retraso
    });
}

/**
 * Controla qué interfaz o estado se muestra al usuario (Cargando, Error, Vacío o Contenido)
 */
function mostrarEstado(estado) {
    const elCargando = document.getElementById('state-cargando');
    const elError = document.getElementById('state-error');
    const elVacio = document.getElementById('state-vacio');
    const elContenido = document.getElementById('contenido-deportivo');

    // Ocultar todos por defecto
    elCargando.classList.add('d-none');
    elError.classList.add('d-none');
    elVacio.classList.add('d-none');
    elContenido.classList.add('d-none');

    // Mostrar el correspondiente
    switch (estado) {
        case 'cargando':
            elCargando.classList.remove('d-none');
            break;
        case 'error':
            elError.classList.remove('d-none');
            break;
        case 'vacio':
            elVacio.classList.remove('d-none');
            break;
        case 'contenido':
            elContenido.classList.remove('d-none');
            break;
    }
}

/**
 * Manipulación directa del DOM para inyectar los datos en la vista
 */
function renderizarInformacion(data, deporte) {
    // Actualizar etiqueta del deporte seleccionado
    const labelDeporte = document.getElementById('deporte-actual-label');
    labelDeporte.textContent = deporte.toUpperCase();

    // 1. Renderizar Resultados
    const contenedorResultados = document.getElementById('lista-resultados');
    contenedorResultados.innerHTML = '';

    if (data.resultados && data.resultados.length > 0) {
        data.resultados.forEach(res => {
            contenedorResultados.innerHTML += `
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-3 mb-2 bg-light rounded border-start border-4 border-success">
                    <div class="mb-2 mb-sm-0">
                        <h6 class="fw-bold mb-1">${res.local} vs ${res.visitante}</h6>
                        <small class="text-muted"><i class="fa-regular fa-clock me-1"></i>${res.fecha} - ${res.hora} hs</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="fw-bold text-dark fs-5">${res.marcador}</span>
                        <span class="badge badge-estado badge-finalizado">${res.estado}</span>
                    </div>
                </div>
            `;
        });
    } else {
        contenedorResultados.innerHTML = `<p class="text-muted p-2">Sin resultados recientes.</p>`;
    }

    // 2. Renderizar Próximos Eventos
    const contenedorProximos = document.getElementById('lista-proximos');
    contenedorProximos.innerHTML = '';

    if (data.proximos && data.proximos.length > 0) {
        data.proximos.forEach(prox => {
            contenedorProximos.innerHTML += `
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-3 mb-2 bg-light rounded">
                    <div class="mb-2 mb-sm-0">
                        <h6 class="fw-bold mb-1">${prox.local} vs ${prox.visitante}</h6>
                        <small class="text-muted"><i class="fa-regular fa-calendar me-1"></i>${prox.fecha} - ${prox.hora} hs</small>
                    </div>
                    <div>
                        <span class="badge badge-estado badge-proximo">${prox.estado}</span>
                    </div>
                </div>
            `;
        });
    } else {
        contenedorProximos.innerHTML = `<p class="text-muted p-2">Sin eventos programados.</p>`;
    }

    // 3. Renderizar Tabla de Clasificación / Posiciones
    const contenedorClasificacion = document.getElementById('contenedor-clasificacion');
    
    if (data.clasificacion && data.clasificacion.length > 0) {
        let tablaHTML = `
            <table class="table table-hover table-custom align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">${deporte === 'f1' ? 'Piloto' : 'Equipo'}</th>
                        <th scope="col" class="text-center">${deporte === 'f1' ? 'GP' : 'PJ'}</th>
                        <th scope="col" class="text-center">${deporte === 'f1' ? 'Vic' : 'PG'}</th>
                        <th scope="col" class="text-center">Pts</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.clasificacion.forEach(item => {
            tablaHTML += `
                <tr>
                    <td class="fw-bold">${item.pos}</td>
                    <td>${item.equipo}</td>
                    <td class="text-center">${item.pj}</td>
                    <td class="text-center">${item.pg}</td>
                    <td class="text-center fw-bold text-success">${item.pts}</td>
                </tr>
            `;
        });

        tablaHTML += `</tbody></table>`;
        contenedorClasificacion.innerHTML = tablaHTML;
    } else {
        contenedorClasificacion.innerHTML = `<p class="text-muted p-3 mb-0">Sin tabla disponible.</p>`;
    }
}
