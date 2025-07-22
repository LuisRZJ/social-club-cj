// Variables globales para almacenar los archivos
let baseFile = null;
let complementFile = null;
let combinedContent = null;

// Función para manejar la selección de archivos
function handleFileSelect(type, input) {
    const file = input.files[0];
    const card = document.getElementById(type === 'base' ? 'baseFileCard' : 'complementFileCard');
    
    if (!file) {
        resetFileCard(card, type);
        return;
    }

    // Validar que sea un archivo .txt
    if (!file.name.toLowerCase().endsWith('.txt')) {
        showError(card, 'Solo se permiten archivos .txt');
        return;
    }

    // Validar el tamaño del archivo (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        showError(card, 'El archivo es demasiado grande. Máximo 50MB');
        return;
    }

    // Leer y validar el contenido del archivo
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        
        if (!isValidWhatsAppChat(content)) {
            showError(card, 'El archivo no parece ser un historial de chat de WhatsApp válido');
            return;
        }

        // Guardar el archivo
        if (type === 'base') {
            baseFile = { file, content };
        } else {
            complementFile = { file, content };
        }

        // Mostrar información del archivo
        showFileInfo(card, file, content);
        
        // Verificar si ambos archivos están listos
        checkFilesReady();
    };

    reader.onerror = function() {
        showError(card, 'Error al leer el archivo');
    };

    reader.readAsText(file, 'UTF-8');
}

// Función para validar si el contenido es un chat de WhatsApp válido
function isValidWhatsAppChat(content) {
    const lines = content.split('\n');
    let validLines = 0;
    let totalLines = Math.min(lines.length, 100); // Revisar solo las primeras 100 líneas

    for (let i = 0; i < totalLines; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        // Patrón típico de WhatsApp: DD/MM/YY HH:MM - Nombre: Mensaje
        const whatsappPattern = /^\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}\s+-\s+.+/;
        
        // También aceptar líneas de sistema (sin dos puntos)
        const systemPattern = /^\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}\s+-\s+[^:]+$/;
        
        if (whatsappPattern.test(line) || systemPattern.test(line)) {
            validLines++;
        }
    }

    // Al menos el 70% de las líneas deben seguir el patrón de WhatsApp
    return validLines / totalLines >= 0.7;
}

// Función para mostrar información del archivo
function showFileInfo(card, file, content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const fileSize = formatFileSize(file.size);
    
    card.className = 'file-upload-card has-file';
    card.innerHTML = `
        <div class="file-upload-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 class="file-upload-title">Archivo Cargado</h3>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize} • ${lines.length} líneas</div>
            <div class="file-status success">Archivo válido</div>
        </div>
        <button class="file-upload-btn" onclick="resetFileCard('${card.id}')">
            <i class="fas fa-times"></i> Cambiar Archivo
        </button>
    `;
}

// Función para mostrar error
function showError(card, message) {
    card.className = 'file-upload-card error';
    card.innerHTML = `
        <div class="file-upload-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="file-upload-title">Error</h3>
        <div class="file-info error">
            <div class="file-status error">${message}</div>
        </div>
        <button class="file-upload-btn" onclick="resetFileCard('${card.id}')">
            <i class="fas fa-upload"></i> Intentar de Nuevo
        </button>
    `;
}

// Función para resetear la tarjeta de archivo
function resetFileCard(cardId, type) {
    const card = document.getElementById(cardId);
    const isBase = cardId === 'baseFileCard';
    
    if (isBase) {
        baseFile = null;
    } else {
        complementFile = null;
    }
    
    card.className = 'file-upload-card';
    card.innerHTML = `
        <div class="file-upload-icon">
            <i class="fas fa-${isBase ? 'file-alt' : 'file-plus'}"></i>
        </div>
        <h3 class="file-upload-title">Archivo ${isBase ? 'Base' : 'Complementario'}</h3>
        <p class="file-upload-description">
            ${isBase ? 'Selecciona el archivo principal de chat que servirá como base para la combinación.' : 'Selecciona el archivo adicional que se agregará al final del archivo base.'}
        </p>
        <button class="file-upload-btn" onclick="document.getElementById('${isBase ? 'baseFileInput' : 'complementFileInput'}').click()">
            <i class="fas fa-upload"></i> Seleccionar Archivo
        </button>
        <input type="file" id="${isBase ? 'baseFileInput' : 'complementFileInput'}" class="file-input-hidden" accept=".txt" onchange="handleFileSelect('${isBase ? 'base' : 'complement'}', this)">
    `;
    
    checkFilesReady();
}

