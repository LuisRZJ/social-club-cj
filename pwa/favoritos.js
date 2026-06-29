document.addEventListener('componentesCargados', () => {
    const favoritesList = document.getElementById('favorites-list');

    const getFavorites = () => {
        try {
            const favorites = localStorage.getItem('cgn_favoritos');
            return favorites ? JSON.parse(favorites) : [];
        } catch (e) {
            console.error('Error al leer favoritos de localStorage:', e);
            return [];
        }
    };

    const displayFavorites = () => {
        const favorites = getFavorites();
        favoritesList.innerHTML = ''; // Limpiar la lista antes de mostrar

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p class="hint">No tienes páginas favoritas aún. ¡Añade algunas desde el menú contextual!</p>';
            return;
        }

        // Añadir la clase favorites-grid al contenedor principal
        favoritesList.classList.add('favorites-grid');

        favorites.forEach(fav => {
            const favoriteCard = document.createElement('div');
            favoriteCard.className = 'favorite-card';
            favoriteCard.innerHTML = `
                <h3>${fav.title}</h3>
                <div class="favorite-actions">
                    <button class="visit-fav-btn" data-url="${fav.url}">
                        <i class="fas fa-external-link-alt"></i> Ir a la página
                    </button>
                    <button class="remove-fav-btn" data-url="${fav.url}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            `;
            favoritesList.appendChild(favoriteCard);
        });

        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.remove-fav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const urlToRemove = e.currentTarget.dataset.url;
                removeFavorite(urlToRemove);
                displayFavorites(); // Volver a mostrar la lista actualizada
            });
        });

        // Añadir event listeners a los botones de visitar
        document.querySelectorAll('.visit-fav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const urlToVisit = e.currentTarget.dataset.url;
                window.open(urlToVisit, '_blank');
            });
        });
    };

    const removeFavorite = (url) => {
        let favorites = getFavorites();
        favorites = favorites.filter(fav => fav.url !== url);
        try {
            localStorage.setItem('cgn_favoritos', JSON.stringify(favorites));
        } catch (e) {
            console.error('Error al guardar favoritos en localStorage:', e);
        }
    };

    displayFavorites(); // Mostrar favoritos al cargar la página
});