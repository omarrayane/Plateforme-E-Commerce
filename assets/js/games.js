document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let currentMode = 'add'; // 'add' or 'edit'
    let currentEditCard = null;

    // --- Product Modal Logic (Games.html) ---
    const productModal = document.getElementById('product-modal');
    const openModalBtn = document.getElementById('open-add-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelModalBtn = document.getElementById('cancel-modal');
    const productForm = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');

    const openModal = (mode = 'add', card = null) => {
        if (!productModal) return;
        currentMode = mode;
        currentEditCard = card;

        productModal.classList.add('active');
        resetPreview(); // Clear preview when opening modal

        if (mode === 'add') {
            modalTitle.textContent = 'Ajouter un Produit';
            productForm.reset();
        } else {
            modalTitle.textContent = 'Modifier le Produit';
            fillFormFromCard(card);
        }
    };

    const fillFormFromCard = (card) => {
        const name = card.querySelector('h3').textContent;
        const categoryText = card.querySelector('.game-meta p:nth-child(1)').textContent.replace('Catégorie:', '').trim();
        const typeText = card.querySelector('.game-meta p:nth-child(2)').textContent.replace('Type:', '').trim();
        const price = card.querySelector('.game-price').textContent.replace('€', '').trim();

        document.getElementById('product-name').value = name;
        document.getElementById('product-category').value = categoryText;
        document.getElementById('product-price').value = price;

        // Map type text back to values
        const typeSelect = document.getElementById('product-type');
        if (typeText === 'Jeu Vidéo') typeSelect.value = 'game';
        else if (typeText === 'Carte Cadeau') typeSelect.value = 'giftcard';

        // Handling image preview on edit (optional but better)
        const imagePlaceholder = card.querySelector('.game-image-placeholder');
        if (imagePlaceholder.style.backgroundImage) {
            const url = imagePlaceholder.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
            handleImagePreview(url);
            document.getElementById('product-image-url').value = url;
        }
    };

    const closeModal = () => {
        if (!productModal) return;
        productModal.classList.remove('active');
        currentEditCard = null;
    };

    // --- Image Preview Logic ---
    const imageFileInput = document.getElementById('product-image-file');
    const imageUrlInput = document.getElementById('product-image-url');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    const removePreviewBtn = document.getElementById('remove-preview');

    const handleImagePreview = (src) => {
        previewImg.src = src;
        previewContainer.classList.remove('hidden');
    };

    const resetPreview = () => {
        previewImg.src = '';
        previewContainer.classList.add('hidden');
        if (imageFileInput) imageFileInput.value = '';
        if (imageUrlInput) imageUrlInput.value = '';
    };

    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    handleImagePreview(event.target.result);
                    if (imageUrlInput) imageUrlInput.value = '';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', (e) => {
            if (e.target.value.trim() !== '') {
                handleImagePreview(e.target.value);
                if (imageFileInput) imageFileInput.value = '';
            } else {
                previewContainer.classList.add('hidden');
            }
        });
    }

    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', resetPreview);
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openModal('add'));
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeModal();
        });
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    const gamesGrid = document.querySelector('.games-grid');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.game-card');

            cards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const category = card.querySelector('.game-meta p:nth-child(1)').textContent.toLowerCase();
                if (name.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- Event Delegation for Delete and Edit ---
    if (gamesGrid) {
        gamesGrid.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-product');
            const editBtn = e.target.closest('.edit-product');

            if (deleteBtn) {
                const card = deleteBtn.closest('.game-card');
                const name = card.querySelector('h3').textContent;
                if (confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
                    card.remove();
                }
            }

            if (editBtn) {
                const card = editBtn.closest('.game-card');
                openModal('edit', card);
            }
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('product-name').value;
            const type = document.getElementById('product-type').value;
            const category = document.getElementById('product-category').value;
            const price = document.getElementById('product-price').value;

            // Image handling
            let imageSource = '';
            let isIcon = true;

            const file = imageFileInput.files[0];
            const url = imageUrlInput.value;

            if (file) {
                imageSource = previewImg.src;
                isIcon = false;
            } else if (url) {
                imageSource = url;
                isIcon = false;
            }

            const typeLabel = type === 'game' ? 'Jeu Vidéo' : 'Carte Cadeau';
            let iconClass = 'fas fa-gamepad';
            if (type === 'giftcard') {
                if (name.toLowerCase().includes('playstation')) iconClass = 'fab fa-playstation';
                else if (name.toLowerCase().includes('steam')) iconClass = 'fab fa-steam';
                else if (name.toLowerCase().includes('xbox')) iconClass = 'fab fa-xbox';
                else iconClass = 'fas fa-gift';
            }

            if (currentMode === 'add') {
                const newCard = document.createElement('div');
                newCard.className = 'game-card';
                newCard.innerHTML = `
                    <div class="game-image-placeholder" ${!isIcon ? `style="background-image: url('${imageSource}'); background-size: cover; background-position: center;"` : ''}>
                        ${isIcon ? `<i class="${iconClass}"></i>` : ''}
                    </div>
                    <div class="game-info">
                        <h3>${name}</h3>
                        <div class="game-meta">
                            <p><strong>Catégorie:</strong> ${category}</p>
                            <p><strong>Type:</strong> ${typeLabel}</p>
                        </div>
                        <p class="game-price">${parseFloat(price).toFixed(2)}€</p>
                        <div class="game-buttons">
                            <button class="btn btn-secondary edit-product">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn btn-danger delete-product">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </div>
                `;
                gamesGrid.prepend(newCard);
                alert('Produit ajouté avec succès !');
            } else if (currentMode === 'edit' && currentEditCard) {
                // Update existing card
                const imagePlaceholder = currentEditCard.querySelector('.game-image-placeholder');
                if (!isIcon) {
                    imagePlaceholder.style.backgroundImage = `url('${imageSource}')`;
                    imagePlaceholder.style.backgroundSize = 'cover';
                    imagePlaceholder.style.backgroundPosition = 'center';
                    imagePlaceholder.innerHTML = '';
                } else {
                    imagePlaceholder.style.backgroundImage = 'none';
                    imagePlaceholder.innerHTML = `<i class="${iconClass}"></i>`;
                }

                currentEditCard.querySelector('h3').textContent = name;
                currentEditCard.querySelector('.game-meta p:nth-child(1)').innerHTML = `<strong>Catégorie:</strong> ${category}`;
                currentEditCard.querySelector('.game-meta p:nth-child(2)').innerHTML = `<strong>Type:</strong> ${typeLabel}`;
                currentEditCard.querySelector('.game-price').textContent = `${parseFloat(price).toFixed(2)}€`;

                alert('Produit modifié avec succès !');
            }

            closeModal();
            productForm.reset();
            resetPreview();
        });
    }
});
