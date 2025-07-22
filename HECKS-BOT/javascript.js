// --------------
// Bot de ayuda
// --------------
const tree = {
  start: { 
    bot: '¡Hola! 👋 Soy tu asistente de soporte. ¿En qué podemos ayudarte hoy?', 
    options: [
      { text: 'Soporte técnico', icon: 'fas fa-cogs', next: 'tech' },
      { text: 'Datos personales', icon: 'fas fa-user-shield', next: 'privacy' },
      { text: 'Características de la plataforma', icon: 'fas fa-list-alt', next: 'features' } 
    ] 
  },
  
  // Soporte técnico
  tech: { 
    bot: 'Entiendo que tienes un problema técnico. ¿Podrías especificar qué está sucediendo?', 
    options: [
      { text: 'Error de carga', icon: 'fas fa-exclamation-triangle', next: 'loadError' },
      { text: 'Funcionamiento lento', icon: 'fas fa-tachometer-alt', next: 'slow' },
      { text: 'Problemas de conexión', icon: 'fas fa-wifi', next: 'connection' },
      { text: 'Volver al inicio', icon: 'fas fa-home', next: 'start' } 
    ] 
  },
  loadError: { 
    bot: '⚠️ Para solucionar problemas de carga:\n1. Verifica tu conexión a internet\n2. Actualiza la página (Ctrl+F5)\n3. Limpia el caché de tu navegador\n\n¿Hay algo más en lo que pueda ayudarte?', 
    options: [
      { text: 'Volver a soporte técnico', icon: 'fas fa-arrow-left', next: 'tech' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ] 
  },
  slow: { 
    bot: '🐢 Para mejorar el rendimiento:\n1. Cierra aplicaciones en segundo plano\n2. Limpia el caché de tu navegador\n3. Actualiza tu navegador a la última versión\n\n¿Necesitas algo más?', 
    options: [
      { text: 'Volver a soporte técnico', icon: 'fas fa-arrow-left', next: 'tech' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ] 
  },
  connection: { 
    bot: '📶 Para resolver problemas de conexión:\n1. Reinicia tu módem/router\n2. Verifica otros dispositivos\n3. Prueba con una conexión diferente\n\n¿Hay algo más que necesites?', 
    options: [
      { text: 'Volver a soporte técnico', icon: 'fas fa-arrow-left', next: 'tech' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ] 
  },
  
  // Datos personales
  privacy: {
    bot: 'En esta sección puedes consultar nuestras políticas de protección de datos. ¿Qué deseas saber?',
    options: [
      { text: 'Política de cookies', icon: 'fas fa-cookie-bite', next: 'cookies' },
      { text: 'Política de privacidad', icon: 'fas fa-user-lock', next: 'privacy_policy' },
      { text: 'Volver al inicio', icon: 'fas fa-home', next: 'start' }
    ]
  },
  cookies: {
    bot: 'Nuestra política de cookies explica cómo utilizamos cookies y tecnologías similares. Puedes consultar la política completa haciendo clic <a style="color:blue" href="Legal/politica-de-cookies.html">aquí</a>',
    options: [
      { text: 'Volver a datos personales', icon: 'fas fa-arrow-left', next: 'privacy' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ]
  },
  privacy_policy: {
    bot: 'Nuestra política de privacidad describe cómo recopilamos, usamos y protegemos tu información personal. Consúltala <a style="color:blue" href="Legal/politica-de-privacidad.html">aquí</a>',
    options: [
      { text: 'Volver a datos personales', icon: 'fas fa-arrow-left', next: 'privacy' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ]
  },
  
  // Características de la plataforma
  features: {
    bot: 'Nuestra plataforma cuenta con varias características avanzadas. ¿Sobre cuál deseas información?',
    options: [
      { text: 'Analizador de chats', icon: 'fas fa-comments', next: 'chat_analyzer' },
      { text: 'Base de datos', icon: 'fas fa-database', next: 'database' },
      { text: 'Servidor MC BR', icon: 'fas fa-server', next: 'server' },
      { text: 'Volver al inicio', icon: 'fas fa-home', next: 'start' }
    ]
  },
  chat_analyzer: {
    bot: 'El analizador de chats utiliza un algoritmo para evaluar conversaciones y proporcionar métricas de calidad. Procesa archivos .txt con un 100% de precisión.<br><a style="color:blue" href="/subpaginas/estadisticas.html">Ver analizador</a>',
    options: [
      { text: 'Volver a características', icon: 'fas fa-arrow-left', next: 'features' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ]
  },
  database: {
    bot: 'Nuestra base de datos fue creada para registrar e informar a los usuarios de la comunidad sobre los usuarios problemáticos, en ella puedes ver los más recientes incidentes y un informe completo sobre cada uno de ellos.<br><a style="color:blue" href="/base-de-datos.html">Ver base</a>',
    options: [
      { text: 'Volver a características', icon: 'fas fa-arrow-left', next: 'features' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ]
  },
  server: {
    bot: 'El servidor MC BR esta operativo desde el 2022, cuenta con diferentes modalidades y modos de juego. Puedes obtener más detalles <a style="color:blue" href="/categorias-mc.html">aquí</a>',
    options: [
      { text: 'Volver a características', icon: 'fas fa-arrow-left', next: 'features' },
      { text: 'Inicio', icon: 'fas fa-home', next: 'start' }
    ]
  },
  
  // Estado final
  end: { 
    bot: '¡Gracias por contactarnos! 😊 Si necesitas más ayuda en el futuro, estoy aquí para asistirte. ¡Que tengas un excelente día!', 
    options: [
      { text: 'Iniciar nueva conversación', icon: 'fas fa-sync', next: 'start' } 
    ] 
  }
};

const chatOverlay = document.getElementById('chatOverlay');
const chatBody = document.getElementById('chatBody');
const chatFooter = document.getElementById('chatFooter');
const chatImage = document.getElementById('chatImage');
let currentState = 'start';
let isProcessing = false;

function openChat() {
  if (isProcessing) return;
  
  // Asegurar que el overlay esté visible
  chatOverlay.style.visibility = 'visible';
  chatOverlay.style.display = 'flex';
  
  // Bloquear el scroll del body
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    chatOverlay.classList.add('show');
  }, 10);
  
  if (!chatBody.hasChildNodes()) {
    renderNode('start');
  }
}

function closeChat() {
  if (isProcessing) return;
  
  // Remover la clase show para iniciar la animación de salida
  chatOverlay.classList.remove('show');
  
  // Restaurar el overflow del body
  document.body.style.overflow = '';
  
  // Ocultar el overlay después de la animación
  setTimeout(() => {
    chatOverlay.style.display = 'none';
    // Asegurar que el overlay esté completamente oculto
    chatOverlay.style.visibility = 'hidden';
  }, 300);
}

function clearChat() {
  if (isProcessing) return;
  
  // Deshabilitar botones temporalmente
  disableButtons();
  
  chatBody.innerHTML = '';
  chatFooter.innerHTML = '';
  
  // Renderizar el nodo inicial después de un pequeño retraso
  setTimeout(() => {
    renderNode('start');
  }, 300);
}

function renderNode(nodeKey) {
  if (isProcessing) return;
  
  isProcessing = true;
  currentState = nodeKey;
  const node = tree[nodeKey];
  
  // Deshabilitar todos los botones
  disableButtons();
  
  // Mostrar indicador de escritura antes del mensaje
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // Simular tiempo de escritura
  setTimeout(() => {
    typing.remove();
    
    const msg = document.createElement('div');
    msg.className = 'message bot';
    msg.innerHTML = node.bot.replace(/\n/g, '<br>') + 
      `<span class="message-time">${getCurrentTime()}</span>`;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;

    chatFooter.innerHTML = '';
    node.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply';
      btn.innerHTML = `<i class="${opt.icon}"></i> ${opt.text}`;
      btn.addEventListener('click', () => {
        if (isProcessing) return;
        
        // Deshabilitar botones temporalmente
        disableButtons();
        
        const uMsg = document.createElement('div');
        uMsg.className = 'message user';
        uMsg.innerHTML = opt.text + `<span class="message-time">${getCurrentTime()}</span>`;
        chatBody.appendChild(uMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Renderizar el siguiente nodo después de un pequeño retraso
        setTimeout(() => {
          renderNode(opt.next);
        }, 300);
      });
      chatFooter.appendChild(btn);
    });
    
    // Habilitar botones después de completar el proceso
    isProcessing = false;
    enableButtons();
  }, 1500);
}

function disableButtons() {
  // Deshabilitar todos los botones rápidos
  const quickReplies = chatFooter.querySelectorAll('.quick-reply');
  quickReplies.forEach(btn => {
    btn.disabled = true;
  });
  
  // Deshabilitar botones de la cabecera
  const headerButtons = document.querySelectorAll('.header-btn');
  headerButtons.forEach(btn => {
    btn.disabled = true;
  });
  
  // Deshabilitar botón de abrir chat
  const openBtn = document.querySelector('.open-chat-btn');
  if (openBtn) openBtn.disabled = true;
}

function enableButtons() {
  // Habilitar todos los botones rápidos
  const quickReplies = chatFooter.querySelectorAll('.quick-reply');
  quickReplies.forEach(btn => {
    btn.disabled = false;
  });
  
  // Habilitar botones de la cabecera
  const headerButtons = document.querySelectorAll('.header-btn');
  headerButtons.forEach(btn => {
    btn.disabled = false;
  });
  
  // Habilitar botón de abrir chat
  const openBtn = document.querySelector('.open-chat-btn');
  if (openBtn) openBtn.disabled = false;
}

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Función para cambiar la imagen
function changeChatImage(newImageUrl) {
  chatImage.src = newImageUrl;
}

function toggleMaximize() {
  if (isProcessing) return;
  
  const chatContainer = document.querySelector('.chat-container');
  const maximizeBtn = document.querySelector('.header-btn i.fa-expand');
  
  chatContainer.classList.toggle('maximized');
  
  if (chatContainer.classList.contains('maximized')) {
    maximizeBtn.classList.remove('fa-expand');
    maximizeBtn.classList.add('fa-compress');
  } else {
    maximizeBtn.classList.remove('fa-compress');
    maximizeBtn.classList.add('fa-expand');
  }
}

// Event listener para cerrar el chat al hacer clic fuera del contenedor
document.addEventListener('DOMContentLoaded', function() {
  const chatOverlay = document.getElementById('chatOverlay');
  const chatContainer = document.querySelector('.chat-container');
  
  if (chatOverlay && chatContainer) {
    chatOverlay.addEventListener('click', function(e) {
      // Si se hace clic en el overlay pero no en el contenedor del chat
      if (e.target === chatOverlay) {
        closeChat();
      }
    });
  }
  
  // Event listener para cerrar el chat con la tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && chatOverlay && chatOverlay.style.display === 'flex') {
      closeChat();
    }
  });
});
