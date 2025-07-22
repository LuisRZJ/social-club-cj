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
    ]
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
document.addEventListener('DOMContentLoaded', aplicarModoOscuroTabla);

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
        totalMensajesEl.textContent = `Total de mensajes: ${total.toLocaleString()}`;
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

    const tablaHtml = `
    <table class="chat-top-table">
        <thead>
            <tr><th style="width:40px;text-align:center;">#</th><th>Usuario</th><th>Mensajes</th></tr>
        </thead>
        <tbody>
            ${participantes.map(([nombre, count], index) => `
                <tr>
                    <td style="text-align:center;">${index + 1}</td>
                    <td>${getIcon(index, participantes.length)}${nombre}</td>
                    <td>${count.toLocaleString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
    
    document.getElementById(contenedorId).innerHTML = tablaHtml;
}