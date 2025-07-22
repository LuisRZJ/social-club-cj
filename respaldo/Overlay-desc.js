// ==============================
//
// Overlay de página descontinuada
//
//  <script src="/respaldo/Overlay-desc.js"></script>
//
// ==============================
const discontinuedConfig = {
  active: true,
  title: "Página descontinuada",
  message: "Esta sección ya no está disponible o ha sido retirada permanentemente.<br>Te recomendamos volver atrás o ir al inicio.",
  backgroundColor: "rgba(30, 41, 59, 0.97)",
  textColor: "#ffffff",
  primaryColor: "#ff7b54",
  showButtons: true,
  buttons: [
    {
      text: "Volver atrás",
      icon: "arrow-left",
      action: "back"
    },
    {
      text: "Ir al inicio",
      icon: "home",
      url: "/index.html"
    }
  ],
  showFooter: true,
  footerText: "Comunidad CGN |",
  showIcon: true,
  iconAnimation: "none"
};

document.addEventListener('DOMContentLoaded', function() {
  if (!discontinuedConfig.active) return;

  // Crear elemento overlay
  const overlay = document.createElement('div');
  overlay.style = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    background: ${discontinuedConfig.backgroundColor};
    color: ${discontinuedConfig.textColor};
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    backdrop-filter: blur(2px);
    transition: opacity 0.3s;
  `;

  // Icono
  let iconHTML = '';
  if (discontinuedConfig.showIcon) {
    iconHTML = `
      <div class="icon" style="font-size:4rem;margin-bottom:1.2rem;color:${discontinuedConfig.primaryColor};">
        <i class="fas fa-ban"></i>
      </div>
    `;
  }

  // Botones
  let buttonsHTML = '';
  if (discontinuedConfig.showButtons && discontinuedConfig.buttons) {
    buttonsHTML = '<div class="actions" style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-top:20px;">';
    discontinuedConfig.buttons.forEach((btn, idx) => {
      if (btn.action === "back") {
        buttonsHTML += `
          <a href="#" id="overlayBackButton" class="btn" style="background:${discontinuedConfig.primaryColor};color:#1e293b;padding: 0.7em 1.5em; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 1.08em; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: background 0.2s; display: flex; align-items: center; gap: 0.6em;">
            <i class="fas fa-${btn.icon}"></i> ${btn.text}
          </a>
        `;
      } else {
        buttonsHTML += `
          <a href="${btn.url}" class="btn" style="background:${discontinuedConfig.primaryColor};color:#1e293b;padding: 0.7em 1.5em; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 1.08em; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: background 0.2s; display: flex; align-items: center; gap: 0.6em;">
            <i class="fas fa-${btn.icon}"></i> ${btn.text}
          </a>
        `;
      }
    });
    buttonsHTML += '</div>';
  }

  // Footer
  let footerHTML = '';
  if (discontinuedConfig.showFooter) {
    footerHTML = `
      <div class="footer" style="margin-top:2.5rem;font-size:1em;opacity:0.8;letter-spacing:0.5px;">
        ${discontinuedConfig.footerText} ${new Date().getFullYear()}
      </div>
    `;
  }

  // Ensamblaje final
  overlay.innerHTML = `
    <div style="max-width:700px;padding:20px;text-align:center;">
      ${iconHTML}
      <div class="title" style="font-size:2.2rem;font-weight:700;margin-bottom:0.7em;letter-spacing:0.5px;">
        ${discontinuedConfig.title}
      </div>
      <div class="desc" style="font-size:1.15rem;margin-bottom:0.7em;">
        ${discontinuedConfig.message}
      </div>
      ${buttonsHTML}
      ${footerHTML}
    </div>
  `;

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