// Sistema de noticias dinámico
class NoticiasManager {
  constructor() {
    this.noticias = [];
    this.configuracion = {};
    this.noticiasContainer = null;
    this.init();
  }

  async init() {
    try {
      await this.cargarNoticias();
      this.renderizarNoticias();
    } catch (error) {
      console.error('Error al cargar las noticias:', error);
      this.mostrarNoticiasPorDefecto();
    }
  }

  async cargarNoticias() {
    const response = await fetch('/pwa/noticias.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo de noticias');
    }
    
    const data = await response.json();
    this.noticias = data.noticias.filter(noticia => noticia.activo);
    this.configuracion = data.configuracion;
  }

  renderizarNoticias() {
    this.noticiasContainer = document.querySelector('.news-container ul');
    if (!this.noticiasContainer) {
      console.error('No se encontró el contenedor de noticias');
      return;
    }

    // Limpiar noticias existentes
    this.noticiasContainer.innerHTML = '';

    // Agregar cada noticia
    this.noticias.forEach(noticia => {
      const li = document.createElement('li');
      
      // Formatear el texto con categoría si está habilitado
      let textoCompleto = '';
      if (this.configuracion.mostrar_categoria) {
        textoCompleto = `${noticia.categoria}${this.configuracion.separador_categoria}${noticia.texto}`;
      } else {
        textoCompleto = noticia.texto;
      }
      
      li.innerHTML = textoCompleto;
      this.noticiasContainer.appendChild(li);
    });

    // Actualizar la velocidad de animación si es necesario
    this.actualizarVelocidadAnimacion();
  }

  actualizarVelocidadAnimacion() {
    const velocidad = this.configuracion.velocidad_animacion || 120;
    const newsContainer = document.querySelector('.news-container ul');
    if (newsContainer) {
      newsContainer.style.animationDuration = `${velocidad}s`;
    }
  }

  mostrarNoticiasPorDefecto() {
    console.log('Mostrando noticias por defecto');
    // Aquí podrías mostrar noticias básicas si falla la carga del JSON
  }

  // Método para actualizar noticias en tiempo real (útil para futuras implementaciones)
  async actualizarNoticias() {
    try {
      await this.cargarNoticias();
      this.renderizarNoticias();
    } catch (error) {
      console.error('Error al actualizar noticias:', error);
    }
  }

  // Método para obtener noticias por categoría
  obtenerNoticiasPorCategoria(categoria) {
    return this.noticias.filter(noticia => 
      noticia.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  // Método para buscar noticias por texto
  buscarNoticias(texto) {
    return this.noticias.filter(noticia => 
      noticia.texto.toLowerCase().includes(texto.toLowerCase()) ||
      noticia.categoria.toLowerCase().includes(texto.toLowerCase())
    );
  }
}

// Inicializar el sistema de noticias cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Solo inicializar si existe el contenedor de noticias
  if (document.querySelector('.news-container')) {
    window.noticiasManager = new NoticiasManager();
  }
});

// Función global para actualizar noticias (útil para debugging)
function actualizarNoticias() {
  if (window.noticiasManager) {
    window.noticiasManager.actualizarNoticias();
  }
}

// Función para obtener estadísticas de noticias
function obtenerEstadisticasNoticias() {
  if (!window.noticiasManager) return null;
  
  const categorias = {};
  window.noticiasManager.noticias.forEach(noticia => {
    categorias[noticia.categoria] = (categorias[noticia.categoria] || 0) + 1;
  });
  
  return {
    total: window.noticiasManager.noticias.length,
    categorias: categorias,
    configuracion: window.noticiasManager.configuracion
  };
} 