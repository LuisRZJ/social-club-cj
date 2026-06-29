document.addEventListener('componentesCargados', () => {
    function getParametroDestino() {
        const params = new URLSearchParams(window.location.search);
        let destino = params.get('destino');
        if (destino) {
            destino = decodeURIComponent(destino);
            localStorage.setItem('anuncio_destino', destino);
            return destino;
        }
        
        // Intentar recuperar de localStorage si se perdió la query string (ej. en vistas previas o PWAs)
        destino = localStorage.getItem('anuncio_destino');
        return destino ? destino : null;
    }

    // Capa de seguridad PWA: Redirección inmediata si se navega a páginas locales
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isPWA) {
        const destino = getParametroDestino();
        const isDestinoLocal = destino && (destino.startsWith('/') || !destino.startsWith('http') || destino.includes(window.location.hostname));
        if (isDestinoLocal) {
            console.log("⚡ PWA detectado en página de anuncio: redirección inmediata a:", destino);
            localStorage.removeItem('anuncio_destino');
            window.location.href = destino;
            return;
        }
    }

    const contador = document.getElementById('contador');
    const temporizador = document.getElementById('temporizador');
    const cerrarBtn = document.getElementById('cerrarBtn');
    const volverBtn = document.getElementById('volverBtn');
    const btnAccionPrincipal = document.getElementById('btnAccionPrincipal');

    // --- SISTEMA DE VERSIONES ALEATORIAS ---
    const versiones = [
        // Anuncio 1 - CryptoTab
        {
            titulo: "¡Mina Bitcoin mientras navegas!",
            subtitulo: "CryptoTab Browser te permite ganar criptomonedas de forma pasiva mientras usas internet. Una forma inteligente de aprovechar el tiempo online.",
            imagen: "../icons/CryptoTab-baner-browser.avif",
            alt: "CryptoTab Browser - Navegador que mina Bitcoin",
            boton: {
                texto: "Descargar CryptoTab",
                enlace: "https://cryptotab.farm/43028368",
                icono: "fa-download"
            },
            tarjetas: [
                { icono: "fa-coins", titulo: "Minería Pasiva", desc: "Mina Bitcoin automáticamente mientras navegas por internet. No necesitas conocimientos técnicos, solo instalar y usar normalmente." },
                { icono: "fa-shield-halved", titulo: "Seguro y Confiable", desc: "Basado en Chromium, CryptoTab es un navegador seguro con todas las funciones que esperas: extensiones, sincronización y más." },
                { icono: "fa-chart-line", titulo: "Ganancias Reales", desc: "Retira tus ganancias directamente a tu wallet de Bitcoin. El rendimiento varía según tu hardware y tiempo de uso." }
            ]
        },
        // Anuncio 2 - Bitcoin Mining
        {
            titulo: "¡Mina Bitcoin desde tu telefono!",
            subtitulo: "Únete a la revolución de las criptomonedas con nuestro software de minería optimizado. Gana Bitcoin de forma segura y eficiente.",
            imagen: "../icons/Bitcoin-mining-logo.avif",
            alt: "Bitcoin Mining - Software de minería",
            boton: {
                texto: "Descargar App",
                enlace: "https://play.google.com/store/apps/details?id=bitcoin.minning.com&pcampaignid=web_share",
                icono: "fa-download"
            },
            tarjetas: [
                { icono: "fa-microchip", titulo: "Minería Optimizada +10%", desc: "Software especializado que maximiza el rendimiento de tu hardware. ¡Usa el código ZEVHLB al registrarte y obtén un aumento permanente del 10% en la velocidad de minería!" },
                { icono: "fa-shield-halved", titulo: "Seguridad Garantizada", desc: "Minería segura con protección antivirus integrada y conexiones encriptadas para proteger tus ganancias y tu equipo." },
                { icono: "fa-chart-line", titulo: "Monitoreo en Tiempo Real", desc: "Sigue tus ganancias en tiempo real con estadísticas detalladas, gráficos de rendimiento y alertas personalizables." }
            ]
        },
        // Anuncio 3 - Donaciones
        {
            titulo: "Apoya nuestra comunidad",
            subtitulo: "Tu contribución nos ayuda a mantener y mejorar los servidores, herramientas y eventos para todos los miembros.",
            imagen: "../imagenes/Fondos-BS/Fondo-basico1.avif",
            alt: "Donaciones para la comunidad CGN",
            boton: {
                texto: "Hacer donación",
                enlace: "/donaciones.html",
                icono: "fa-heart"
            },
            tarjetas: [
                { icono: "fa-server", titulo: "Infraestructura", desc: "Mantenemos servidores de Discord y Minecraft con estabilidad y rendimiento óptimo para toda la comunidad." },
                { icono: "fa-screwdriver-wrench", titulo: "Herramientas Premium", desc: "Adquirimos bots, software especializado y herramientas que mejoran la experiencia de todos los miembros." },
                { icono: "fa-calendar-days", titulo: "Eventos y Actividades", desc: "Organizamos torneos, concursos y eventos especiales que fomentan la participación y el espíritu comunitario." }
            ]
        }
    ];

    const version = versiones[Math.floor(Math.random() * versiones.length)];

    const tituloPrincipal = document.getElementById('tituloPrincipal');
    const subtituloPrincipal = document.getElementById('subtituloPrincipal');
    if (tituloPrincipal) tituloPrincipal.textContent = version.titulo;
    if (subtituloPrincipal) subtituloPrincipal.textContent = version.subtitulo;

    const img = document.getElementById('imagenAnuncio');
    if (img) {
        img.src = version.imagen;
        img.alt = version.alt;
    }

    const contenedorServicios = document.getElementById('contenedorServicios');
    if (contenedorServicios) {
        contenedorServicios.innerHTML = '';
        version.tarjetas.forEach(tarjeta => {
            const div = document.createElement('div');
            div.className = 'servicio-card';
            div.innerHTML = `
                  <i class="fa-solid ${tarjeta.icono}"></i>
                  <h3>${tarjeta.titulo}</h3>
                  <p>${tarjeta.desc}</p>
              `;
            contenedorServicios.appendChild(div);
        });
    }

    const textoBtnAccion = document.getElementById('textoBtnAccion');
    if (btnAccionPrincipal && textoBtnAccion) {
        const iconoBtn = btnAccionPrincipal.querySelector('i');
        btnAccionPrincipal.href = version.boton.enlace;
        textoBtnAccion.textContent = version.boton.texto;
        if (iconoBtn) iconoBtn.className = `fa-solid ${version.boton.icono}`;
    }

    let tiempoRestante = 5;
    const cuentaRegresiva = setInterval(() => {
        tiempoRestante--;
        if (contador) contador.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(cuentaRegresiva);
            if (temporizador) temporizador.innerHTML = "Desplázate al final para cerrar el anuncio";

            if (cerrarBtn) {
                cerrarBtn.classList.remove('desactivado');
                cerrarBtn.disabled = false;
            }
            if (btnAccionPrincipal) btnAccionPrincipal.classList.remove('desactivado');
        }
    }, 1000);



    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', () => {
            const destino = getParametroDestino();
            console.log("Cerrar presionado. Destino original obtenido:", destino);
            localStorage.removeItem('anuncio_destino'); // Limpiar el caché local del destino
            window.location.href = destino ? destino : '/';
        });
    }

    if (volverBtn) {
        volverBtn.addEventListener('click', () => {
            const destino = getParametroDestino();
            console.log("Volver presionado. Destino original obtenido:", destino);
            localStorage.removeItem('anuncio_destino'); // Limpiar el caché local del destino
            window.history.length > 2 ? window.history.back() : window.location.href = destino || '/';
        });
    }
});