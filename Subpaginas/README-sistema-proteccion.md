# Sistema de Protección Contra Spam

## 🛡️ Características del Sistema

### **Límites Configurados:**
- **Máximo**: 2 mensajes por semana por email
- **Período**: 7 días desde el primer envío
- **Almacenamiento**: LocalStorage del navegador

### **Funcionalidades:**

#### ✅ **Verificación en Tiempo Real:**
- Contador visible que muestra envíos disponibles
- Actualización automática al escribir email y nombre
- Indicadores visuales (verde = disponible, rojo = límite alcanzado)

#### ✅ **Bloqueo Inteligente:**
- Previene envíos cuando se alcanza el límite
- Muestra fecha exacta del próximo envío disponible
- Restaura automáticamente el botón de envío

#### ✅ **Mensaje Informativo:**
- Explica claramente el límite alcanzado
- Muestra fecha de reseteo
- Proporciona alternativas de contacto:
  - 📧 Email directo: soporteclubgaming@gmail.com
  - 📱 Telegram: https://t.me/CGNcj
  - 🌐 Discord: https://discord.gg/FBNZ5v7keR

## 🔧 Configuración

### **Variables Modificables:**
```javascript
const LIMIT_CONFIG = {
  maxEmails: 2,        // Máximo emails por período
  periodDays: 7,       // Días del período
  storageKey: 'email_send_limit' // Clave en localStorage
};
```

### **Almacenamiento de Datos:**
```javascript
{
  "usuario@email.com": {
    count: 2,                    // Número de envíos
    firstSend: "2025-01-15T...", // Primer envío
    lastSend: "2025-01-17T..."   // Último envío
  }
}
```

## 📊 Flujo de Funcionamiento

### **1. Verificación Pre-envío:**
```
Usuario llena formulario → Verifica límite → ¿Puede enviar?
├─ Sí → Continúa con envío
└─ No → Muestra mensaje de límite
```

### **2. Registro Post-envío:**
```
Email enviado exitosamente → Registra envío → Actualiza contador
```

### **3. Reseteo Automático:**
```
7 días desde primer envío → Resetea contador → Permite nuevos envíos
```

## 🎯 Beneficios

### **Para el Sistema:**
- ✅ **Reduce spam** y abuso del formulario
- ✅ **Mejora rendimiento** del servidor EmailJS
- ✅ **Ahorra recursos** de procesamiento
- ✅ **Mantiene calidad** de los mensajes recibidos

### **Para el Usuario:**
- ✅ **Transparencia** sobre límites
- ✅ **Alternativas de contacto** cuando no puede enviar
- ✅ **Información clara** sobre cuándo podrá enviar de nuevo
- ✅ **Experiencia fluida** sin errores confusos

## 🔄 Estados del Contador

### **Estado Inicial:**
```
💡 Límite: 2 mensajes por semana
```

### **Con Email Válido:**
```
✅ 2 de 2 envíos disponibles esta semana
✅ 1 de 2 envíos disponibles esta semana
```

### **Límite Alcanzado:**
```
⚠️ Límite alcanzado. Próximo envío: 22 de enero de 2025
```

## 🛠️ Personalización

### **Cambiar Límite de Envíos:**
```javascript
const LIMIT_CONFIG = {
  maxEmails: 5,  // Cambiar a 5 emails
  periodDays: 7,
  storageKey: 'email_send_limit'
};
```

### **Cambiar Período:**
```javascript
const LIMIT_CONFIG = {
  maxEmails: 2,
  periodDays: 14,  // Cambiar a 2 semanas
  storageKey: 'email_send_limit'
};
```

### **Cambiar Mensaje de Límite:**
Modificar la función `showLimitMessage()` para personalizar el mensaje.

## 🔍 Monitoreo

### **Ver Datos Almacenados:**
```javascript
// En consola del navegador
console.log(JSON.parse(localStorage.getItem('email_send_limit')));
```

### **Limpiar Datos (Para Testing):**
```javascript
// En consola del navegador
localStorage.removeItem('email_send_limit');
```

## ⚠️ Consideraciones

### **Limitaciones:**
- Los datos se almacenan en el navegador del usuario
- Si el usuario limpia localStorage, se resetea el contador
- No es 100% seguro contra usuarios técnicos

### **Recomendaciones:**
- Mantener el límite de 2 emails por semana
- Monitorear el uso del formulario
- Considerar implementar verificación en servidor para mayor seguridad

---

**¡El sistema está listo para proteger tu formulario contra spam!** 🚀 