document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Archivo JS principal iniciado correctamente');

    // Deshabilitar scroll durante la carga
    document.body.classList.add('loading-active');

    // Variables globales del sistema de carga
    let completed = 0;
    let overlayHidden = false;
    let stylesheetsLoaded = 0;
    let totalStylesheets = 0;
    let stylesheetsCompleted = false;
    let scriptsLoaded = 0;
    let totalScripts = 0;
    let scriptsCompleted = false;
    let lastScrollY = 0;

    // Función para actualizar el progreso de carga
    function updateLoadingProgress(message, percentage) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const loadingSpinner = document.querySelector('.loading-spinner');
        
        if (loadingOverlay && loadingText) {
            loadingText.textContent = `${message} (${percentage}%)`;
            console.log(`🔄 ${message} - ${percentage}%`);
            
            // Actualizar rotación del spinner basada en el progreso
            if (loadingSpinner) {
                // Calcular rotación: 0% = 0°, 100% = 360°
                const rotation = (percentage / 100) * 360;
                loadingSpinner.style.transform = `rotate(${rotation}deg)`;
                
                // Remover animación inicial si existe
                if (loadingSpinner.classList.contains('initial-load')) {
                    loadingSpinner.classList.remove('initial-load');
                }
            }
        }
    }

    // Función para actualizar progreso combinado (CSS + JS + Scripts)
    function updateCombinedProgress(jsTask, jsPercentage, cssPercentage, scriptsPercentage) {
        // Calcular progreso combinado: 30% CSS + 30% Scripts + 40% JS
        const combinedPercentage = Math.round((cssPercentage * 0.3) + (scriptsPercentage * 0.3) + (jsPercentage * 0.4));
        
        let message;
        if (stylesheetsCompleted && scriptsCompleted) {
            message = jsTask;
        } else if (cssPercentage === 100 && scriptsPercentage === 100) {
            message = `${jsTask} (recursos completados)`;
        } else if (jsPercentage === 0) {
            if (cssPercentage > 0 && scriptsPercentage > 0) {
                message = `Cargando estilos (${cssPercentage}%) y scripts (${scriptsPercentage}%)`;
            } else if (cssPercentage > 0) {
                message = `Cargando hojas de estilo (${cssPercentage}%)`;
            } else if (scriptsPercentage > 0) {
                message = `Cargando scripts (${scriptsPercentage}%)`;
            } else {
                message = `Iniciando carga de recursos...`;
            }
        } else {
            let resourceStatus = [];
            if (cssPercentage < 100) resourceStatus.push(`estilos ${cssPercentage}%`);
            if (scriptsPercentage < 100) resourceStatus.push(`scripts ${scriptsPercentage}%`);
            if (resourceStatus.length > 0) {
                message = `${jsTask} (${resourceStatus.join(', ')})`;
            } else {
                message = `${jsTask} (recursos completados)`;
            }
        }
        
        updateLoadingProgress(message, combinedPercentage);
    }

    // Función para ocultar el loader al finalizar
    function hideLoader() {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 RESUMEN DE CARGA COMPLETA');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🎨 Hojas de estilo cargadas: ${stylesheetsLoaded}/${totalStylesheets}`);
        console.log(`📜 Scripts externos cargados: ${scriptsLoaded}/${totalScripts}`);
        console.log(`📋 Scripts internos totales: ${tasks.length}`);
        console.log(`✅ Scripts internos ejecutados: ${completed}`);
        console.log(`📈 Porcentaje de éxito CSS: ${Math.round((stylesheetsLoaded / totalStylesheets) * 100)}%`);
        console.log(`📈 Porcentaje de éxito Scripts: ${Math.round((scriptsLoaded / totalScripts) * 100)}%`);
        console.log(`📈 Porcentaje de éxito JS interno: ${Math.round((completed / tasks.length) * 100)}%`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 Todos los recursos se han cargado correctamente');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        const mainContent = document.getElementById('mainContent');
        if (loadingOverlay && mainContent && !overlayHidden) {
            overlayHidden = true;
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                mainContent.classList.add('loaded');
                document.body.classList.remove('loading-active');
                console.log('✅ Página completamente cargada');
            }, 500);
        }
    }

    // BLOQUE 0: Monitoreo de hojas de estilos CSS
    function setupStylesheetMonitoring() {
        return new Promise((resolve) => {
            try {
                // Obtener todas las hojas de estilo del documento
                const stylesheets = Array.from(document.styleSheets);
                const externalStylesheets = stylesheets.filter(sheet => {
                    try {
                        return sheet.href && sheet.href.startsWith(window.location.origin);
                    } catch (e) {
                        return false;
                    }
                });

                // También incluir hojas de estilo externas conocidas
                const knownStylesheets = [
                    '/HECKS-BOT/estilos.css',
                    '/pwa/estilos.css',
                    '/pwa/temas.css',
                    '/pwa/componentes.css',
                    '/pwa/panel-de-acciones/estilos-PA.css'
                ];

                // Combinar hojas de estilo detectadas y conocidas
                const allStylesheets = [...new Set([
                    ...externalStylesheets.map(sheet => sheet.href),
                    ...knownStylesheets
                ])];

                totalStylesheets = allStylesheets.length;
                stylesheetsLoaded = 0;

                console.log(`🎨 Detectadas ${totalStylesheets} hojas de estilo para monitorear`);

                if (totalStylesheets === 0) {
                    stylesheetsCompleted = true;
                    console.log('⚠️ No se detectaron hojas de estilo para monitorear');
                    resolve();
                    return;
                }

                // Función para verificar si una hoja de estilo está cargada
                function checkStylesheetLoaded(href) {
                    return new Promise((resolve) => {
                        // Verificar si la hoja ya está cargada en el documento
                        const existingLink = document.querySelector(`link[href="${href}"]`);
                        if (existingLink) {
                            stylesheetsLoaded++;
                            const cssPercentage = Math.round((stylesheetsLoaded / totalStylesheets) * 100);
                            console.log(`✅ CSS ya cargado: ${href} (${stylesheetsLoaded}/${totalStylesheets})`);
                            
                            if (stylesheetsLoaded >= totalStylesheets) {
                                stylesheetsCompleted = true;
                                console.log('🎨 Todas las hojas de estilo han sido cargadas');
                            }
                            resolve();
                            return;
                        }

                        // Verificar si la hoja está en document.styleSheets
                        const sheetExists = Array.from(document.styleSheets).some(sheet => {
                            try {
                                return sheet.href && sheet.href.includes(href.split('/').pop());
                            } catch (e) {
                                return false;
                            }
                        });

                        if (sheetExists) {
                            stylesheetsLoaded++;
                            const cssPercentage = Math.round((stylesheetsLoaded / totalStylesheets) * 100);
                            console.log(`✅ CSS detectado en styleSheets: ${href} (${stylesheetsLoaded}/${totalStylesheets})`);
                            
                            if (stylesheetsLoaded >= totalStylesheets) {
                                stylesheetsCompleted = true;
                                console.log('🎨 Todas las hojas de estilo han sido cargadas');
                            }
                            resolve();
                            return;
                        }

                        // Si no está cargada, intentar cargarla para verificar
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = href;
                        
                        link.onload = () => {
                            stylesheetsLoaded++;
                            const cssPercentage = Math.round((stylesheetsLoaded / totalStylesheets) * 100);
                            console.log(`✅ CSS cargado exitosamente: ${href} (${stylesheetsLoaded}/${totalStylesheets})`);
                            
                            if (stylesheetsLoaded >= totalStylesheets) {
                                stylesheetsCompleted = true;
                                console.log('🎨 Todas las hojas de estilo han sido cargadas');
                            }
                            resolve();
                        };
                        
                        link.onerror = () => {
                            console.warn(`⚠️ Error al cargar CSS: ${href}`);
                            stylesheetsLoaded++;
                            resolve();
                        };
                        
                        // Agregar temporalmente para verificar
                        document.head.appendChild(link);
                        
                        // Timeout de seguridad
                        setTimeout(() => {
                            if (link.sheet) {
                                stylesheetsLoaded++;
                                console.log(`✅ CSS verificado por timeout: ${href} (${stylesheetsLoaded}/${totalStylesheets})`);
                            }
                            resolve();
                        }, 200);
                    });
                }

                // Función para actualizar progreso de CSS en tiempo real
                function updateCSSProgress() {
                    const cssPercentage = Math.round((stylesheetsLoaded / totalStylesheets) * 100);
                    console.log(`🎨 Progreso CSS: ${stylesheetsLoaded}/${totalStylesheets} (${cssPercentage}%)`);
                    
                    // Actualizar el progreso en la interfaz si hay tareas JS completadas
                    if (completed > 0) {
                        const jsPercentage = Math.round((completed / tasks.length) * 100);
                        const scriptsPercentage = scriptsCompleted ? 100 : Math.round((scriptsLoaded / totalScripts) * 100);
                        updateCombinedProgress('Monitoreando recursos', jsPercentage, cssPercentage, scriptsPercentage);
                    }
                }

                // Verificar todas las hojas de estilo
                Promise.all(allStylesheets.map(checkStylesheetLoaded))
                    .then(() => {
                        stylesheetsCompleted = true;
                        console.log('🎨 Monitoreo de hojas de estilo completado');
                        updateCSSProgress(); // Actualización final
                        resolve();
                    })
                    .catch((error) => {
                        console.error('❌ Error en monitoreo de hojas de estilo:', error);
                        stylesheetsCompleted = true;
                        resolve();
                    });

                // Actualizar progreso cada 100ms durante el monitoreo
                const progressInterval = setInterval(() => {
                    if (!stylesheetsCompleted) {
                        updateCSSProgress();
                    } else {
                        clearInterval(progressInterval);
                    }
                }, 100);

            } catch (error) {
                console.error('❌ Error al configurar monitoreo de hojas de estilo:', error);
                stylesheetsCompleted = true;
                resolve();
            }
        });
    }

    // BLOQUE 0.5: Monitoreo de scripts JavaScript externos
    function setupScriptMonitoring() {
        return new Promise((resolve) => {
            try {
                // Obtener todos los scripts del documento
                const scripts = Array.from(document.scripts);
                const externalScripts = scripts.filter(script => {
                    return script.src && script.src.startsWith(window.location.origin);
                });

                // También incluir scripts externos conocidos
                const knownScripts = [
                    '/HECKS-BOT/javascript.js',
                    '/pwa/noticias.js',
                    '/pwa/javascript.js'
                ];

                // Combinar scripts detectados y conocidos
                const allScripts = [...new Set([
                    ...externalScripts.map(script => script.src),
                    ...knownScripts
                ])];

                totalScripts = allScripts.length;
                scriptsLoaded = 0;

                console.log(`📜 Detectados ${totalScripts} scripts externos para monitorear`);

                if (totalScripts === 0) {
                    scriptsCompleted = true;
                    console.log('⚠️ No se detectaron scripts externos para monitorear');
                    resolve();
                    return;
                }

                // Función para verificar si un script está cargado
                function checkScriptLoaded(src) {
                    return new Promise((resolve) => {
                        // Verificar si el script ya está cargado en el documento
                        const existingScript = document.querySelector(`script[src="${src}"]`);
                        if (existingScript) {
                            scriptsLoaded++;
                            const scriptsPercentage = Math.round((scriptsLoaded / totalScripts) * 100);
                            console.log(`✅ Script ya cargado: ${src} (${scriptsLoaded}/${totalScripts})`);
                            
                            if (scriptsLoaded >= totalScripts) {
                                scriptsCompleted = true;
                                console.log('📜 Todos los scripts externos han sido cargados');
                            }
                            resolve();
                            return;
                        }

                        // Verificar si el script está en document.scripts
                        const scriptExists = Array.from(document.scripts).some(script => {
                            return script.src && script.src.includes(src.split('/').pop());
                        });

                        if (scriptExists) {
                            scriptsLoaded++;
                            const scriptsPercentage = Math.round((scriptsLoaded / totalScripts) * 100);
                            console.log(`✅ Script detectado en document.scripts: ${src} (${scriptsLoaded}/${totalScripts})`);
                            
                            if (scriptsLoaded >= totalScripts) {
                                scriptsCompleted = true;
                                console.log('📜 Todos los scripts externos han sido cargados');
                            }
                            resolve();
                            return;
                        }

                        // Si no está cargado, intentar cargarlo para verificar
                        const script = document.createElement('script');
                        script.src = src;
                        
                        script.onload = () => {
                            scriptsLoaded++;
                            const scriptsPercentage = Math.round((scriptsLoaded / totalScripts) * 100);
                            console.log(`✅ Script cargado exitosamente: ${src} (${scriptsLoaded}/${totalScripts})`);
                            
                            if (scriptsLoaded >= totalScripts) {
                                scriptsCompleted = true;
                                console.log('📜 Todos los scripts externos han sido cargados');
                            }
                            resolve();
                        };
                        
                        script.onerror = () => {
                            console.warn(`⚠️ Error al cargar script: ${src}`);
                            scriptsLoaded++;
                            resolve();
                        };
                        
                        // Agregar temporalmente para verificar
                        document.head.appendChild(script);
                        
                        // Timeout de seguridad
                        setTimeout(() => {
                            if (script.src) {
                                scriptsLoaded++;
                                console.log(`✅ Script verificado por timeout: ${src} (${scriptsLoaded}/${totalScripts})`);
                            }
                            resolve();
                        }, 200);
                    });
                }

                // Función para actualizar progreso de scripts en tiempo real
                function updateScriptsProgress() {
                    const scriptsPercentage = Math.round((scriptsLoaded / totalScripts) * 100);
                    console.log(`📜 Progreso Scripts: ${scriptsLoaded}/${totalScripts} (${scriptsPercentage}%)`);
                    
                    // Actualizar el progreso en la interfaz si hay tareas JS completadas
                    if (completed > 0) {
                        const jsPercentage = Math.round((completed / tasks.length) * 100);
                        const cssPercentage = stylesheetsCompleted ? 100 : Math.round((stylesheetsLoaded / totalStylesheets) * 100);
                        updateCombinedProgress('Monitoreando recursos', jsPercentage, cssPercentage, scriptsPercentage);
                    }
                }

                // Verificar todos los scripts
                Promise.all(allScripts.map(checkScriptLoaded))
                    .then(() => {
                        scriptsCompleted = true;
                        console.log('📜 Monitoreo de scripts externos completado');
                        updateScriptsProgress(); // Actualización final
                        resolve();
                    })
                    .catch((error) => {
                        console.error('❌ Error en monitoreo de scripts externos:', error);
                        scriptsCompleted = true;
                        resolve();
                    });

                // Actualizar progreso cada 100ms durante el monitoreo
                const progressInterval = setInterval(() => {
                    if (!scriptsCompleted) {
                        updateScriptsProgress();
                    } else {
                        clearInterval(progressInterval);
                    }
                }, 100);

            } catch (error) {
                console.error('❌ Error al configurar monitoreo de scripts externos:', error);
                scriptsCompleted = true;
                resolve();
            }
        });
    }

    // BLOQUE 1: Control del círculo de carga
    function setupLoader() {
        return new Promise((resolve) => {
            try {
                const loadingOverlay = document.getElementById('loadingOverlay');
                const loadingText = document.getElementById('loadingText');
                const mainContent = document.getElementById('mainContent');
                const loadingSpinner = document.querySelector('.loading-spinner');
                
                if (loadingOverlay && loadingText && mainContent) {
                    // Verificar si el tema oscuro está activo y aplicarlo al loading
                    if (document.body.classList.contains('dark-theme')) {
                        loadingOverlay.classList.add('dark-theme');
                    }
                    
                    // Inicializar spinner con animación de carga
                    if (loadingSpinner) {
                        loadingSpinner.classList.add('initial-load');
                        // Establecer rotación inicial
                        loadingSpinner.style.transform = 'rotate(0deg)';
                    }
                    
                    console.log('✅ Control del círculo de carga configurado correctamente');
                } else {
                    console.warn('⚠️ Elementos del loading no encontrados');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar control del loading:', error);
                resolve(); // Continuar aunque falle
            }
        });
    }

    // BLOQUE 2: Actualizar año en footer
    function updateFooterYear() {
        return new Promise((resolve) => {
            try {
                const currentYear = new Date().getFullYear();
                const yearElement = document.getElementById('currentYear');
                if (yearElement) {
                    yearElement.textContent = `2022-${currentYear}`;
                    console.log('✅ Año actualizado en footer:', currentYear);
                } else {
                    console.warn('⚠️ Elemento currentYear no encontrado');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al actualizar año en footer:', error);
                resolve();
            }
        });
    }

    // BLOQUE 3: Botón "Volver" inteligente
    function setupBackButton() {
        return new Promise((resolve) => {
            try {
                const backButton = document.getElementById('backButton');
                if (backButton) {
                    backButton.addEventListener('click', function() {
                        console.log('🔄 Botón "Volver" presionado');
                        // Comprobar si hay una página anterior en el historial
                        if (document.referrer && document.referrer !== window.location.href) {
                            window.history.back();
                        } else {
                            // Si no hay historial previo, redirigir a la página de inicio
                            window.location.href = '/index.html';
                        }
                    });
                    console.log('✅ Botón "Volver" configurado correctamente');
                } else {
                    console.warn('⚠️ Botón "Volver" no encontrado');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar botón "Volver":', error);
                resolve();
            }
        });
    }

    // BLOQUE 4: Botón "Volver arriba" -- Panel de acciones
    function setupBackToTopButton() {
        return new Promise((resolve) => {
            try {
                const backToTopBtn = document.getElementById('backToTopBtn');
                if (backToTopBtn) {
                    backToTopBtn.addEventListener('click', function() {
                        console.log('⬆️ Botón "Volver arriba" presionado');
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                    console.log('✅ Botón "Volver arriba" configurado correctamente');
                } else {
                    console.warn('⚠️ Botón "Volver arriba" no encontrado');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar botón "Volver arriba":', error);
                resolve();
            }
        });
    }

    // BLOQUE 5: Botón "Ir al final" -- Panel de acciones
    function setupGoToBottomButton() {
        return new Promise((resolve) => {
            try {
                const goToBottomBtn = document.getElementById('goToBottomBtn');
                if (goToBottomBtn) {
                    goToBottomBtn.addEventListener('click', function() {
                        console.log('⬇️ Botón "Ir al final" presionado');
                        window.scrollTo({
                            top: document.documentElement.scrollHeight,
                            behavior: 'smooth'
                        });
                    });
                    console.log('✅ Botón "Ir al final" configurado correctamente');
                } else {
                    console.warn('⚠️ Botón "Ir al final" no encontrado');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar botón "Ir al final":', error);
                resolve();
            }
        });
    }

    // BLOQUE 6: Menú desplegable del header
    function setupDropdownMenu() {
        return new Promise((resolve) => {
            try {
                const menuToggle = document.getElementById('menuToggle');
                const menuDesplegable = document.getElementById('menuDesplegable');
                
                if (menuToggle && menuDesplegable) {
                    // Abrir/cerrar menú al hacer clic en el botón
                    menuToggle.addEventListener('click', function(e) {
                        e.stopPropagation();
                        menuDesplegable.classList.toggle('abierto');
                        menuToggle.classList.toggle('activo');
                        
                        if (menuDesplegable.classList.contains('abierto')) {
                            console.log('🍔 Menú desplegable abierto');
                        } else {
                            console.log('🍔 Menú desplegable cerrado');
                        }
                    });
                    
                    // Cerrar menú al hacer clic fuera
                    document.addEventListener('click', function(e) {
                        if (!menuDesplegable.contains(e.target) && !menuToggle.contains(e.target)) {
                            menuDesplegable.classList.remove('abierto');
                            menuToggle.classList.remove('activo');
                        }
                    });
                    
                    // Prevenir que el clic en el menú lo cierre
                    menuDesplegable.addEventListener('click', function(e) {
                        e.stopPropagation();
                    });
                    
                    console.log('✅ Menú desplegable configurado correctamente');
                } else {
                    console.warn('⚠️ Elementos del menú desplegable no encontrados');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar menú desplegable:', error);
                resolve();
            }
        });
    }

    // BLOQUE 7: Barra de progreso de scroll
    function setupScrollProgressBar() {
        return new Promise((resolve) => {
            try {
                const scrollProgressBar = document.getElementById('scroll-progress-bar');
                const scrollProgressContainer = document.getElementById('scroll-progress-container');
                
                if (scrollProgressBar && scrollProgressContainer) {
                    function updateScrollProgress() {
                        // Calcular el progreso del scroll
                        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                        const scrollPercentage = (scrollTop / scrollHeight) * 100;
                        
                        // Actualizar el ancho de la barra de progreso
                        scrollProgressBar.style.width = scrollPercentage + '%';
                        
                        // Cambiar color cuando esté cerca del final
                        if (scrollPercentage > 90) {
                            scrollProgressBar.style.background = 'linear-gradient(90deg, #ffb07a, #ff7b54)';
                        } else {
                            scrollProgressBar.style.background = 'linear-gradient(90deg, #FFD1A9, #ffb07a)';
                        }
                    }

                    // Calcular altura del header automáticamente
                    function setProgressBarPosition() {
                        const header = document.querySelector('.header-comunidad');
                        if (header) {
                            const headerHeight = header.offsetHeight;
                            scrollProgressContainer.style.top = headerHeight + 'px';
                        }
                    }

                    // Actualizar al cargar y al hacer scroll
                    window.addEventListener('load', updateScrollProgress);
                    window.addEventListener('scroll', updateScrollProgress);
                    window.addEventListener('resize', updateScrollProgress);

                    // Llamar al cargar y al redimensionar
                    window.addEventListener('load', function() {
                        setProgressBarPosition();
                        updateScrollProgress();
                    });
                    window.addEventListener('resize', setProgressBarPosition);
                    
                    console.log('✅ Barra de progreso de scroll configurada correctamente');
                } else {
                    console.warn('⚠️ Elementos de la barra de progreso no encontrados');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar barra de progreso de scroll:', error);
                resolve();
            }
        });
    }

    // BLOQUE 8: Panel de acciones expandible - Parte inferior de la pantalla
    function setupActionPanel() {
        return new Promise((resolve) => {
            try {
                const panelExpansion = document.getElementById('panelExpansion');
                const viewMoreBtn = document.getElementById('viewMoreBtn');
                const viewMoreText = document.getElementById('viewMoreText');
                const viewMoreIcon = document.querySelector('#viewMoreBtn i');
                
                if (panelExpansion && viewMoreBtn && viewMoreText && viewMoreIcon) {
                    // Función para expandir/contraer el panel
                    window.togglePanel = function() {
                        // Prevenir múltiples ejecuciones
                        if (window.togglePanel.isExecuting) {
                            return;
                        }
                        window.togglePanel.isExecuting = true;
                        
                        setTimeout(() => {
                            window.togglePanel.isExecuting = false;
                        }, 300);
                        
                        if (panelExpansion.classList.contains('expanded')) {
                            // Contraer el panel
                            panelExpansion.classList.remove('expanded');
                            viewMoreBtn.classList.remove('expanded');
                            viewMoreText.textContent = 'Ver más';
                            viewMoreIcon.className = 'fas fa-ellipsis-h';
                            document.body.style.overflow = '';
                            console.log('📱 Panel de acciones cerrado');
                        } else {
                            // Expandir el panel
                            panelExpansion.classList.add('expanded');
                            viewMoreBtn.classList.add('expanded');
                            viewMoreText.textContent = 'Ver menos';
                            viewMoreIcon.className = 'fas fa-compress';
                            document.body.style.overflow = 'hidden';
                            console.log('📱 Panel de acciones abierto');
                        }
                    }
                    
                    // Función para verificar si el panel está expandido
                    window.isPanelExpanded = function() {
                        return panelExpansion.classList.contains('expanded');
                    }
                    
                    // Función para establecer el overflow correcto basado en el estado del panel
                    window.setCorrectOverflow = function() {
                        if (window.isPanelExpanded()) {
                            document.body.style.overflow = 'hidden';
                        } else {
                            document.body.style.overflow = '';
                        }
                    }
                    
                    // Asignar la función al botón (solo si no tiene onclick en HTML)
                    if (!viewMoreBtn.hasAttribute('onclick')) {
                        viewMoreBtn.addEventListener('click', window.togglePanel);
                        console.log('🔧 Event listener agregado al botón del panel');
                    } else {
                        console.log('🔧 Botón del panel ya tiene onclick en HTML');
                    }
                    
                    console.log('✅ Panel de acciones expandible configurado correctamente');
                } else {
                    console.warn('⚠️ Elementos del panel de acciones no encontrados');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar panel de acciones:', error);
                resolve();
            }
        });
    }

    // BLOQUE 9: Función para compartir la página
    function setupShareFunction() {
        return new Promise((resolve) => {
            try {
                // Asignar event listener al botón de compartir si existe
                const shareBtn = document.getElementById('shareBtn');
                if (shareBtn) {
                    shareBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        window.sharePage();
                    });
                }
                // Compatibilidad: también buscar 'shareButton'
                const shareButton = document.getElementById('shareButton');
                if (shareButton) {
                    shareButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        window.sharePage();
                    });
                }
                // Función principal para compartir
                window.sharePage = function() {
                    console.log('📤 Función de compartir activada');
                    const pageTitle = document.title || 'CGN - Comunidad Gaming Network';
                    const pageUrl = window.location.href;
                    
                    // Verificar si la API Web Share está disponible
                    if (navigator.share) {
                        navigator.share({
                            title: pageTitle,
                            url: pageUrl,
                            text: '¡Mira esta página de la Comunidad Gaming Network!'
                        }).then(() => {
                            console.log('✅ Contenido compartido exitosamente');
                        }).catch((error) => {
                            console.log('❌ Error al compartir:', error);
                            // Fallback: copiar URL al portapapeles
                            window.fallbackShare();
                        });
                    } else {
                        // Fallback para navegadores que no soportan Web Share API
                        window.fallbackShare();
                    }
                }
                
                // Función de respaldo para compartir
                window.fallbackShare = function() {
                    const pageUrl = window.location.href;
                    
                    // Intentar copiar al portapapeles
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(pageUrl).then(() => {
                            // Mostrar notificación de éxito
                            window.showShareNotification('¡URL copiada al portapapeles!');
                        }).catch(() => {
                            // Si falla clipboard, mostrar URL en alert
                            alert('Comparte esta URL: ' + pageUrl);
                        });
                    } else {
                        // Fallback final: mostrar URL en alert
                        alert('Comparte esta URL: ' + pageUrl);
                    }
                }
                
                // Función para mostrar notificación de compartir
                window.showShareNotification = function(message) {
                    // Crear elemento de notificación
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background-color: rgba(255, 209, 169, 0.95);
                        color: #374151;
                        padding: 12px 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        z-index: 10000;
                        font-size: 14px;
                        font-weight: 500;
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        transform: translateX(100%);
                        transition: transform 0.3s ease;
                    `;
                    notification.textContent = message;
                    
                    // Agregar al DOM
                    document.body.appendChild(notification);
                    
                    // Animar entrada
                    setTimeout(() => {
                        notification.style.transform = 'translateX(0)';
                    }, 100);
                    
                    // Remover después de 3 segundos
                    setTimeout(() => {
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }, 3000);
                }
                
                console.log('✅ Funciones de compartir configuradas correctamente');
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar funciones de compartir:', error);
                resolve();
            }
        });
    }

    // BLOQUE 10: Sistema de temas (claro/oscuro/automático/eficiencia)
    function setupThemeSystem() {
        return new Promise((resolve) => {
            try {
                const themeBtns = document.querySelectorAll('.theme-btn');
                
                if (themeBtns.length > 0) {
                    // Función simplificada para cambiar tema usando variables CSS
                    function setTheme(theme) {
                        const root = document.documentElement;
                        
                        if (theme === 'dark') {
                            root.setAttribute('data-theme', 'dark');
                            console.log('🌙 Tema oscuro activado');
                        } else {
                            root.removeAttribute('data-theme');
                            console.log('☀️ Tema claro activado');
                        }
                    }
                    
                    themeBtns.forEach(btn => {
                        btn.addEventListener('click', function() {
                            console.log('🎨 Tema cambiado:', btn.textContent.trim());
                            themeBtns.forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');

                            // Guardar preferencia en localStorage
                            let theme = btn.textContent.trim().toLowerCase();
                            let themeValue = 'light'; // por defecto
                            
                            if (theme.includes('oscuro')) {
                                localStorage.setItem('preferencia-tema', 'oscuro');
                                themeValue = 'dark';
                            } else if (theme.includes('claro')) {
                                localStorage.setItem('preferencia-tema', 'claro');
                                themeValue = 'light';
                            } else if (theme.includes('automático') || theme.includes('automatico')) {
                                localStorage.setItem('preferencia-tema', 'automatico');
                                // Automático: modo oscuro de 20:00 a 7:00, claro el resto
                                const hour = new Date().getHours();
                                themeValue = (hour >= 20 || hour < 7) ? 'dark' : 'light';
                            } else if (theme.includes('eficiencia')) {
                                localStorage.setItem('preferencia-tema', 'eficiencia');
                                // Eficiencia: modo oscuro si el ahorro de energía está activo
                                if (navigator.getBattery) {
                                    navigator.getBattery().then(function(battery) {
                                        if (battery && battery.savePower) {
                                            setTheme('dark');
                                        } else if (battery && battery.dischargingTime === Infinity && battery.charging) {
                                            setTheme('light');
                                        } else if (battery && battery.charging === false && battery.level < 0.2) {
                                            setTheme('dark');
                                        } else if (battery && battery.level < 0.15) {
                                            setTheme('dark');
                                        } else {
                                            setTheme('light');
                                        }
                                    }).catch(function() {
                                        setTheme('light');
                                    });
                                } else if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                    // fallback: si el usuario tiene preferencias de ahorro de energía
                                    setTheme('dark');
                                } else {
                                    setTheme('light');
                                }
                                return; // Salir aquí para evitar setTheme duplicado
                            }

                            // Aplicar tema
                            setTheme(themeValue);
                        });
                    });

                    // Al cargar la página, aplicar la preferencia guardada
                    function activarTemaGuardado() {
                        const temaGuardado = localStorage.getItem('preferencia-tema');
                        if (!temaGuardado) return;
                        
                        let btnToClick = null;
                        themeBtns.forEach(btn => {
                            let theme = btn.textContent.trim().toLowerCase();
                            if (
                                (temaGuardado === 'oscuro' && theme.includes('oscuro')) ||
                                (temaGuardado === 'claro' && theme.includes('claro')) ||
                                (temaGuardado === 'automatico' && (theme.includes('automático') || theme.includes('automatico'))) ||
                                (temaGuardado === 'eficiencia' && theme.includes('eficiencia'))
                            ) {
                                btnToClick = btn;
                            }
                        });
                        if (btnToClick) btnToClick.click();
                    }
                    activarTemaGuardado();
                    
                    console.log('✅ Sistema de temas simplificado configurado correctamente');
                } else {
                    console.warn('⚠️ Botones de tema no encontrados');
                    // NUEVO: Aplicar el tema guardado aunque no haya botones
                    const temaGuardado = localStorage.getItem('preferencia-tema');
                    if (temaGuardado === 'oscuro') {
                        document.documentElement.setAttribute('data-theme', 'dark');
                        console.log('🌙 Tema oscuro aplicado por preferencia guardada (sin botones)');
                    } else if (temaGuardado === 'claro') {
                        document.documentElement.removeAttribute('data-theme');
                        console.log('☀️ Tema claro aplicado por preferencia guardada (sin botones)');
                    } else if (temaGuardado === 'automatico') {
                        const hour = new Date().getHours();
                        if (hour >= 20 || hour < 7) {
                            document.documentElement.setAttribute('data-theme', 'dark');
                            console.log('🌙 Tema oscuro automático aplicado (sin botones)');
                        } else {
                            document.documentElement.removeAttribute('data-theme');
                            console.log('☀️ Tema claro automático aplicado (sin botones)');
                        }
                    }
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar sistema de temas:', error);
                resolve();
            }
        });
    }

    // BLOQUE 11: Popup de ayuda para el sistema de temas
    function setupThemeHelpPopup() {
        return new Promise((resolve) => {
            try {
                const helpBtn = document.getElementById('themeHelpBtn');
                const helpPopup = document.getElementById('themeHelpPopup');
                const closeHelp = document.getElementById('closeThemeHelp');
                
                if (helpBtn && helpPopup && closeHelp) {
                    helpBtn.addEventListener('click', function(e) {
                        console.log('❓ Popup de ayuda de temas activado');
                        e.preventDefault();
                        e.stopPropagation();
                        helpPopup.classList.add('active');
                    });
                    
                    closeHelp.addEventListener('click', function() {
                        console.log('❌ Popup de ayuda de temas cerrado');
                        helpPopup.classList.remove('active');
                    });
                    
                    // Cerrar al hacer clic fuera del popup
                    document.addEventListener('mousedown', function(e) {
                        if (helpPopup.classList.contains('active') && !helpPopup.contains(e.target) && e.target !== helpBtn) {
                            helpPopup.classList.remove('active');
                        }
                    });
                    
                    console.log('✅ Popup de ayuda de temas configurado correctamente');
                } else {
                    console.warn('⚠️ Elementos del popup de ayuda de temas no encontrados');
                }
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar popup de ayuda de temas:', error);
                resolve();
            }
        });
    }

    // BLOQUE 12: Optimización de LCP (Largest Contentful Paint)
    function setupLCPOptimization() {
        return new Promise((resolve) => {
            try {
                // Precargar imágenes críticas
                const criticalImages = [
                    '/icons/Logo-CGN.avif',
                    '/imagenes/IMG-IA/Vistas-edificio2.avif',
                    '/icons/Bandera-jal.avif',
                    '/icons/bot-hecks.avif'
                ];
                
                // Función para precargar imágenes
                function preloadCriticalImages() {
                    criticalImages.forEach(src => {
                        const link = document.createElement('link');
                        link.rel = 'preload';
                        link.as = 'image';
                        link.href = src;
                        document.head.appendChild(link);
                    });
                    console.log('🖼️ Imágenes críticas precargadas');
                }
                
                // Optimizar carga de imágenes no críticas
                function optimizeNonCriticalImages() {
                    const images = document.querySelectorAll('img:not([loading])');
                    images.forEach(img => {
                        if (!img.classList.contains('header-logo') && 
                            !img.classList.contains('bienvenida-gdl-fondo') &&
                            !img.classList.contains('cgn-icon') &&
                            !img.id !== 'chatImage') {
                            img.loading = 'lazy';
                            img.decoding = 'async';
                        }
                    });
                    console.log('⚡ Imágenes no críticas optimizadas con lazy loading');
                }
                
                // Optimizar imágenes de fondo
                function optimizeBackgroundImages() {
                    const backgroundImages = [
                        '/imagenes/IMG-IA/Vistas-edificio1.avif',
                        '/imagenes/IMG-IA/Vistas-edificio2.avif',
                        '/imagenes/IMG-IA/Vistas-edificio3.avif',
                        '/imagenes/IMG-IA/Vistas-edificio4.avif',
                        '/imagenes/Fondos-BS/Fondo-basico1.avif',
                        '/imagenes/Fondos-BS/Fondo-basico2.avif',
                        '/imagenes/Fondos-BS/Fondo-basico3.avif',
                        '/imagenes/Fondos-BS/Fondo-basico4.avif',
                        '/imagenes/Fondos-BS/Fondo-basico5.avif',
                        '/imagenes/Fondos-BS/Fondo-basico6.avif'
                    ];
                    
                    // Precargar imágenes de fondo en segundo plano
                    backgroundImages.forEach(src => {
                        const img = new Image();
                        img.src = src;
                    });
                    console.log('🎨 Imágenes de fondo precargadas en segundo plano');
                }
                
                // Ejecutar optimizaciones
                preloadCriticalImages();
                optimizeNonCriticalImages();
                optimizeBackgroundImages();
                
                console.log('✅ Optimizaciones de LCP configuradas correctamente');
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar optimizaciones de LCP:', error);
                resolve();
            }
        });
    }

    // BLOQUE 13: Sistema de aviso de instalación de PWA
    function setupPWAInstallPrompt() {
        return new Promise((resolve) => {
            try {
                const prompt = document.getElementById('install-prompt');
                const installModal = document.getElementById('install-modal');
                const installModalClose = document.getElementById('installModalClose');
                
                // Solo mostrar si NO está en modo standalone (PWA)
                const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
                
                if (!isStandalone && prompt) {
                    prompt.style.display = 'block';
                    
                    // Botón de cerrar opcional
                    if (!prompt.querySelector('.close-prompt')) {
                        const closeBtn = document.createElement('button');
                        closeBtn.type = 'button'; // <-- Solución: evitar submit por defecto
                        closeBtn.className = 'close-prompt';
                        closeBtn.innerHTML = '×';
                        closeBtn.style.cssText = `
                            position: absolute;
                            top: -8px;
                            right: 8px;
                            background: rgba(0, 0, 0, 0.7);
                            border: none;
                            color: white;
                            font-size: 16px;
                            cursor: pointer;
                            padding: 0;
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            z-index: 1001;
                            transition: background-color 0.2s ease;
                        `;
                        
                        closeBtn.addEventListener('click', function(event) {
                            event.preventDefault();
                            event.stopPropagation(); // <-- Añadido para evitar burbujeo
                            prompt.style.display = 'none';
                            setTimeout(function() {
                                showInstallModal();
                            }, 300);
                            return false; // <-- Fallback extra
                        });
                        
                        closeBtn.addEventListener('mouseenter', function() {
                            this.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        });
                        
                        closeBtn.addEventListener('mouseleave', function() {
                            this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        });
                        
                        prompt.appendChild(closeBtn);
                    }
                }
                
                // Función para mostrar la tarjeta emergente
                function showInstallModal() {
                    if (installModal) {
                        lastScrollY = window.scrollY;
                        installModal.classList.add('show');
                        document.body.classList.add('modal-open'); // Usar clase CSS para ocultar scroll
                        document.body.style.top = `-${lastScrollY}px`;
                    }
                }
                
                // Función para ocultar la tarjeta emergente
                function hideInstallModal() {
                    if (installModal) {
                        installModal.classList.remove('show');
                        document.body.classList.remove('modal-open'); // Remover clase CSS
                        document.body.style.top = '';
                        window.scrollTo(0, lastScrollY);
                    }
                }
                
                // Event listener para cerrar la tarjeta emergente SOLO con el botón X
                if (installModalClose) {
                    installModalClose.addEventListener('click', hideInstallModal);
                }
                
                // Eliminados: cierre con clic fuera y tecla Escape
                // Solo se puede cerrar con el botón X
                
                console.log('✅ Sistema de aviso de instalación de PWA configurado correctamente');
                resolve();
            } catch (error) {
                console.error('❌ Error al configurar sistema de aviso de instalación de PWA:', error);
                resolve();
            }
        });
    }

    // Array de tareas en orden de ejecución
    const tasks = [
        { name: 'Control Loader', fn: setupLoader },
        { name: 'Actualizar Año', fn: updateFooterYear },
        { name: 'Botón Volver', fn: setupBackButton },
        { name: 'Botón Volver Arriba', fn: setupBackToTopButton },
        { name: 'Botón Ir al Final', fn: setupGoToBottomButton },
        { name: 'Menú Desplegable', fn: setupDropdownMenu },
        { name: 'Barra de Progreso', fn: setupScrollProgressBar },
        { name: 'Panel de Acciones', fn: setupActionPanel },
        { name: 'Función Compartir', fn: setupShareFunction },
        { name: 'Sistema de Temas', fn: setupThemeSystem },
        { name: 'Popup de Ayuda', fn: setupThemeHelpPopup },
        { name: 'Optimización LCP', fn: setupLCPOptimization },
        { name: 'Aviso PWA', fn: setupPWAInstallPrompt }
    ];

    // Iniciar monitoreo de recursos externos inmediatamente
    setupStylesheetMonitoring().then(() => {
        console.log('🎨 Monitoreo de CSS iniciado en paralelo');
    });
    
    setupScriptMonitoring().then(() => {
        console.log('📜 Monitoreo de scripts externos iniciado en paralelo');
    });

    // Motor secuenciador de tareas con progreso combinado (CSS + JS)
    tasks.reduce((chain, task) => {
        return chain
            .then(() => task.fn())
            .then(async () => {
                completed++;
                const jsPercentage = Math.round((completed / tasks.length) * 100);
                const cssPercentage = stylesheetsCompleted ? 100 : Math.round((stylesheetsLoaded / totalStylesheets) * 100);
                const scriptsPercentage = scriptsCompleted ? 100 : Math.round((scriptsLoaded / totalScripts) * 100);
                
                // Usar progreso combinado si hay recursos externos para monitorear
                if (totalStylesheets > 0 || totalScripts > 0) {
                    updateCombinedProgress(task.name, jsPercentage, cssPercentage, scriptsPercentage);
                } else {
                    updateLoadingProgress(task.name, jsPercentage);
                }
                
                // Pausa mínima para permitir repaint y mostrar progreso
                await new Promise(r => setTimeout(r, 20));
            })
            .catch(async (err) => {
                console.warn(`Error en ${task.name}`, err);
                completed++;
                const jsPercentage = Math.round((completed / tasks.length) * 100);
                const cssPercentage = stylesheetsCompleted ? 100 : Math.round((stylesheetsLoaded / totalStylesheets) * 100);
                const scriptsPercentage = scriptsCompleted ? 100 : Math.round((scriptsLoaded / totalScripts) * 100);
                
                // Usar progreso combinado si hay recursos externos para monitorear
                if (totalStylesheets > 0 || totalScripts > 0) {
                    updateCombinedProgress(`${task.name} (error)`, jsPercentage, cssPercentage, scriptsPercentage);
                } else {
                    updateLoadingProgress(`${task.name} (error)`, jsPercentage);
                }
                
                // Pausa mínima incluso en caso de error
                await new Promise(r => setTimeout(r, 20));
            });
    }, Promise.resolve())
    .then(async () => {
        const finalJsPercentage = 100;
        const finalCssPercentage = stylesheetsCompleted ? 100 : Math.round((stylesheetsLoaded / totalStylesheets) * 100);
        const finalScriptsPercentage = scriptsCompleted ? 100 : Math.round((scriptsLoaded / totalScripts) * 100);
        
        if (totalStylesheets > 0 || totalScripts > 0) {
            updateCombinedProgress('Finalizado', finalJsPercentage, finalCssPercentage, finalScriptsPercentage);
        } else {
            updateLoadingProgress('Finalizado', finalJsPercentage);
        }
        
        // Pausa final antes de ocultar el loader
        await new Promise(r => setTimeout(r, 500));
        hideLoader();
        
        // NOTIFICACIÓN PARA OVERLAY INDEPENDIENTE
        // Disparar evento personalizado para notificar que el JS principal ha terminado
        if (typeof window !== 'undefined') {
            // Crear evento personalizado
            const mainScriptCompletedEvent = new CustomEvent('mainScriptCompleted', {
                detail: {
                    timestamp: Date.now(),
                    tasksCompleted: completed,
                    totalTasks: tasks.length,
                    stylesheetsLoaded: stylesheetsLoaded,
                    totalStylesheets: totalStylesheets,
                    scriptsLoaded: scriptsLoaded,
                    totalScripts: totalScripts
                }
            });
            
            // Disparar el evento
            window.dispatchEvent(mainScriptCompletedEvent);
            
            // También establecer una propiedad global para compatibilidad
            window.mainScriptCompleted = true;
            window.mainScriptCompletionTime = Date.now();
            
            console.log('🎉 [JS Principal] Notificación enviada a overlay independiente');
        }
    });

});