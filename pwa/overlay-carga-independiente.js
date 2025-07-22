// ==============================
//
// Overlay de carga independiente y reutilizable
// Se integra con el sistema de carga del JavaScript principal
//
//  <script src="/pwa/overlay-carga-independiente.js"></script>
//
// ==============================

(function() {
    'use strict';

    // Configuración del overlay
    const overlayConfig = {
        active: true,
        title: "Cargando...",
        version: "V1.0",
        backgroundColor: "#FFF5EB",
        darkBackgroundColor: "#1a0e00",
        spinnerColor: "#FFD1A9",
        spinnerTopColor: "#ffb07a",
        textColor: "#374151",
        darkTextColor: "#f3f4f6",
        darkVersionColor: "#FFD1A9",
        showVersion: true,
        autoHide: true,
        hideDelay: 500,
        zIndex: 9999,
        // Configuración para detectar el JavaScript principal
        mainScriptPath: "/pwa/javascript.js",
        detectionTimeout: 10000, // 10 segundos máximo de espera
        checkInterval: 100 // Verificar cada 100ms
    };

    // Variables de control
    let overlay = null;
    let overlayHidden = false;
    let mainScriptDetected = false;
    let mainScriptCompleted = false;
    let detectionTimer = null;
    let checkInterval = null;

    // Función para inyectar estilos CSS
    function injectStyles() {
        if (document.getElementById('independent-overlay-styles')) {
            return; // Ya están inyectados
        }

        const style = document.createElement('style');
        style.id = 'independent-overlay-styles';
        style.textContent = `
            body.loading-active {
                overflow: hidden;
            }
            
            .independent-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${overlayConfig.backgroundColor};
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: ${overlayConfig.zIndex};
                transition: opacity 0.8s ease, visibility 0.8s ease, transform 0.8s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .independent-loading-overlay.hidden {
                opacity: 0;
                visibility: hidden;
                transform: scale(1.1);
            }
            
            .independent-loading-spinner {
                width: 80px;
                height: 80px;
                border: 6px solid ${overlayConfig.spinnerColor};
                border-top: 6px solid ${overlayConfig.spinnerTopColor};
                border-radius: 50%;
                animation: independent-spin 1.2s linear infinite;
                position: relative;
            }
            
            .independent-loading-spinner::after {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                border: 2px solid ${overlayConfig.spinnerColor}20;
                border-radius: 50%;
                animation: independent-pulse 2s ease-in-out infinite;
            }
            
            .independent-loading-text {
                position: absolute;
                top: 120px;
                color: ${overlayConfig.textColor};
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                width: 100%;
                left: 50%;
                transform: translateX(-50%);
                font-family: 'Inter', sans-serif;
                letter-spacing: 0.5px;
            }
            
            .independent-loading-version {
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                font-weight: bold;
                color: ${overlayConfig.textColor};
                font-size: 12px;
                letter-spacing: 1px;
                text-align: center;
                opacity: 0.7;
                z-index: 2;
                font-family: 'Inter', sans-serif;
            }
            
            @keyframes independent-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes independent-pulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.1); }
            }
            
            .independent-loading-overlay.dark-theme {
                background-color: ${overlayConfig.darkBackgroundColor};
            }
            
            .independent-loading-overlay.dark-theme .independent-loading-spinner {
                border-color: ${overlayConfig.spinnerColor};
                border-top-color: ${overlayConfig.spinnerTopColor};
            }
            
            .independent-loading-overlay.dark-theme .independent-loading-text {
                color: ${overlayConfig.darkTextColor};
            }
            
            .independent-loading-overlay.dark-theme .independent-loading-version {
                color: ${overlayConfig.darkVersionColor};
            }
            
            .main-content {
                opacity: 0;
                transition: opacity 1.2s ease;
            }
            
            .main-content.loaded {
                opacity: 1;
            }
            
            /* Efecto de aparición moderno */
            .independent-loading-overlay.show {
                animation: overlay-appear 0.6s ease-out;
            }
            
            @keyframes overlay-appear {
                0% {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            /* Efecto de desaparición moderno */
            .independent-loading-overlay.hide {
                animation: overlay-disappear 0.8s ease-in forwards;
            }
            
            @keyframes overlay-disappear {
                0% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: scale(1.1) translateY(-30px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Función para crear el overlay
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'independent-loading-overlay';
        overlay.id = 'independentLoadingOverlay';
        
        // Verificar si el tema oscuro está activo
        const isDarkTheme = document.body.classList.contains('dark-theme') || 
                           document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkTheme) {
            overlay.classList.add('dark-theme');
        }
        
        // Construir contenido del overlay
        overlay.innerHTML = `
            <div style="position: relative;">
                <div class="independent-loading-spinner"></div>
                <div class="independent-loading-text" id="independentLoadingText">${overlayConfig.title}</div>
            </div>
            ${overlayConfig.showVersion ? `<div class="independent-loading-version">${overlayConfig.version}</div>` : ''}
        `;
        
        // Agregar clase para efecto de aparición
        overlay.classList.add('show');
        
        return overlay;
    }

    // Función para actualizar el progreso
    function updateProgress(message, percentage = null) {
        const loadingText = document.getElementById('independentLoadingText');
        if (loadingText) {
            if (percentage !== null) {
                loadingText.textContent = `${message} (${percentage}%)`;
            } else {
                loadingText.textContent = message;
            }
            console.log(`🔄 [Overlay Independiente] ${message}${percentage ? ` - ${percentage}%` : ''}`);
        }
    }

    // Función para detectar el JavaScript principal
    function detectMainScript() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = overlayConfig.detectionTimeout / overlayConfig.checkInterval;
            
            // ESCUCHAR EVENTO ESPECÍFICO DEL JS PRINCIPAL
            const handleMainScriptCompleted = (event) => {
                console.log('🎉 [Overlay Independiente] Evento de finalización recibido del JS principal');
                console.log('📊 [Overlay Independiente] Detalles:', event.detail);
                
                mainScriptCompleted = true;
                updateProgress('Carga completada', 100);
                
                // Limpiar intervalos y listeners
                if (checkInterval) {
                    clearInterval(checkInterval);
                }
                window.removeEventListener('mainScriptCompleted', handleMainScriptCompleted);
                
                resolve();
            };
            
            // Agregar listener para el evento específico
            window.addEventListener('mainScriptCompleted', handleMainScriptCompleted);
            
            // Verificar si ya está completado (para casos donde el evento ya se disparó)
            if (window.mainScriptCompleted) {
                console.log('✅ [Overlay Independiente] JS principal ya completado (propiedad global)');
                mainScriptCompleted = true;
                updateProgress('Carga completada', 100);
                window.removeEventListener('mainScriptCompleted', handleMainScriptCompleted);
                resolve();
                return;
            }
            
            checkInterval = setInterval(() => {
                attempts++;
                
                // Verificar si el script principal está cargado
                const mainScript = document.querySelector(`script[src*="${overlayConfig.mainScriptPath}"]`);
                if (mainScript && !mainScriptDetected) {
                    mainScriptDetected = true;
                    console.log('✅ [Overlay Independiente] Script principal detectado');
                    updateProgress('Script principal detectado', 25);
                }
                
                // Verificar si el overlay del script principal existe (indica que está funcionando)
                const mainOverlay = document.getElementById('loadingOverlay');
                if (mainOverlay && mainScriptDetected) {
                    console.log('✅ [Overlay Independiente] Overlay principal detectado');
                    updateProgress('Sistema de carga principal activo', 50);
                }
                
                // Verificar si el JavaScript principal ha terminado (por la clase loading-active)
                if (mainScriptDetected && !document.body.classList.contains('loading-active')) {
                    mainScriptCompleted = true;
                    console.log('✅ [Overlay Independiente] JavaScript principal completado (por clase)');
                    updateProgress('Carga completada', 100);
                    clearInterval(checkInterval);
                    window.removeEventListener('mainScriptCompleted', handleMainScriptCompleted);
                    resolve();
                    return;
                }
                
                // Timeout de seguridad (solo si no se ha completado por evento)
                if (attempts >= maxAttempts && !mainScriptCompleted) {
                    console.warn('⚠️ [Overlay Independiente] Timeout de detección alcanzado');
                    updateProgress('Carga completada (timeout)', 100);
                    clearInterval(checkInterval);
                    window.removeEventListener('mainScriptCompleted', handleMainScriptCompleted);
                    resolve();
                    return;
                }
                
                // Actualizar progreso basado en intentos (solo si no se ha completado)
                if (!mainScriptCompleted) {
                    const progress = Math.min(25 + (attempts / maxAttempts) * 75, 95);
                    updateProgress('Esperando carga del sistema principal', Math.round(progress));
                }
                
            }, overlayConfig.checkInterval);
        });
    }

    // Función para ocultar el overlay con efecto moderno
    function hideOverlay() {
        if (!overlay || overlayHidden) {
            return;
        }
        
        overlayHidden = true;
        console.log('🎉 [Overlay Independiente] Ocultando overlay con efecto moderno');
        
        // Aplicar efecto de desaparición
        overlay.classList.add('hide');
        
        // Remover después de la animación
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // Habilitar scroll
            document.body.classList.remove('loading-active');
            
            // Mostrar contenido principal
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.classList.add('loaded');
            }
            
            console.log('✅ [Overlay Independiente] Overlay removido completamente');
        }, 800);
    }

    // Función principal de inicialización
    function init() {
        if (!overlayConfig.active) {
            return;
        }
        
        console.log('🚀 [Overlay Independiente] Iniciando overlay de carga independiente');
        
        // Inyectar estilos
        injectStyles();
        
        // Crear overlay
        overlay = createOverlay();
        
        // Agregar al documento
        document.body.appendChild(overlay);
        document.body.classList.add('loading-active');
        
        // Ocultar contenido principal inicialmente
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.remove('loaded');
        }
        
        updateProgress('Iniciando sistema de carga', 0);
        
        // Iniciar detección del JavaScript principal
        detectMainScript().then(() => {
            // Pausa final antes de ocultar
            setTimeout(() => {
                hideOverlay();
            }, overlayConfig.hideDelay);
        });
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer funciones para uso externo
    window.independentLoadingOverlay = {
        updateProgress: updateProgress,
        hide: hideOverlay,
        show: () => {
            if (overlay) {
                overlay.classList.remove('hidden');
                document.body.classList.add('loading-active');
                overlayHidden = false;
            }
        },
        // Función para mostrar con efecto de aparición
        showWithFade: () => {
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.transform = 'scale(0.95)';
                overlay.classList.remove('hidden');
                document.body.classList.add('loading-active');
                overlayHidden = false;
                
                setTimeout(() => {
                    overlay.style.opacity = '1';
                    overlay.style.transform = 'scale(1)';
                }, 50);
            }
        },
        // Función para reiniciar el overlay
        restart: () => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            overlayHidden = false;
            mainScriptDetected = false;
            mainScriptCompleted = false;
            if (checkInterval) {
                clearInterval(checkInterval);
            }
            init();
        },
        // Función para verificar el estado del JS principal
        getMainScriptStatus: () => {
            return {
                detected: mainScriptDetected,
                completed: mainScriptCompleted,
                globalCompleted: window.mainScriptCompleted || false,
                completionTime: window.mainScriptCompletionTime || null,
                bodyLoadingActive: document.body.classList.contains('loading-active'),
                mainOverlayExists: !!document.getElementById('loadingOverlay')
            };
        },
        // Función para forzar la finalización (útil para debugging)
        forceComplete: () => {
            console.log('🔧 [Overlay Independiente] Forzando finalización manual');
            mainScriptCompleted = true;
            updateProgress('Carga completada (forzada)', 100);
            if (checkInterval) {
                clearInterval(checkInterval);
            }
            setTimeout(() => {
                hideOverlay();
            }, overlayConfig.hideDelay);
        }
    };

})(); 