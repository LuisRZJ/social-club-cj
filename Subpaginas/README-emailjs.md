# Configuración de EmailJS para Formulario de Contacto

## ¿Qué necesitas para implementar EmailJS?

### 1. **Cuenta en EmailJS**
- Ve a [emailjs.com](https://www.emailjs.com/)
- Crea una cuenta gratuita
- Obtén tu **User ID** desde el dashboard

### 2. **Configurar un Service**
- En el dashboard de EmailJS, ve a "Email Services"
- Agrega un nuevo servicio (Gmail, Outlook, etc.)
- Obtén el **Service ID**

### 3. **Crear una Plantilla de Email**
- Ve a "Email Templates"
- Crea una nueva plantilla
- Usa las variables: `{{user_name}}`, `{{user_email}}`, `{{subject}}`, `{{message}}`
- Obtén el **Template ID**

### 4. **Configurar el Código**

En el archivo `formulario-contacto.html`, reemplaza los siguientes valores:

```javascript
// En la línea donde dice:
emailjs.init('TU_USER_ID');
// Reemplaza 'TU_USER_ID' con tu User ID real

// En la línea donde dice:
emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', formData)
// Reemplaza 'TU_SERVICE_ID' con tu Service ID
// Reemplaza 'TU_TEMPLATE_ID' con tu Template ID
```

### 5. **Ejemplo de Plantilla de Email Optimizada**

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
  <!-- Header del email -->
  <div style="background: linear-gradient(135deg, #FFD1A9 0%, #ffb07a 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #374151; margin: 0; font-size: 24px; font-weight: 600;">Nuevo Mensaje de Contacto</h1>
    <p style="color: #374151; margin: 10px 0 0 0; font-size: 14px;">Comunidad Gaming Network (CGN)</p>
  </div>

  <!-- Contenido principal -->
  <div style="padding: 25px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <div style="color: #4B5563; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
      Has recibido un nuevo mensaje de contacto. Por favor responde lo antes posible.
    </div>

    <!-- Información del remitente -->
    <div style="margin-bottom: 25px;">
      <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #FFD1A9;">
        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #FFD1A9 0%, #ffb07a 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #374151;">👤</div>
        <div style="flex: 1;">
          <div style="color: #1F2937; font-size: 16px; font-weight: 600; margin-bottom: 5px;">{{user_name}}</div>
          <div style="color: #6B7280; font-size: 13px; margin-bottom: 5px;">📧 {{user_email}}</div>
          <div style="color: #6B7280; font-size: 13px;">🕒 {{time}}</div>
        </div>
      </div>
    </div>

    <!-- Detalles del mensaje -->
    <div style="margin-bottom: 25px;">
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
        <div style="color: #1F2937; font-size: 14px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">📋 Asunto</div>
        <div style="color: #374151; font-size: 16px; font-weight: 500;">{{subject}}</div>
      </div>
    </div>

    <!-- Mensaje -->
    <div style="margin-bottom: 25px;">
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <div style="color: #1F2937; font-size: 14px; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">💬 Mensaje</div>
        <div style="color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">{{message}}</div>
      </div>
    </div>

    <!-- Información técnica adicional -->
    <div style="margin-bottom: 25px;">
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
        <div style="color: #1F2937; font-size: 14px; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🔍 Información Técnica</div>
        <div style="color: #374151; font-size: 13px; line-height: 1.5;">
          <div style="margin-bottom: 8px;"><strong>📱 Dispositivo:</strong> {{user_agent}}</div>
          <div style="margin-bottom: 8px;"><strong>🌍 Zona Horaria:</strong> {{user_timezone}}</div>
          <div style="margin-bottom: 8px;"><strong>🔗 Página:</strong> {{page_url}}</div>
          <div style="margin-bottom: 8px;"><strong>↩️ Origen:</strong> {{referrer}}</div>
          <div style="margin-bottom: 0;"><strong>📅 Enviado:</strong> {{form_timestamp}}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; text-align: center; border-top: 2px solid #FFD1A9;">
      <div style="color: #6B7280; font-size: 12px; line-height: 1.5;">
        <p style="margin: 0 0 10px 0;"><strong>Comunidad Gaming Network (CGN)</strong></p>
        <p style="margin: 0 0 5px 0;">🌐 <a href="https://discord.gg/FBNZ5v7keR" style="color: #1D4ED8; text-decoration: none;">Discord</a> | 📱 <a href="https://t.me/CGNcj" style="color: #1D4ED8; text-decoration: none;">Telegram</a> | 📧 <a href="mailto:soporteclubgaming@gmail.com" style="color: #1D4ED8; text-decoration: none;">Soporte</a></p>
        <p style="margin: 5px 0 0 0; font-size: 11px; color: #9CA3AF;">Este mensaje fue enviado desde el formulario de contacto de la página web.</p>
      </div>
    </div>
  </div>
</div>
```

## Características del Formulario

### ✅ **Funcionalidades incluidas:**
- Validación de campos requeridos
- Estado de carga durante el envío
- Mensajes de éxito y error
- Limpieza automática del formulario
- Compatible con modo oscuro
- Diseño responsive
- Prevención de envíos múltiples

### 🚀 **Datos adicionales enviados:**
- **Información del usuario**: Nombre, email, asunto, mensaje
- **Alias de compatibilidad**: `name`, `email`, `title` para compatibilidad con plantillas existentes
- **Información temporal**: Fecha y hora en formato español (zona horaria de México)
- **Información técnica**: User agent, zona horaria del usuario, URL de la página
- **Información de origen**: Página de referencia, timestamp ISO
- **Información de contexto**: IP detectada automáticamente por EmailJS

### 🎨 **Estilos:**
- Diseño moderno y limpio
- Animaciones suaves
- Colores consistentes con tu tema
- Modo oscuro integrado

### 📱 **Responsive:**
- Funciona perfectamente en móviles
- Campos adaptables
- Botones optimizados para touch

## Pasos para Activar

1. **Configura EmailJS** siguiendo los pasos arriba
2. **Reemplaza los IDs** en el código JavaScript
3. **Prueba el formulario** enviando un mensaje de prueba
4. **Verifica** que recibes el email correctamente

## Solución de Problemas

### ❌ **El formulario no envía emails:**
- Verifica que los IDs estén correctos
- Revisa la consola del navegador para errores
- Asegúrate de que EmailJS esté inicializado

### ❌ **No aparece el mensaje de éxito:**
- Verifica que el Service ID sea correcto
- Revisa que el Template ID exista
- Confirma que el User ID esté bien configurado

### ❌ **Error de CORS:**
- Asegúrate de usar HTTPS en producción
- Verifica que el dominio esté autorizado en EmailJS

## Límites del Plan Gratuito

- **200 emails por mes**
- **2 servicios de email**
- **Plantillas básicas**

Para más emails, considera el plan de pago.

## Seguridad

- Los datos se envían directamente a EmailJS
- No se almacenan en tu servidor
- Usa HTTPS para mayor seguridad
- Valida los campos en el frontend y backend

---

**¡Listo!** Tu formulario de contacto estará funcionando perfectamente una vez que configures los IDs de EmailJS. 