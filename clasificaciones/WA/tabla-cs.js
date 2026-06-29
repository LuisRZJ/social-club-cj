// Configuración por defecto
const config = {
    excludeKeywords: [
        'solicitó unirse', 'salió del grupo', 'se unió', 'null',
        'cambió tu código de seguridad', 'creaste este grupo', 'cambió el asunto',
        'cambió la foto del grupo', 'eliminó este mensaje', 'eliminaste este mensaje',
        'se unió usando el enlace de invitación', 'el administrador cambió la configuración del grupo',
        'el administrador cambió los permisos de los participantes',
        'el administrador cambió la configuración de los mensajes temporales',
        'ahora eres admin. del grupo', 'te uniste desde la comunidad',
        'Toca para obtener más información', 'Toca para cambiar esto',
        'se fue y no podrá ver tu mensaje', 'se editó este mensaje',
        'se unieron desde la comunidad', 'cambiaste el nombre del grupo', 'cambiaste el ícono del grupo',
        'cambiaste los ajustes', 'activaste la aprobación de los admins',
        'desactivaste la aprobación de los admins', 'eliminaste a',
        'creaste el grupo', 'se eliminó este mensaje',
        'se añadió a'
    ],
    countryCodes: null, // Se cargará dinámicamente
    flagsApiUrl: 'https://flagsapi.com',
    flagStyle: 'shiny', // Opciones: flat, shiny
    flagSize: '24' // Tamaño de la bandera en píxeles
};

// Permite pasar excludeKeywords personalizado
function setExcludeKeywords(keywords) {
    config.excludeKeywords = keywords;
}

// La base de datos de equivalencias se cargará desde un archivo externo (equivalencias.js)
// Se espera que el archivo defina window.equivalencias
function normalizarRemitente(nombre) {
    if (window.equivalencias && typeof window.equivalencias === 'object') {
        return window.equivalencias[nombre] || nombre;
    }
    return nombre;
}

// --- Función para aplicar modo oscuro a la tabla ---
function aplicarModoOscuroTabla() {
    const tabla = document.querySelector('.chat-top-table');
    if (!tabla) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
        tabla.classList.add('tabla-modo-oscuro');
    } else {
        tabla.classList.remove('tabla-modo-oscuro');
    }
}

// Observar cambios de tema
const observer = new MutationObserver(aplicarModoOscuroTabla);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
// También aplicar al cargar
document.addEventListener('DOMContentLoaded', () => {
    aplicarModoOscuroTabla();
    cargarCodigosPais();
});

