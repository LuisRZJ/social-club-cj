// js/raiz/index.js

// Actualizar año actual en el pie de página
document.addEventListener('DOMContentLoaded', function () {
    // Array de imágenes disponibles para el fondo
    const imagenesFondo = [
        '/imagenes/IMG-IA/Vistas-edificio1.avif',
        '/imagenes/IMG-IA/Vistas-edificio2.avif',
        '/imagenes/IMG-IA/Vistas-edificio3.avif',
        '/imagenes/IMG-IA/Vistas-edificio4.avif',
        '/imagenes/Fondos-BS/Fondo-basico1.avif',
        '/imagenes/Fondos-BS/Fondo-basico2.avif',
        '/imagenes/Fondos-BS/Fondo-basico3.avif',
        '/imagenes/Fondos-BS/Fondo-basico4.avif',
        '/imagenes/Fondos-BS/Fondo-basico5.avif',
        '/imagenes/Fondos-BS/Fondo-basico6.avif',
        '/imagenes/Fondos-BS/Fondo-basico7.avif',
        '/imagenes/Fondos-BS/Fondo-basico8.avif',
        '/imagenes/Ambiente/Ospicio-cabañas-GDL.avif',
        '/imagenes/Ambiente/Paisaje-vacio.avif',
        '/imagenes/Ambiente/62637-Guadalajara.avif',
        '/icons/Bandera-jal.avif'
    ];

    // Función para seleccionar imagen inicial
    function seleccionarImagenInicial() {
        const imagenFondo = document.querySelector('.bienvenida-gdl-fondo');
        // Seleccionar una imagen aleatoria del array
        const imagenInicial = imagenesFondo[Math.floor(Math.random() * imagenesFondo.length)];
        if (imagenFondo) imagenFondo.src = imagenInicial;
        return imagenInicial; // Retornamos la imagen inicial para referencia
    }

    // Función para cambiar la imagen de fondo
    function cambiarImagenFondo(imagenActual) {
        const imagenFondo = document.querySelector('.bienvenida-gdl-fondo');
        if (!imagenFondo) return imagenActual;

        // Filtrar la imagen actual para no repetirla
        const imagenesDisponibles = imagenesFondo.filter(img => img !== imagenActual);

        // Seleccionar una imagen aleatoria de las disponibles
        const nuevaImagen = imagenesDisponibles[Math.floor(Math.random() * imagenesDisponibles.length)];

        // Aplicar transición suave
        imagenFondo.style.opacity = '0';
        setTimeout(() => {
            imagenFondo.src = nuevaImagen;
            imagenFondo.style.opacity = '1';
        }, 500);

        return nuevaImagen; // Retornamos la nueva imagen para la siguiente iteración
    }

    // Función para actualizar el saludo y la hora de Guadalajara
    function actualizarSaludoYHora() {
        // Obtener la hora actual en Guadalajara
        const opciones = {
            timeZone: 'America/Mexico_City',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        const horaGDL = new Date().toLocaleTimeString('es-MX', opciones);
        const horaActual = new Date().toLocaleTimeString('es-MX', {
            timeZone: 'America/Mexico_City',
            hour: 'numeric',
            hour12: false
        });

        // Determinar el saludo según la hora
        let saludo;
        if (horaActual >= 5 && horaActual < 12) {
            saludo = '¡Hola! Buenos días, ¿Qué tal?';
        } else if (horaActual >= 12 && horaActual < 19) {
            saludo = '¡Hola! Buenas tardes, ¿Qué tal?';
        } else {
            saludo = '¡Hola! Buenas noches, ¿Qué tal?';
        }

        const titulo = document.querySelector('.bienvenida-gdl-titulo');
        const info = document.querySelector('.bienvenida-gdl-info');

        // Actualizar los elementos en el DOM
        if (titulo) titulo.textContent = saludo;
        if (info) info.textContent = `Guadalajara - ${horaGDL}`;

        // Calcular el tiempo hasta el siguiente minuto
        const ahora = new Date();
        const segundosHastaSiguienteMinuto = 60 - ahora.getSeconds();

        // Programar la siguiente actualización al inicio del siguiente minuto
        setTimeout(() => {
            actualizarSaludoYHora();
        }, segundosHastaSiguienteMinuto * 1000);
    }

    // Inicializar la imagen y comenzar el ciclo de cambios solo si existe el contenedor
    if (document.querySelector('.bienvenida-gdl-fondo')) {
        let imagenActual = seleccionarImagenInicial();

        // Cambiar imagen cada 30 segundos
        setInterval(() => {
            imagenActual = cambiarImagenFondo(imagenActual);
        }, 30000);

        // Ejecutar la función al cargar la página
        actualizarSaludoYHora();
    }

    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = `2022-${currentYear}`;
    }


    // Registro del Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/service-worker.js');
        });
    }


    // Carrusel de novedades simplificado
    const carrusel = document.getElementById('carrusel');
    const controles = document.querySelectorAll('.carrusel-control');

    if (carrusel && controles.length > 0) {
        // Event listeners para los controles
        controles.forEach(control => {
            control.addEventListener('click', () => {
                const index = parseInt(control.getAttribute('data-index'));

                // Actualizar controles
                controles.forEach(c => c.classList.remove('activo'));
                control.classList.add('activo');

                // Desplazar carrusel
                carrusel.scrollTo({
                    left: index * carrusel.offsetWidth,
                    behavior: 'smooth'
                });
            });
        });

        // Actualizar controles al desplazar manualmente
        carrusel.addEventListener('scroll', () => {
            const scrollPosition = carrusel.scrollLeft;
            const cardWidth = carrusel.offsetWidth;
            const currentIndex = Math.round(scrollPosition / cardWidth);

            controles.forEach((control, i) => {
                control.classList.toggle('activo', i === currentIndex);
            });
        });
    }
});

