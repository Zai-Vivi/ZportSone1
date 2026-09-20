/**
 * ZportSone - Script de la Página de Inicio
 * Gestiona la carga dinámica de datos (simulando API REST) e interacciones responsivas.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la carga de eventos
    cargarEventosDeportivos();
    
    // Configurar desplazamiento suave en los enlaces del menú
    configurarNavegacion();
});

/**
 * Simula una petición de API REST para obtener los eventos destacados.
 * Una vez integrada tu API real, reemplaza la función setTimeout por `fetch('TU_URL_API')`.
 */
function cargarEventosDeportivos() {
    const contenedor = document.getElementById('eventos-container');

    // Datos simulados (Mock Data) como los que entregaría la API
    const eventosSimulados = [
        {
            deporte: "Fútbol",
            liga: "Champions League",
            local: "Real Madrid",
            visitante: "Bayern Múnich",
            resultado: "2 - 1",
            estado: "Finalizado",
            icono: "fa-futbol"
        },
        {
            deporte: "NFL",
            liga: "Semana de Temporada",
            local: "Kansas City Chiefs",
            visitante: "San Francisco 49ers",
            resultado: "24 - 20",
            estado: "Cuarto Cuarto",
            icono: "fa-football"
        },
        {
            deporte: "Fórmula 1",
            liga: "Gran Premio",
            local: "GP de Mónaco",
            visitante: "Carrera Principal",
            resultado: "Pos. 1: Verstappen",
            estado: "Próximo Domingo",
            icono: "fa-flag-checkered"
        }
    ];

    // Simular retraso de red de 1.2 segundos
    setTimeout(() => {
        // Limpiar el loader de carga
        contenedor.innerHTML = '';

        // Generar las tarjetas dinámicamente con los datos obtenidos
        eventosSimulados.forEach(evento => {
            const htmlEvento = `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="evento-card">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-dark text-verde">
                                <i class="fa-solid ${evento.icono} me-1"></i> ${evento.deporte}
                            </span>
                            <small class="text-muted fw-bold">${evento.estado}</small>
                        </div>
                        <h6 class="fw-bold mb-1">${evento.liga}</h6>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fw-semibold">${evento.local} vs ${evento.visitante}</span>
                            <span class="badge bg-success fs-6">${evento.resultado}</span>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += htmlEvento;
        });
    }, 1200);
}

/**
 * Agrega desplazamiento suave (smooth scroll) y cierra el menú responsivo al hacer clic en un enlace.
 */
function configurarNavegacion() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Cierra el menú desplegable en pantallas móviles tras hacer clic
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}
