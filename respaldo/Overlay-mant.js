// ==============================
//
// Overlay de mantenimiento inteligente
//
//  <script src="/respaldo/Overlay-mant.js"></script>
//
// ==============================
  const maintenanceConfig = {
    active: true,
    title: "¡Página en desarrollo!",
    message: "Lamentamos las molestias pero esta sección aún está siendo construida o actualizada.<br>Por favor, vuelve más tarde.",
    contact: "soporteclubgaming@gmail.com",
    backgroundColor: "rgba(30, 41, 59, 0.92)",
    textColor: "#ffffff",
    primaryColor: "#FFD1A9",
    showButtons: true,
    buttons: [
      { 
        text: "Volver atrás", 
        icon: "arrow-left", 
        action: "back" 
      },
      { 
        text: "Contacto", 
        icon: "envelope", 
        url: "/contacto.html" 
      }
    ],
    showFooter: true,
    footerText: "Comunidad CGN |",
    showIcon: true,
    iconAnimation: "pulse",
    showCountdown: false,
    countdownDate: "2026-08-15T09:00:00"
  };
  
  // Implementación completa
  document.addEventListener('DOMContentLoaded', function() {
    if (!maintenanceConfig.active) return;
    
    // Crear elemento overlay
    const overlay = document.createElement('div');
    overlay.style = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100vw; height: 100vh;
      background: ${maintenanceConfig.backgroundColor};
      color: ${maintenanceConfig.textColor};
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      backdrop-filter: blur(2px);
      transition: opacity 0.3s;
    `;
  
    // Inyectar keyframes para animación si es necesario
    if (maintenanceConfig.iconAnimation && !document.getElementById('overlay-keyframes')) {
      const style = document.createElement('style');
      style.id = 'overlay-keyframes';
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
  
    // Construir contenido modular
    let iconHTML = '';
    if (maintenanceConfig.showIcon) {
      const animationStyle = maintenanceConfig.iconAnimation ? 
        `animation: ${maintenanceConfig.iconAnimation} 1.5s infinite;` : '';
      iconHTML = `
        <div class="icon" style="font-size:4rem;margin-bottom:1.2rem;color:${maintenanceConfig.primaryColor};${animationStyle}">
          <i class="fas fa-tools"></i>
        </div>
      `;
    }

    // Contador regresivo
    let countdownHTML = '';
    if (maintenanceConfig.showCountdown && maintenanceConfig.countdownDate) {
      countdownHTML = `
        <div id="maintenanceCountdown" style="font-size:1.3em;font-weight:600;margin:18px 0 10px 0;color:${maintenanceConfig.primaryColor};"></div>
      `;
    }
  
    let buttonsHTML = '';
    if (maintenanceConfig.showButtons && maintenanceConfig.buttons) {
      buttonsHTML = '<div class="actions" style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-top:20px;">';
      maintenanceConfig.buttons.forEach((btn, idx) => {
        if (btn.action === "back") {
          buttonsHTML += `
            <a href="#" id="overlayBackButton" class="btn" style="background:${maintenanceConfig.primaryColor};color:#1e293b;padding: 0.7em 1.5em; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 1.08em; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: background 0.2s; display: flex; align-items: center; gap: 0.6em;">
              <i class="fas fa-${btn.icon}"></i> ${btn.text}
            </a>
          `;
        } else {
          buttonsHTML += `
            <a href="${btn.url}" class="btn" style="background:${maintenanceConfig.primaryColor};color:#1e293b;padding: 0.7em 1.5em; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 1.08em; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: background 0.2s; display: flex; align-items: center; gap: 0.6em;">
              <i class="fas fa-${btn.icon}"></i> ${btn.text}
            </a>
          `;
        }
      });
      buttonsHTML += '</div>';
    }
  
    let footerHTML = '';
    if (maintenanceConfig.showFooter) {
      footerHTML = `
        <div class="footer" style="margin-top:2.5rem;font-size:1em;opacity:0.8;letter-spacing:0.5px;">
          ${maintenanceConfig.footerText} ${new Date().getFullYear()}
        </div>
      `;
    }
  
    // Ensamblaje final
    overlay.innerHTML = `
      <div style="max-width:700px;padding:20px;text-align:center;">
        ${iconHTML}
        <div class="title" style="font-size:2.2rem;font-weight:700;margin-bottom:0.7em;letter-spacing:0.5px;">
          ${maintenanceConfig.title}
        </div>
        <div class="desc" style="font-size:1.15rem;margin-bottom:0.7em;">
          ${maintenanceConfig.message}
          ${countdownHTML}
          <div style="margin-top:15px;font-size:0.98em;color:${maintenanceConfig.primaryColor};">
            Si necesitas ayuda, contáctanos o visita otras secciones.
          </div>
        </div>
        ${buttonsHTML}
        <div style="margin-top:25px;font-size:1.1em;">
          Contacto directo: <a href="mailto:${maintenanceConfig.contact}" 
            style="color:${maintenanceConfig.primaryColor};text-decoration:underline;">${maintenanceConfig.contact}</a>
        </div>
        ${footerHTML}
      </div>
    `;

    // Lógica para actualizar el contador
    if (maintenanceConfig.showCountdown && maintenanceConfig.countdownDate) {
      function updateCountdown() {
        const countdownElem = document.getElementById('maintenanceCountdown');
        if (!countdownElem) return;
        const now = new Date();
        const target = new Date(maintenanceConfig.countdownDate);
        const diff = target - now;
        if (diff <= 0) {
          countdownElem.textContent = '¡Disponible en breve!';
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        countdownElem.textContent = `Faltan ${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  
    // Añadir al documento
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Lógica para el botón de volver atrás
    const backBtn = document.getElementById('overlayBackButton');
    if (backBtn) {
      backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (document.referrer && document.referrer !== window.location.href) {
          window.history.back();
        } else {
          window.location.href = '/index.html';
        }
      });
    }
  });