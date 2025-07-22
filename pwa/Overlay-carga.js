// ==============================
//
// Overlay de carga inteligente y reutilizable
//
//  <script src="/pwa/Overlay-carga.js"></script>
//
// ==============================

const loadingConfig = {
  active: true,
  title: "Cargando...",
  version: "V2.1",
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
  // Opción para controlar el delay inicial
  initialDelay: 500      // Delay antes de iniciar el desvanecimiento
};

// Implementación completa
document.addEventListener('DOMContentLoaded', function() {
  if (!loadingConfig.active) return;
  
  // Inyectar estilos CSS
  if (!document.getElementById('loading-overlay-styles')) {
    const style = document.createElement('style');
    style.id = 'loading-overlay-styles';
    style.textContent = `

      
      body.loading-active {
        overflow: hidden;
      }
      
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${loadingConfig.backgroundColor};
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: ${loadingConfig.zIndex};
        transition: opacity 0.5s ease, visibility 0.5s ease;
      }
      
      .loading-overlay.hidden {
        opacity: 0;
        visibility: hidden;
      }
      
      .loading-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid ${loadingConfig.spinnerColor};
        border-top: 4px solid ${loadingConfig.spinnerTopColor};
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      .loading-text {
        position: absolute;
        top: 80px;
        color: ${loadingConfig.textColor};
        font-weight: 600;
        font-size: 14px;
        text-align: center;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
      }
      
      .loading-version {
        position: absolute;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
        color: ${loadingConfig.textColor};
        font-size: 1.1em;
        letter-spacing: 2px;
        text-align: center;
        opacity: 0.85;
        z-index: 2;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .loading-overlay.dark-theme {
        background-color: ${loadingConfig.darkBackgroundColor};
      }
      
      .loading-overlay.dark-theme .loading-spinner {
        border-color: ${loadingConfig.spinnerColor};
        border-top-color: ${loadingConfig.spinnerTopColor};
      }
      
      .loading-overlay.dark-theme .loading-text {
        color: ${loadingConfig.darkTextColor};
      }
      
      .loading-overlay.dark-theme .loading-version {
        color: ${loadingConfig.darkVersionColor};
      }
      
      .main-content {
        opacity: 0;
        transition: opacity 1s ease;
      }
      
      .main-content.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Crear elemento overlay
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loadingOverlay';
  
  // Verificar si el tema oscuro está activo
  const isDarkTheme = document.body.classList.contains('dark-theme') || 
                     document.documentElement.getAttribute('data-theme') === 'dark';
  
  if (isDarkTheme) {
    overlay.classList.add('dark-theme');
  }
  
  // Construir contenido del overlay
  overlay.innerHTML = `
    <div style="position: relative;">
      <div class="loading-spinner"></div>
      <div class="loading-text" id="loadingText">${loadingConfig.title}</div>
    </div>
    ${loadingConfig.showVersion ? `<div class="loading-version">${loadingConfig.version}</div>` : ''}
  `;
  
  // Variables de control
  let completed = 0;
  let totalTasks = 0;
  let overlayHidden = false;
  let stylesheetsLoaded = 0;
  let totalStylesheets = 0;
  let stylesheetsCompleted = false;
  let scriptsLoaded = 0;
  let totalScripts = 0;
  let scriptsCompleted = false;
  
  // Función para actualizar el progreso de carga
  function updateLoadingProgress(message, percentage) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
      loadingText.textContent = `${message} (${percentage}%)`;
      console.log(`🔄 ${message} - ${percentage}%`);
    }
  }
  
  // Función para actualizar progreso combinado
  function updateCombinedProgress(jsTask, jsPercentage, cssPercentage, scriptsPercentage) {
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
  
  // Función para ocultar el loader al finalizar (basada en la implementación original)
  function hideLoader() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMEN DE CARGA COMPLETA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎨 Hojas de estilo cargadas: ${stylesheetsLoaded}/${totalStylesheets}`);
    console.log(`📜 Scripts externos cargados: ${scriptsLoaded}/${totalScripts}`);
    console.log(`📋 Scripts internos totales: ${totalTasks}`);
    console.log(`✅ Scripts internos ejecutados: ${completed}`);
    console.log(`📈 Porcentaje de éxito CSS: ${Math.round((stylesheetsLoaded / totalStylesheets) * 100)}%`);
    console.log(`📈 Porcentaje de éxito Scripts: ${Math.round((scriptsLoaded / totalScripts) * 100)}%`);
    console.log(`📈 Porcentaje de éxito JS interno: ${Math.round((completed / totalTasks) * 100)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Todos los recursos se han cargado correctamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!overlayHidden) {
      overlayHidden = true;
      
      // Delay inicial para mostrar el progreso final
      setTimeout(() => {
        console.log('🎬 Iniciando efecto de desvanecimiento...');
        
        // Aplicar la clase hidden para activar la transición CSS
        overlay.classList.add('hidden');
        
        // Mostrar contenido principal
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.classList.add('loaded');
        
        // Remover clases del body después de la transición
        setTimeout(() => {
          document.body.classList.remove('loading-active');
          console.log('✅ Página completamente cargada con efecto de desvanecimiento');
        }, 500); // Duración de la transición CSS original
        
      }, loadingConfig.initialDelay); // Delay inicial para apreciar el progreso final
    }
  }
  
  // Monitoreo de hojas de estilos CSS
  function setupStylesheetMonitoring() {
    return new Promise((resolve) => {
      try {
        const stylesheets = Array.from(document.styleSheets);
        const externalStylesheets = stylesheets.filter(sheet => {
          try {
            return sheet.href && sheet.href.startsWith(window.location.origin);
          } catch (e) {
            return false;
          }
        });

        const knownStylesheets = [
          '/HECKS-BOT/estilos.css',
          '/pwa/estilos.css',
          '/pwa/temas.css',
          '/pwa/componentes.css',
          '/pwa/panel-de-acciones/estilos-PA.css'
        ];

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

        function checkStylesheetLoaded(href) {
          return new Promise((resolve) => {
            const existingLink = document.querySelector(`link[href="${href}"]`);
            if (existingLink) {
              stylesheetsLoaded++;
              console.log(`✅ CSS ya cargado: ${href} (${stylesheetsLoaded}/${totalStylesheets})`);
              
              if (stylesheetsLoaded >= totalStylesheets) {
                stylesheetsCompleted = true;
                console.log('🎨 Todas las hojas de estilo han sido cargadas');
              }
              resolve();
              return;
            }

            const sheetExists = Array.from(document.styleSheets).some(sheet => {
              try {
                return sheet.href && sheet.href.includes(href.split('/').pop());
              } catch (e) {
                return false;
              }
            });

            if (sheetExists) {
              stylesheetsLoaded++;
              console.log(`✅ CSS detectado en styleSheets: ${href} (${stylesheetsLoaded}/${totalStylesheets})`);
              
              if (stylesheetsLoaded >= totalStylesheets) {
                stylesheetsCompleted = true;
                console.log('🎨 Todas las hojas de estilo han sido cargadas');
              }
              resolve();
              return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            link.onload = () => {
              stylesheetsLoaded++;
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
            
            document.head.appendChild(link);
            
            setTimeout(() => {
              if (link.sheet) {
                stylesheetsLoaded++;
                console.log(`✅ CSS verificado por timeout: ${href} (${stylesheetsLoaded}/${totalStylesheets})`);
              }
              resolve();
            }, 200);
          });
        }

        function updateCSSProgress() {
          const cssPercentage = Math.round((stylesheetsLoaded / totalStylesheets) * 100);
          console.log(`🎨 Progreso CSS: ${stylesheetsLoaded}/${totalStylesheets} (${cssPercentage}%)`);
          
          if (completed > 0) {
            const jsPercentage = Math.round((completed / totalTasks) * 100);
            const scriptsPercentage = scriptsCompleted ? 100 : Math.round((scriptsLoaded / totalScripts) * 100);
            updateCombinedProgress('Monitoreando recursos', jsPercentage, cssPercentage, scriptsPercentage);
          }
        }

        Promise.all(allStylesheets.map(checkStylesheetLoaded))
          .then(() => {
            stylesheetsCompleted = true;
            console.log('🎨 Monitoreo de hojas de estilo completado');
            updateCSSProgress();
            resolve();
          })
          .catch((error) => {
            console.error('❌ Error en monitoreo de hojas de estilo:', error);
            stylesheetsCompleted = true;
            resolve();
          });

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

  // Monitoreo de scripts JavaScript externos
  function setupScriptMonitoring() {
    return new Promise((resolve) => {
      try {
        const scripts = Array.from(document.scripts);
        const externalScripts = scripts.filter(script => {
          return script.src && script.src.startsWith(window.location.origin);
        });

        const knownScripts = [
          '/HECKS-BOT/javascript.js',
          '/pwa/noticias.js',
          '/pwa/javascript.js'
        ];

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

        function checkScriptLoaded(src) {
          return new Promise((resolve) => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
              scriptsLoaded++;
              console.log(`✅ Script ya cargado: ${src} (${scriptsLoaded}/${totalScripts})`);
              
              if (scriptsLoaded >= totalScripts) {
                scriptsCompleted = true;
                console.log('📜 Todos los scripts externos han sido cargados');
              }
              resolve();
              return;
            }

            const scriptExists = Array.from(document.scripts).some(script => {
              return script.src && script.src.includes(src.split('/').pop());
            });

            if (scriptExists) {
              scriptsLoaded++;
              console.log(`✅ Script detectado en document.scripts: ${src} (${scriptsLoaded}/${totalScripts})`);
              
              if (scriptsLoaded >= totalScripts) {
                scriptsCompleted = true;
                console.log('📜 Todos los scripts externos han sido cargados');
              }
              resolve();
              return;
            }

            const script = document.createElement('script');
            script.src = src;
            
            script.onload = () => {
              scriptsLoaded++;
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
            
            document.head.appendChild(script);
            
            setTimeout(() => {
              if (script.src) {
                scriptsLoaded++;
                console.log(`✅ Script verificado por timeout: ${src} (${scriptsLoaded}/${totalScripts})`);
              }
              resolve();
            }, 200);
          });
        }

        function updateScriptsProgress() {
          const scriptsPercentage = Math.round((scriptsLoaded / totalScripts) * 100);
          console.log(`📜 Progreso Scripts: ${scriptsLoaded}/${totalScripts} (${scriptsPercentage}%)`);
          
          if (completed > 0) {
            const jsPercentage = Math.round((completed / totalTasks) * 100);
            const cssPercentage = stylesheetsCompleted ? 100 : Math.round((stylesheetsLoaded / totalStylesheets) * 100);
            updateCombinedProgress('Monitoreando recursos', jsPercentage, cssPercentage, scriptsPercentage);
          }
        }

        Promise.all(allScripts.map(checkScriptLoaded))
          .then(() => {
            scriptsCompleted = true;
            console.log('📜 Monitoreo de scripts externos completado');
            updateScriptsProgress();
            resolve();
          })
          .catch((error) => {
            console.error('❌ Error en monitoreo de scripts externos:', error);
            scriptsCompleted = true;
            resolve();
          });

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

  // Tareas de inicialización básicas
  const basicTasks = [
    { name: 'Inicialización', fn: () => Promise.resolve() },
    { name: 'Configuración', fn: () => Promise.resolve() },
    { name: 'Preparación', fn: () => Promise.resolve() }
  ];

  totalTasks = basicTasks.length;
  completed = 0;

  // Agregar overlay al documento
  document.body.appendChild(overlay);
  document.body.classList.add('loading-active');

  // Iniciar monitoreo de recursos
  setupStylesheetMonitoring().then(() => {
    console.log('🎨 Monitoreo de CSS iniciado en paralelo');
  });
  
  setupScriptMonitoring().then(() => {
    console.log('📜 Monitoreo de scripts externos iniciado en paralelo');
  });

  // Ejecutar tareas básicas
  basicTasks.reduce((chain, task) => {
    return chain
      .then(() => task.fn())
      .then(async () => {
        completed++;
        const jsPercentage = Math.round((completed / totalTasks) * 100);
        const cssPercentage = stylesheetsCompleted ? 100 : Math.round((stylesheetsLoaded / totalStylesheets) * 100);
        const scriptsPercentage = scriptsCompleted ? 100 : Math.round((scriptsLoaded / totalScripts) * 100);
        
        if (totalStylesheets > 0 || totalScripts > 0) {
          updateCombinedProgress(task.name, jsPercentage, cssPercentage, scriptsPercentage);
        } else {
          updateLoadingProgress(task.name, jsPercentage);
        }
        
        await new Promise(r => setTimeout(r, 20));
      })
      .catch(async (err) => {
        console.warn(`Error en ${task.name}`, err);
        completed++;
        const jsPercentage = Math.round((completed / totalTasks) * 100);
        const cssPercentage = stylesheetsCompleted ? 100 : Math.round((stylesheetsLoaded / totalStylesheets) * 100);
        const scriptsPercentage = scriptsCompleted ? 100 : Math.round((scriptsLoaded / totalScripts) * 100);
        
        if (totalStylesheets > 0 || totalScripts > 0) {
          updateCombinedProgress(`${task.name} (error)`, jsPercentage, cssPercentage, scriptsPercentage);
        } else {
          updateLoadingProgress(`${task.name} (error)`, jsPercentage);
        }
        
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
    
    await new Promise(r => setTimeout(r, 800));
    hideLoader();
  });

  // Exponer funciones para uso externo
  window.loadingOverlay = {
    updateProgress: updateLoadingProgress,
    hide: hideLoader,
    show: () => {
      overlay.classList.remove('hidden');
      document.body.classList.add('loading-active');
      overlayHidden = false;
    },
    // Función para mostrar con efecto de aparición
    showWithFade: () => {
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(0.95)';
      overlay.classList.remove('hidden');
      document.body.classList.add('loading-active');
      overlayHidden = false;
      
      // Aplicar efecto de aparición
      setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.style.transform = 'scale(1)';
      }, 50);
    }
  };
}); 