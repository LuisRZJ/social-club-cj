/**
 * cargador.js
 * 
 * Script encargado de realizar la carga asíncrona de los componentes HTML 
 * modulares y de inyectarlos en el DOM antes de ocultar la pantalla de carga.
 */

document.addEventListener("DOMContentLoaded", async () => {
    console.log("⏳ Iniciando carga de componentes modulares...");
    
    // Buscar todos los elementos que tienen el atributo data-include
    const elementos = document.querySelectorAll("[data-include]");
    const promesasDeCarga = [];

    elementos.forEach((elemento) => {
        const urlComponente = elemento.getAttribute("data-include");
        
        // Creamos una promesa por cada componente a cargar
        const promesa = fetch(urlComponente)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar ${urlComponente}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                // Insertamos el HTML dentro del elemento contenedor
                elemento.innerHTML = html;
                
                // Extraer el primer hijo del div temporal si es necesario, 
                // o dejarlo en el div wrapper. Por ahora reemplazaremos el innerHTML
                // Si deseamos reemplazar el div contenedor completamente:
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Mover todos los hijos del div temporal antes del elemento original
                while (tempDiv.firstChild) {
                    elemento.parentNode.insertBefore(tempDiv.firstChild, elemento);
                }
                // Eliminar el elemento original (marcador de posición)
                elemento.parentNode.removeChild(elemento);
            })
            .catch(error => {
                console.error(`❌ Falló la carga del componente: ${urlComponente}`, error);
                elemento.innerHTML = `<div style="color:red; padding:10px; border:1px solid red;">Error cargando componente: ${urlComponente}</div>`;
            });
            
        promesasDeCarga.push(promesa);
    });

    // Esperar a que todos los componentes se hayan cargado e inyectado
    try {
        await Promise.all(promesasDeCarga);
        console.log("✅ Todos los componentes han sido cargados exitosamente.");
        
        // Despachar un evento global indicando que el DOM (con los componentes) está verdaderamente listo
        const eventoDinamico = new CustomEvent("componentesCargados");
        document.dispatchEvent(eventoDinamico);
        
    } catch (e) {
        console.error("⚠️ Ocurrió un error general durante la carga de componentes.", e);
        // Despachar el evento de todas formas para no dejar la página colgada en el loading
        document.dispatchEvent(new CustomEvent("componentesCargados"));
    }
});
