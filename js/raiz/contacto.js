document.addEventListener('componentesCargados', function () {
    // Configuración del botón "Volver" inteligente
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function () {
            if (document.referrer && document.referrer !== window.location.href) {
                window.history.back();
            } else {
                window.location.href = '/index.html';
            }
        });
    }

    // Horarios de Atención referenciados a GDL (Oficina Central)
    const gdlSchedule = [
        { day: "Lunes - Viernes", startHour: 11, startMinute: 0, endHour: 18, endMinute: 0 },
        { day: "Sábados", startHour: 12, startMinute: 0, endHour: 15, endMinute: 0 },
        { day: "Domingos", text: "Sin servicio" }
    ];
    const gdlTimeZone = "America/Mexico_City";

    // Elementos del DOM
    const card = document.getElementById('horariosAtencionCard');
    const loading = document.getElementById('horariosCargando');
    const content = document.getElementById('horariosContenido');
    const locationText = document.getElementById('userLocationText');
    const listContainer = document.getElementById('horariosLista');
    const toggleBtn = document.getElementById('btnToggleUbicacion');

    if (!card || !loading || !content || !locationText || !listContainer || !toggleBtn) return;

    // Estado del tipo de ubicación actual (ip o sistema)
    let ubicacionActualTipo = "ip"; 

    // Obtener desplazamiento en horas
    function getOffsetInHours(timeZone, date = new Date()) {
        try {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZoneName: 'longOffset',
                timeZone: timeZone
            });
            const parts = formatter.formatToParts(date);
            const offsetPart = parts.find(part => part.type === 'timeZoneName');
            if (offsetPart) {
                const offsetString = offsetPart.value;
                const match = offsetString.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
                if (match) {
                    const sign = match[1] === '-' ? -1 : 1;
                    const hours = parseInt(match[2], 10);
                    const minutes = match[3] ? parseInt(match[3], 10) : 0;
                    return sign * (hours + minutes / 60);
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // Convertir hora de GDL a hora local del usuario
    function convertGdlToUserTime(gdlHour, gdlMinute, gdlOffsetHours, userTimeZone, referenceDate = new Date()) {
        if (gdlOffsetHours === null) return "No disponible";
        
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: gdlTimeZone,
            year: 'numeric', month: 'numeric', day: 'numeric'
        });
        const parts = formatter.formatToParts(referenceDate);
        const year = parseInt(parts.find(p => p.type === 'year').value, 10);
        const month = parseInt(parts.find(p => p.type === 'month').value, 10) - 1;
        const day = parseInt(parts.find(p => p.type === 'day').value, 10);

        const gdlDateAtSpecificHour = new Date(Date.UTC(year, month, day, gdlHour, gdlMinute, 0));
        const timestampAtGdlTime = gdlDateAtSpecificHour.getTime() - (gdlOffsetHours * 60 * 60 * 1000);
        const userDate = new Date(timestampAtGdlTime);
        
        try {
            return userDate.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: userTimeZone
            });
        } catch (e) {
            return userDate.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
        }
    }

    // Renderizar los horarios en el contenedor
    function renderHorarios(locationData) {
        const today = new Date();
        const gdlCurrentOffset = getOffsetInHours(gdlTimeZone, today);
        
        if (gdlCurrentOffset === null) {
            listContainer.innerHTML = '<p class="text-red-500 font-semibold text-center">Error al determinar la hora base de la oficina.</p>';
            loading.classList.add('hidden');
            content.classList.remove('hidden');
            return;
        }

        const userTimeZone = locationData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || gdlTimeZone;
        const isSameTimeZone = (userTimeZone === gdlTimeZone);

        // Guardar el estado del tipo cargado
        ubicacionActualTipo = locationData.type || "ip";

        // Configurar el texto del botón de alternancia
        if (ubicacionActualTipo === "ip") {
            toggleBtn.textContent = "¿Lectura incorrecta? Activar ubicación aproximada";
        } else {
            toggleBtn.textContent = "Usar ubicación por IP";
        }
        toggleBtn.classList.remove('hidden');

        // Actualizar etiqueta de ubicación
        if (ubicacionActualTipo === "ip" && locationData.city && locationData.country) {
            locationText.textContent = `Estás en: ${locationData.city}, ${locationData.country} (${userTimeZone})`;
        } else {
            const cleanCity = userTimeZone.split('/').pop().replace(/_/g, ' ');
            locationText.textContent = `Ubicación (del sistema): ${cleanCity} (${userTimeZone})`;
        }

        let html = '';
        gdlSchedule.forEach(item => {
            if (item.text) {
                html += `
                <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 py-3 last:border-0">
                    <span class="font-semibold text-gray-800 dark:text-gray-200">${item.day}</span>
                    <span class="text-sm font-semibold text-gray-400 dark:text-gray-500">${item.text}</span>
                </div>`;
            } else {
                if (isSameTimeZone) {
                    const startFormatted = convertGdlToUserTime(item.startHour, item.startMinute, gdlCurrentOffset, userTimeZone, today);
                    const endFormatted = convertGdlToUserTime(item.endHour, item.endMinute, gdlCurrentOffset, userTimeZone, today);
                    html += `
                    <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 py-3 last:border-0">
                        <span class="font-semibold text-gray-800 dark:text-gray-200">${item.day}</span>
                        <span class="text-base font-bold text-orange-600 dark:text-orange-400">${startFormatted} - ${endFormatted} <span class="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Hora local)</span></span>
                    </div>`;
                } else {
                    const userStart = convertGdlToUserTime(item.startHour, item.startMinute, gdlCurrentOffset, userTimeZone, today);
                    const userEnd = convertGdlToUserTime(item.endHour, item.endMinute, gdlCurrentOffset, userTimeZone, today);
                    const officeStart = convertGdlToUserTime(item.startHour, item.startMinute, gdlCurrentOffset, gdlTimeZone, today);
                    const officeEnd = convertGdlToUserTime(item.endHour, item.endMinute, gdlCurrentOffset, gdlTimeZone, today);

                    html += `
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-700/50 py-3 last:border-0 gap-1 sm:gap-0">
                        <span class="font-semibold text-gray-800 dark:text-gray-200">${item.day}</span>
                        <div class="flex flex-col sm:text-right">
                            <span class="text-base font-bold text-orange-600 dark:text-orange-400">${userStart} - ${userEnd} <span class="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Tu hora local)</span></span>
                            <span class="text-xs text-gray-400 dark:text-gray-500">Oficina (Guadalajara): ${officeStart} - ${officeEnd}</span>
                        </div>
                    </div>`;
                }
            }
        });

        listContainer.innerHTML = html;
        loading.classList.add('hidden');
        content.classList.remove('hidden');
    }

    // Cargar usando el huso horario del sistema (Ubicación aproximada)
    function cargarUbicacionSistema() {
        renderHorarios({
            city: null,
            country: null,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            type: "sistema"
        });
    }

    // Cargar usando geolocalización por dirección IP
    function cargarUbicacionIP() {
        loading.classList.remove('hidden');
        content.classList.add('hidden');
        
        fetch('https://freeipapi.com/api/json')
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(data => {
                if (data && data.cityName && data.countryName) {
                    renderHorarios({
                        city: data.cityName,
                        country: data.countryName,
                        timeZone: data.timeZone,
                        type: "ip"
                    });
                } else {
                    throw new Error('Invalid Data');
                }
            })
            .catch(() => {
                // Fallback automático si falla la API
                cargarUbicacionSistema();
            });
    }

    // Configurar listener para el botón de alternancia
    toggleBtn.addEventListener('click', function () {
        if (ubicacionActualTipo === "ip") {
            // Guardar preferencia de sistema y cargar
            localStorage.setItem('preferir-ubicacion-sistema', 'true');
            cargarUbicacionSistema();
        } else {
            // Guardar preferencia de IP y cargar
            localStorage.setItem('preferir-ubicacion-sistema', 'false');
            cargarUbicacionIP();
        }
    });

    // Carga inicial basada en la preferencia de localStorage
    const preferirSistema = localStorage.getItem('preferir-ubicacion-sistema') === 'true';
    if (preferirSistema) {
        cargarUbicacionSistema();
    } else {
        cargarUbicacionIP();
    }
});