// Función para verificar si ambos archivos están listos
function checkFilesReady() {
    const combineBtn = document.getElementById('combineBtn');
    const infoMessages = document.getElementById('infoMessages');
    
    if (baseFile && complementFile) {
        combineBtn.disabled = false;
        showInfoMessage('Ambos archivos están listos. Puedes proceder con la combinación.', 'info');
    } else {
        combineBtn.disabled = true;
        infoMessages.innerHTML = '';
    }
}

// Función para mostrar mensajes informativos
function showInfoMessage(message, type = 'info') {
    const infoMessages = document.getElementById('infoMessages');
    const messageClass = type === 'error' ? 'error-message' : 
                        type === 'warning' ? 'warning-message' : 'info-message';
    
    infoMessages.innerHTML = `<div class="${messageClass}">${message}</div>`;
}

// Función para formatear el tamaño del archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función para combinar los archivos
function combineFiles() {
    if (!baseFile || !complementFile) {
        showInfoMessage('Por favor, selecciona ambos archivos antes de continuar.', 'error');
        return;
    }

    // Mostrar sección de progreso
    const progressSection = document.getElementById('progressSection');
    const resultSection = document.getElementById('resultSection');
    const combineBtn = document.getElementById('combineBtn');
    
    progressSection.classList.add('active');
    resultSection.classList.remove('active');
    combineBtn.disabled = true;
    
    // Simular progreso
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const progressInterval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        
        if (progress <= 30) {
            progressText.textContent = 'Analizando archivos...';
        } else if (progress <= 60) {
            progressText.textContent = 'Combinando contenido...';
        } else if (progress <= 90) {
            progressText.textContent = 'Generando archivo final...';
        } else {
            progressText.textContent = '¡Completado!';
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                processCombination();
            }, 500);
        }
    }, 100);
}

// Función para procesar la combinación
function processCombination() {
    try {
        // Obtener el contenido de ambos archivos
        const baseContent = baseFile.content;
        const complementContent = complementFile.content;
        
        // Dividir en líneas y filtrar líneas vacías
        const baseLines = baseContent.split('\n').filter(line => line.trim() !== '');
        const complementLines = complementContent.split('\n').filter(line => line.trim() !== '');
        
        // Combinar los contenidos
        const combinedLines = [...baseLines, ...complementLines];
        combinedContent = combinedLines.join('\n');
        
        // Generar estadísticas
        const stats = {
            baseLines: baseLines.length,
            complementLines: complementLines.length,
            totalLines: combinedLines.length,
            baseSize: formatFileSize(baseFile.file.size),
            complementSize: formatFileSize(complementFile.file.size),
            combinedSize: formatFileSize(new Blob([combinedContent]).size)
        };
        
        // Mostrar resultados
        showResults(stats);
        
    } catch (error) {
        console.error('Error al combinar archivos:', error);
        showInfoMessage('Error al procesar los archivos. Por favor, intenta de nuevo.', 'error');
    } finally {
        // Ocultar sección de progreso
        document.getElementById('progressSection').classList.remove('active');
    }
}

// Función para mostrar los resultados
function showResults(stats) {
    const resultSection = document.getElementById('resultSection');
    const resultStats = document.getElementById('resultStats');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Generar estadísticas
    resultStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-value">${stats.baseLines}</span>
            <span class="stat-label">Líneas Base</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${stats.complementLines}</span>
            <span class="stat-label">Líneas Complementarias</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${stats.totalLines}</span>
            <span class="stat-label">Total Líneas</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${stats.combinedSize}</span>
            <span class="stat-label">Tamaño Final</span>
        </div>
    `;
    
    // Configurar descarga
    const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadBtn.href = url;
    downloadBtn.download = `chat_combinado_${new Date().toISOString().slice(0, 10)}.txt`;
    
    // Mostrar sección de resultados
    resultSection.classList.add('active');
    
    // Limpiar mensajes informativos
    document.getElementById('infoMessages').innerHTML = '';
}

// Función para limpiar la URL del blob cuando se descarga
function cleanupBlob() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn.href && downloadBtn.href.startsWith('blob:')) {
        URL.revokeObjectURL(downloadBtn.href);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el botón de descarga para limpiar el blob
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', function() {
        setTimeout(cleanupBlob, 1000);
    });
    
    // Configurar el botón de volver
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function() {
        window.history.back();
    });
});

// Función para limpiar todo y empezar de nuevo
function resetCombiner() {
    baseFile = null;
    complementFile = null;
    combinedContent = null;
    
    resetFileCard('baseFileCard', 'base');
    resetFileCard('complementFileCard', 'complement');
    
    document.getElementById('progressSection').classList.remove('active');
    document.getElementById('resultSection').classList.remove('active');
    document.getElementById('infoMessages').innerHTML = '';
    
    // Limpiar inputs de archivo
    document.getElementById('baseFileInput').value = '';
    document.getElementById('complementFileInput').value = '';
} 