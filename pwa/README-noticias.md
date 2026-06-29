# Sistema de Noticias Dinámico

## Descripción
Este sistema permite gestionar las noticias del panel de manera centralizada usando un archivo JSON. Esto facilita la actualización de noticias en todas las páginas sin necesidad de modificar cada archivo HTML individualmente.

## Archivos del Sistema

### 1. `noticias.json`
Archivo principal que contiene todas las noticias y configuración.

**Estructura:**
```json
{
  "noticias": [
    {
      "id": 1,
      "categoria": "Nombre de la categoría",
      "texto": "Texto de la noticia con HTML permitido",
      "activo": true
    }
  ],
  "configuracion": {
    "velocidad_animacion": 120,
    "mostrar_categoria": true,
    "separador_categoria": " | "
  }
}
```

**Campos de noticia:**
- `id`: Identificador único (número)
- `categoria`: Categoría de la noticia (ej: "Discord", "Minecraft", "Comunidad")
- `texto`: Contenido de la noticia (puede incluir HTML)
- `activo`: Boolean que determina si la noticia se muestra (true/false)

**Configuración:**
- `velocidad_animacion`: Duración de la animación en segundos
- `mostrar_categoria`: Si mostrar la categoría antes del texto
- `separador_categoria`: Separador entre categoría y texto

### 2. `noticias.js`
Script que maneja la carga y renderizado de noticias.

## Cómo Usar

### 1. Agregar Noticias
Para agregar una nueva noticia, edita el archivo `noticias.json`:

```json
{
  "id": 16,
  "categoria": "Nueva Categoría",
  "texto": "Nueva noticia con <a href='https://ejemplo.com'><span style='background-color: #6fa8dc; color: #2b00fe;'>enlace</span></a>",
  "activo": true
}
```

### 2. Desactivar Noticias
Para ocultar una noticia sin eliminarla:
```json
{
  "id": 1,
  "categoria": "Ejemplo",
  "texto": "Noticia que no se mostrará",
  "activo": false
}
```

### 3. Modificar Configuración
Cambia la velocidad de animación o el formato:
```json
{
  "configuracion": {
    "velocidad_animacion": 90,
    "mostrar_categoria": false,
    "separador_categoria": " - "
  }
}
```

## Implementación en Páginas

### 1. Incluir el Script
Agrega esta línea en el `<head>` o antes del cierre de `</body>`:
```html
<script src="/pwa/noticias.js"></script>
```

### 2. Estructura HTML Requerida
El contenedor debe tener esta estructura:
```html
<div class='news-container'>
  <div class='title'>
    Novedades
  </div>
  <ul>
    <!-- Las noticias se cargarán automáticamente aquí -->
  </ul>
</div>
```

## Funciones Disponibles

### Funciones Globales
```javascript
// Actualizar noticias manualmente
actualizarNoticias();

// Obtener estadísticas
const stats = obtenerEstadisticasNoticias();
console.log(stats);
```

### Métodos del Manager
```javascript
// Obtener noticias por categoría
const noticiasDiscord = window.noticiasManager.obtenerNoticiasPorCategoria('Discord');

// Buscar noticias por texto
const resultados = window.noticiasManager.buscarNoticias('Minecraft');

// Actualizar noticias
window.noticiasManager.actualizarNoticias();
```

## Ventajas del Sistema

1. **Centralización**: Un solo archivo para todas las noticias
2. **Flexibilidad**: Fácil activar/desactivar noticias
3. **Configuración**: Control sobre velocidad y formato
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Mantenimiento**: Actualización simple sin tocar HTML

## Ejemplos de Uso

### Noticia con Enlace
```json
{
  "categoria": "Discord",
  "texto": "Nuestro <a href='https://discord.gg/ejemplo'><span style='background-color: #6fa8dc; color: #2b00fe;'>servidor</span></a> está creciendo!"
}
```

### Noticia Simple
```json
{
  "categoria": "Comunidad",
  "texto": "¡Gracias por ser parte de nuestra comunidad! 🎉"
}
```

### Noticia con Email
```json
{
  "categoria": "Soporte",
  "texto": "¿Necesitas ayuda? <a href='mailto:soporte@ejemplo.com'><span style='background-color: #6fa8dc; color: #2b00fe;'>Contáctanos</span></a>"
}
```

## Troubleshooting

### Las noticias no aparecen
1. Verifica que el archivo `noticias.json` existe en `/pwa/`
2. Revisa la consola del navegador para errores
3. Asegúrate de que el script `noticias.js` esté incluido

### Error de CORS
Si hay problemas de CORS, asegúrate de que el servidor web esté configurado correctamente para servir archivos JSON.

### Noticias no se actualizan
1. Verifica que el archivo JSON sea válido
2. Limpia la caché del navegador
3. Usa `actualizarNoticias()` para forzar la actualización 