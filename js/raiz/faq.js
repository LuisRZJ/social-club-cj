document.addEventListener('componentesCargados', function () {
    // Configuración del botón "Volver" inteligente local en FAQ
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function () {
            if (document.referrer && document.referrer !== window.location.href) {
                window.history.back();
            } else {
                window.location.href = '/index.html';
            }
        });
    }

    // Acordeón FAQ (lógica de apertura individual)
    const headers = document.querySelectorAll('.accordion-item-header');
    headers.forEach(header => {
        // Evitar añadir múltiples listeners si se llama repetidamente
        if (!header.hasAttribute('data-listener-attached')) {
            header.addEventListener('click', function () {
                const item = this.parentElement;
                item.classList.toggle('open');
            });
            header.setAttribute('data-listener-attached', 'true');
        }
    });

    // Barra de progreso de scroll (Lógica reescrita para asincronía)
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const scrollProgressContainer = document.getElementById('scroll-progress-container');
    const headerComunidad = document.querySelector('.header-comunidad');

    function updateScrollProgress() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // Si no hay scrollHeight suficiente (ej. página muy corta), asumimos 0
        let scrollPercentage = 0;
        if (scrollHeight > 0) {
            scrollPercentage = (scrollTop / scrollHeight) * 100;
        }

        if (scrollProgressBar) {
            scrollProgressBar.style.width = scrollPercentage + '%';
            if (scrollPercentage > 90) {
                scrollProgressBar.style.background = 'linear-gradient(90deg, #ffb07a, #ff7b54)';
            } else {
                scrollProgressBar.style.background = 'linear-gradient(90deg, #FFD1A9, #ffb07a)';
            }
        }
    }

    function setProgressBarPosition() {
        if (headerComunidad && scrollProgressContainer) {
            const headerHeight = headerComunidad.offsetHeight;
            scrollProgressContainer.style.top = headerHeight + 'px';
        }
    }

    // Inicializar estados de barra
    updateScrollProgress();
    setProgressBarPosition();

    // Escuchar eventos globales del User
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', () => {
        updateScrollProgress();
        setProgressBarPosition();
    });
});