// Codigo modal de actualización //
//                              //
document.addEventListener('componentesCargados', function () {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Ocultar Overlay de carga manualmente ahora que cargó todo
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            document.body.classList.remove('loading-active');

            // Una vez que desaparece el loading y se libera el body, lanzamos modal
            initUpdateModal();
        }, 500);
    } else {
        document.body.classList.remove('loading-active');
        initUpdateModal();
    }

    function initUpdateModal() {
        const modalActualizacion = document.getElementById('modal-actualizacion');
        const botonCerrar = document.getElementById('cerrar-actualizacion');

        if (modalActualizacion && botonCerrar) {
            botonCerrar.addEventListener('click', function () {
                modalActualizacion.classList.remove('show');
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                    modalActualizacion.style.display = 'none';
                }, 400); // CSS transition duration
            });

            setTimeout(() => {
                modalActualizacion.classList.add('show');
                document.body.classList.add('modal-open');
            }, 600);

            console.log('✅ Modal de actualización inicializado correctamente');
        } else {
            console.warn('⚠️ Elementos necesarios no encontrados para el modal de actualización');
        }
    }
});

// Barra de progreso de scroll
const scrollProgressBar = document.getElementById('scroll-progress-bar');
function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Evitar divisiones por cero o negativos en layouts cortos
    if (scrollHeight <= 0) return;

    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    if (scrollProgressBar) {
        scrollProgressBar.style.width = scrollPercentage + '%';

        if (scrollPercentage > 90) {
            scrollProgressBar.style.background = 'linear-gradient(90deg, #ffb07a, #ff7b54)';
        } else {
            scrollProgressBar.style.background = 'linear-gradient(90deg, #FFD1A9, #ffb07a)';
        }
    }
}

window.addEventListener('load', updateScrollProgress);
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

function setProgressBarPosition() {
    const header = document.querySelector('.header-comunidad');
    if (header) {
        const headerHeight = header.offsetHeight;
        const container = document.getElementById('scroll-progress-container');
        if (container) {
            container.style.top = headerHeight + 'px';
        }
    }
}

window.addEventListener('load', setProgressBarPosition);
window.addEventListener('resize', setProgressBarPosition);