// Función para cargar los códigos de país desde el archivo JSON
async function cargarCodigosPais() {
    try {
        // Intentar cargar desde la ruta relativa al dominio
        let response = await fetch('/pwa/bases-de-datos/country-codes.json');
        
        // Si falla, intentar con ruta relativa al archivo actual
        if (!response.ok) {
            response = await fetch('../../pwa/bases-de-datos/country-codes.json');
        }
        
        // Si sigue fallando, intentar con ruta absoluta
        if (!response.ok) {
            const baseUrl = window.location.origin;
            response = await fetch(`${baseUrl}/pwa/bases-de-datos/country-codes.json`);
        }
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar el archivo: ${response.status}`);
        }
        
        const data = await response.json();
        config.countryCodes = data.countryCodes;
        config.countryNames = data.countryNames;
        console.log('Códigos de país cargados correctamente');
    } catch (error) {
        console.error('Error al cargar los códigos de país:', error);
        // Cargar datos de respaldo en caso de error
        cargarDatosRespaldo();
    }
}

// Función para cargar datos de respaldo en caso de error
function cargarDatosRespaldo() {
    console.log('Cargando datos de respaldo de códigos de país');
    // Incluir algunos códigos comunes como respaldo
    config.countryCodes = {
        "+1": "US",
        "+34": "ES",
        "+44": "GB",
        "+52": "MX",
        "+54": "AR",
        "+55": "BR",
        "+56": "CL",
        "+57": "CO",
        "+58": "VE",
        "+33": "FR",
        "+49": "DE",
        "+39": "IT",
        "+351": "PT"
    };
    
    config.countryNames = {
        "US": "Estados Unidos",
        "ES": "España",
        "GB": "Reino Unido",
        "MX": "México",
        "AR": "Argentina",
        "BR": "Brasil",
        "CL": "Chile",
        "CO": "Colombia",
        "VE": "Venezuela",
        "FR": "Francia",
        "DE": "Alemania",
        "IT": "Italia",
        "PT": "Portugal"
    };
}

// Función para detectar el código de país en un nombre de usuario
function detectarCodigoPais(nombre) {
    if (!nombre || typeof nombre !== 'string') return null;
    if (!config.countryCodes) return null;
    
    // Normalizar el nombre para manejar diferentes formatos
    const normalizedName = nombre.trim();
    
    // Detectar específicamente números de Jalisco (+52 33)
    if (normalizedName.match(/\+52\s*33/) || normalizedName.match(/^0052\s*33/)) {
        return {
            codigo: 'JAL', // Código personalizado para Jalisco
            codigoCompleto: '+52 33',
            nombre: 'Jalisco, México',
            esJalisco: true // Marcador para identificar que es Jalisco
        };
    }
    
    // Buscar patrones como +34 123456789 o +34123456789
    let match = normalizedName.match(/\+(\d{1,4})/);
    if (match && match[1]) {
        const prefix = `+${match[1]}`;
        
        // Buscar coincidencia exacta
        if (config.countryCodes[prefix]) {
            return {
                codigo: config.countryCodes[prefix],
                codigoCompleto: prefix,
                nombre: config.countryNames ? config.countryNames[config.countryCodes[prefix]] : ''
            };
        }
        
        // Si no hay coincidencia exacta, buscar el prefijo más largo que coincida
        const prefijos = Object.keys(config.countryCodes)
            .filter(p => prefix.startsWith(p))
            .sort((a, b) => b.length - a.length);
            
        if (prefijos.length > 0) {
            const prefijoEncontrado = prefijos[0];
            return {
                codigo: config.countryCodes[prefijoEncontrado],
                codigoCompleto: prefijoEncontrado,
                nombre: config.countryNames ? config.countryNames[config.countryCodes[prefijoEncontrado]] : ''
            };
        }
    }
    
    // Buscar formato 00XX (formato internacional sin +)
    match = normalizedName.match(/^00(\d{1,4})/);
    if (match && match[1]) {
        const prefix = `+${match[1]}`;
        
        // Buscar coincidencia exacta
        if (config.countryCodes[prefix]) {
            return {
                codigo: config.countryCodes[prefix],
                codigoCompleto: prefix,
                nombre: config.countryNames ? config.countryNames[config.countryCodes[prefix]] : ''
            };
        }
        
        // Si no hay coincidencia exacta, buscar el prefijo más largo que coincida
        const prefijos = Object.keys(config.countryCodes)
            .filter(p => prefix.startsWith(p))
            .sort((a, b) => b.length - a.length);
            
        if (prefijos.length > 0) {
            const prefijoEncontrado = prefijos[0];
            return {
                codigo: config.countryCodes[prefijoEncontrado],
                codigoCompleto: prefijoEncontrado,
                nombre: config.countryNames ? config.countryNames[config.countryCodes[prefijoEncontrado]] : ''
            };
        }
    }
    
    return null;
}

async function analizarChat(urlArchivo, contenedorId, opciones = {}) {
    // Permitir configuración personalizada por llamada
    if (Array.isArray(opciones.excludeKeywords)) {
        config.excludeKeywords = opciones.excludeKeywords;
    }
    try {
        const response = await fetch(urlArchivo);
        const texto = await response.text();
        const lineas = texto.split('\n');
        const contadores = {};
        const regexRemitente = / - (.*?):/;

        // Procesamiento por bloques (chunking)
        const chunkSize = 5000;
        let index = 0;

        function procesarChunk() {
            const regexSeAnadio = /se añadió a ~.*/i; // Excluir "Se añadió a ~..."
            const fin = Math.min(index + chunkSize, lineas.length);
            for (; index < fin; index++) {
                const linea = lineas[index];
                if (!linea || !linea.trim()) continue;
                const esMensajeValido = config.excludeKeywords.every(
                    keyword => !linea.includes(keyword)
                );
                // Filtro adicional para 'Se añadió a ~...'
                if (regexSeAnadio.test(linea)) continue;
                if (esMensajeValido) {
                    const match = linea.match(regexRemitente);
                    // Solo contar si hay remitente y no es un mensaje del sistema (remitente no inicia con invisible)
                    if (match && match[1] && !match[1].startsWith('‎')) {
                        let remitente = match[1].trim();
                        remitente = normalizarRemitente(remitente);
                        contadores[remitente] = (contadores[remitente] || 0) + 1;
                    }
                }
            }
            if (index < lineas.length) {
                setTimeout(procesarChunk, 0); // Procesar el siguiente bloque
            } else {
                mostrarTop100(contadores, contenedorId);
            }
        }
        procesarChunk();
    } catch (error) {
        console.error("Error procesando el chat:", error);
        document.getElementById(contenedorId).innerHTML = 
            `<p class="error">Error cargando el archivo: ${error.message}</p>`;
    }
}

function mostrarTop100(contadores, contenedorId) {
    // Calcular total de mensajes
    const total = Object.values(contadores).reduce((a, b) => a + b, 0);
    // Mostrar el total si existe el elemento
    const totalMensajesEl = document.getElementById('total-mensajes');
    if (totalMensajesEl) {
        totalMensajesEl.innerHTML = `<div class="top100-badge"><i class="fas fa-trophy"></i> TOP 100 Usuarios Más Activos</div><br>Total de mensajes: ${total.toLocaleString()}`;
    }

    const participantes = Object.entries(contadores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 100);

    const getIcon = (index, total) => {
        if (index === 0) return '👑 ';
        if (index === 1) return '🥈 ';
        if (index === 2) return '🥉 ';
        if (index === total - 1) return '😅 ';
        return '';
    };
    
    // Función para generar la bandera del país si se detecta un código
    const getCountryFlag = (nombre) => {
        const paisInfo = detectarCodigoPais(nombre);
        if (paisInfo && paisInfo.codigo) {
            let flagUrl;
            let tooltip = paisInfo.nombre || paisInfo.codigo;
            
            // Si es Jalisco, usar la bandera local
            if (paisInfo.esJalisco) {
                flagUrl = '/icons/Bandera-jal.avif';
                // Intentar con rutas relativas si la ruta absoluta no funciona
                if (window.location.pathname.includes('/clasificaciones/')) {
                    flagUrl = '../../icons/Bandera-jal.avif';
                }
            } else {
                // Para otros países, usar la API de banderas
                flagUrl = `${config.flagsApiUrl}/${paisInfo.codigo}/${config.flagStyle}/${config.flagSize}.png`;
            }
            
            return `<img src="${flagUrl}" alt="${paisInfo.codigo}" title="${tooltip}" class="country-flag" width="${config.flagSize}" height="${config.flagSize}">`;  
        }
        return '';
    };

    const tablaHtml = `
    <table class="chat-top-table">
        <thead>
            <tr><th style="width:40px;text-align:center;">#</th><th>Usuario</th><th>Mensajes</th></tr>
        </thead>
        <tbody>
            ${participantes.map(([nombre, count], index) => {
                const bandera = getCountryFlag(nombre);
                return `
                <tr>
                    <td style="text-align:center;"><strong>${index + 1}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center;">
                            <span style="flex-grow: 1;">${getIcon(index, participantes.length)}${nombre}</span>
                            ${bandera ? `<span style="margin-left: auto;">${bandera}</span>` : ''}
                        </div>
                    </td>
                    <td>${count.toLocaleString('es-ES')}</td>
                </tr>
                `;
            }).join('')}
        </tbody>
    </table>`;
    
    document.getElementById(contenedorId).innerHTML = tablaHtml;
}