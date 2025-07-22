// Script para migrar páginas existentes al sistema de noticias dinámico
// Este script busca y reemplaza las noticias estáticas por el sistema dinámico

function migrarPagina() {
  console.log('🔧 Iniciando migración de noticias...');
  
  // Buscar contenedores de noticias
  const newsContainers = document.querySelectorAll('.news-container');
  
  if (newsContainers.length === 0) {
    console.log('❌ No se encontraron contenedores de noticias');
    return;
  }
  
  console.log(`📦 Encontrados ${newsContainers.length} contenedores de noticias`);
  
  newsContainers.forEach((container, index) => {
    const ul = container.querySelector('ul');
    if (ul) {
      // Contar noticias existentes
      const noticiasExistentes = ul.querySelectorAll('li').length;
      console.log(`📰 Contenedor ${index + 1}: ${noticiasExistentes} noticias encontradas`);
      
      // Limpiar contenido estático
      ul.innerHTML = '<!-- Las noticias se cargarán dinámicamente desde noticias.json -->';
      
      console.log(`✅ Contenedor ${index + 1} migrado exitosamente`);
    }
  });
  
  // Verificar si el script de noticias está incluido
  const scriptNoticias = document.querySelector('script[src*="noticias.js"]');
  if (!scriptNoticias) {
    console.log('⚠️  Script de noticias no encontrado. Agregando...');
    
    const script = document.createElement('script');
    script.src = '/pwa/noticias.js';
    document.body.appendChild(script);
    
    console.log('✅ Script de noticias agregado');
  } else {
    console.log('✅ Script de noticias ya está incluido');
  }
  
  console.log('🎉 Migración completada');
}

// Función para verificar si la migración es necesaria
function verificarMigracion() {
  const newsContainers = document.querySelectorAll('.news-container ul');
  let necesitaMigracion = false;
  
  newsContainers.forEach(container => {
    const noticiasEstaticas = container.querySelectorAll('li');
    if (noticiasEstaticas.length > 0) {
      // Verificar si las noticias son estáticas (no tienen el comentario de carga dinámica)
      const comentarioDinamico = container.innerHTML.includes('cargarán dinámicamente');
      if (!comentarioDinamico) {
        necesitaMigracion = true;
      }
    }
  });
  
  return necesitaMigracion;
}

// Función para mostrar estadísticas de migración
function mostrarEstadisticasMigracion() {
  const newsContainers = document.querySelectorAll('.news-container');
  const totalContenedores = newsContainers.length;
  let totalNoticiasEstaticas = 0;
  
  newsContainers.forEach(container => {
    const ul = container.querySelector('ul');
    if (ul) {
      const noticiasEstaticas = ul.querySelectorAll('li');
      totalNoticiasEstaticas += noticiasEstaticas.length;
    }
  });
  
  console.log('📊 Estadísticas de migración:');
  console.log(`   - Contenedores de noticias: ${totalContenedores}`);
  console.log(`   - Noticias estáticas encontradas: ${totalNoticiasEstaticas}`);
  console.log(`   - Necesita migración: ${verificarMigracion() ? 'Sí' : 'No'}`);
}

// Ejecutar verificación al cargar
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 Verificando estado de migración...');
  mostrarEstadisticasMigracion();
  
  if (verificarMigracion()) {
    console.log('🚀 Ejecutando migración automática...');
    migrarPagina();
  } else {
    console.log('✅ La página ya está migrada al sistema dinámico');
  }
});

// Funciones globales para uso manual
window.migrarNoticias = migrarPagina;
window.verificarEstadoMigracion = verificarMigracion;
window.estadisticasMigracion = mostrarEstadisticasMigracion; 