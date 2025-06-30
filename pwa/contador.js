// Contador regresivo
class CountdownTimer {
    constructor(targetDate, containerId) {
        this.targetDate = new Date(targetDate);
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.isExpired = false;
        this.showYears = false;
        this.isValidDate = true;
        
        // Validar que la fecha sea válida
        this.validateDate();
        
        // Inicializar el contador solo si la fecha es válida
        if (this.isValidDate) {
            this.init();
        } else {
            this.showInvalidDateMessage();
        }
    }
    
    validateDate() {
        // Verificar si la fecha es válida
        if (isNaN(this.targetDate.getTime())) {
            this.isValidDate = false;
            return;
        }
        
        // Verificar límites de fecha (año 10000 como límite máximo)
        const maxYear = 10000;
        const minYear = 1000;
        
        if (this.targetDate.getFullYear() > maxYear || this.targetDate.getFullYear() < minYear) {
            this.isValidDate = false;
            return;
        }
        
        // Verificar que la fecha no sea extremadamente lejana (más de 1000 años)
        const now = new Date();
        const yearsDiff = this.targetDate.getFullYear() - now.getFullYear();
        
        if (yearsDiff > 1000) {
            this.isValidDate = false;
            return;
        }
    }
    
    showInvalidDateMessage() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="countdown-invalid">
                    <div class="invalid-icon">⚠️</div>
                    <div class="invalid-title">Fecha no válida</div>
                    <div class="invalid-message">La fecha objetivo está fuera del rango permitido (máximo 1000 años en el futuro)</div>
                </div>
            `;
        }
    }
    
    init() {
        if (!this.container) {
            console.error('Contenedor del contador no encontrado:', this.containerId);
            return;
        }
        
        // Verificar si necesitamos mostrar años
        this.checkIfShowYears();
        
        // Crear la estructura HTML del contador
        this.createCountdownHTML();
        
        // Iniciar el contador
        this.updateCountdown();
        this.interval = setInterval(() => this.updateCountdown(), 1000);
    }
    
    checkIfShowYears() {
        try {
            const now = new Date().getTime();
            const distance = this.targetDate.getTime() - now;
            const oneYearInMs = 365 * 24 * 60 * 60 * 1000; // 365 días en milisegundos
            this.showYears = distance > oneYearInMs;
        } catch (error) {
            console.error('Error al calcular años:', error);
            this.showYears = false;
        }
    }
    
    createCountdownHTML() {
        const yearsSection = this.showYears ? `
            <div class="countdown-item">
                <span class="countdown-number" id="years">00</span>
                <span class="countdown-label-small">Años</span>
            </div>
            <div class="countdown-separator">:</div>
        ` : '';
        
        this.container.innerHTML = `
            <div class="countdown-container">
                <div class="countdown-label">Cuenta atrás para:</div>
                <div class="countdown-title">Actualización de página a la v2</div>
                <div class="countdown-timer">
                    ${yearsSection}
                    <div class="countdown-item">
                        <span class="countdown-number" id="days">00</span>
                        <span class="countdown-label-small">Días</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-item">
                        <span class="countdown-number" id="hours">00</span>
                        <span class="countdown-label-small">Horas</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-item">
                        <span class="countdown-number" id="minutes">00</span>
                        <span class="countdown-label-small">Min</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-item">
                        <span class="countdown-number" id="seconds">00</span>
                        <span class="countdown-label-small">Seg</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateCountdown() {
        try {
            const now = new Date().getTime();
            const distance = this.targetDate.getTime() - now;
            
            if (distance < 0) {
                // El contador ha expirado
                this.showExpiredMessage();
                clearInterval(this.interval);
                return;
            }
            
            // Verificar si el número es demasiado grande
            if (!isFinite(distance) || distance > Number.MAX_SAFE_INTEGER) {
                this.showInvalidDateMessage();
                clearInterval(this.interval);
                return;
            }
            
            // Calcular años, días, horas, minutos y segundos
            let years = 0;
            let days = 0;
            
            if (this.showYears) {
                // Cálculo más preciso de años considerando años bisiestos
                const startDate = new Date(now);
                const endDate = new Date(this.targetDate);
                
                years = endDate.getFullYear() - startDate.getFullYear();
                const monthDiff = endDate.getMonth() - startDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < startDate.getDate())) {
                    years--;
                }
                
                // Verificar que los años sean válidos
                if (years < 0 || !isFinite(years)) {
                    years = 0;
                }
                
                // Calcular días restantes después de los años
                const tempDate = new Date(startDate);
                tempDate.setFullYear(startDate.getFullYear() + years);
                const remainingTime = this.targetDate.getTime() - tempDate.getTime();
                days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            } else {
                days = Math.floor(distance / (1000 * 60 * 60 * 24));
            }
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Verificar que todos los valores sean válidos
            const values = [years, days, hours, minutes, seconds];
            const isValid = values.every(val => !isNaN(val) && isFinite(val) && val >= 0);
            
            if (!isValid) {
                this.showInvalidDateMessage();
                clearInterval(this.interval);
                return;
            }
            
            // Actualizar los elementos en el DOM
            if (this.showYears) {
                const yearsElement = document.getElementById('years');
                if (yearsElement) yearsElement.textContent = years.toString().padStart(2, '0');
            }
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            
        } catch (error) {
            console.error('Error en updateCountdown:', error);
            this.showInvalidDateMessage();
            clearInterval(this.interval);
        }
    }
    
    showExpiredMessage() {
        this.isExpired = true;
        this.container.innerHTML = `
            <div class="countdown-expired">
                <div class="expired-icon">🎉</div>
                <div class="expired-title">¡Versión Inaugurada!</div>
                <div class="expired-message">La página ya está en la v2. ¡Revisa los cambios!</div>
            </div>
        `;
    }
    
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// Inicializar el contador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Fecha objetivo
    const targetDate = '2025-07-25T18:00:00';
    
    // Crear el contador
    const countdown = new CountdownTimer(targetDate, 'countdown-container');
    
    // Limpiar el contador cuando se desmonte la página
    window.addEventListener('beforeunload', () => {
        if (countdown) {
            countdown.destroy();
        }
    });
});
