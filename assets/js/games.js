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
        const id = card.dataset.id;
<<<<<<< HEAD
        const name = card.querySelector('h3').textContent.trim();
=======
        const name = card.querySelector('h3').textContent;
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
        const categoryText = card.querySelector('.game-meta p:nth-child(1)').textContent.replace('Catégorie:', '').trim();
        const typeText = card.querySelector('.game-meta p:nth-child(2)').textContent.replace('Type:', '').trim();

        // Handle special offer data (could be stored in data attributes for reliability)
        const offerBadge = card.querySelector('.offer-badge');
        const isSpecial = !!offerBadge;
        const discount = isSpecial ? offerBadge.textContent.replace('-', '').replace('%', '').trim() : '0';

        const priceElement = card.querySelector('.game-price');
        let price = '';
        if (isSpecial) {
            price = priceElement.querySelector('.old-price').textContent.replace('€', '').trim();
        } else {
            price = priceElement.textContent.replace('€', '').trim();
        }

        document.getElementById('product-name').value = name;
        document.getElementById('product-category').value = categoryText;
        document.getElementById('product-price').value = price;

        const typeSelect = document.getElementById('product-type');
        if (typeText === 'Jeu Vidéo' || typeText === 'game') typeSelect.value = 'game';
        else if (typeText === 'Carte Cadeau' || typeText === 'giftcard') typeSelect.value = 'giftcard';

<<<<<<< HEAD
        // Set special offer fields
        const specialCheckbox = document.getElementById('product-special');
        const discountWrapper = document.getElementById('discount-wrapper');
        const discountInput = document.getElementById('product-discount');

        specialCheckbox.checked = isSpecial;
        if (isSpecial) {
            discountWrapper.classList.remove('hidden');
            discountInput.value = discount;
        } else {
            discountWrapper.classList.add('hidden');
            discountInput.value = '';
        }

        const photoImg = card.querySelector('.game-photo');
        if (photoImg) {
            handlePhotoPreview(photoImg.src);
            document.getElementById('product-photo').value = photoImg.src;
=======
        const photoPlaceholder = card.querySelector('.game-photo-placeholder');
        if (photoPlaceholder.style.backgroundImage) {
            const url = photoPlaceholder.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
            handlePhotoPreview(url);
            document.getElementById('product-photo').value = url;
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
        }
    };

    // --- Special Offer Toggle Logic ---
    const specialCheckbox = document.getElementById('product-special');
    const discountWrapper = document.getElementById('discount-wrapper');

    if (specialCheckbox) {
        specialCheckbox.addEventListener('change', () => {
            if (specialCheckbox.checked) {
                discountWrapper.classList.remove('hidden');
            } else {
                discountWrapper.classList.add('hidden');
            }
        });
    }

    const closeModal = () => {
        if (!productModal) return;
        productModal.classList.remove('active');
        currentEditCard = null;
        if (discountWrapper) discountWrapper.classList.add('hidden');
    };

    // --- Photo Preview Logic ---
    const photoFileInput = document.getElementById('product-photo-file');
    const photoInput = document.getElementById('product-photo');
    const previewContainer = document.getElementById('photo-preview-container');
    const previewImg = document.getElementById('photo-preview');
    const removePreviewBtn = document.getElementById('remove-preview');

    const handlePhotoPreview = (src) => {
        previewImg.src = src;
        previewContainer.classList.remove('hidden');
    };

    const resetPreview = () => {
        previewImg.src = '';
        previewContainer.classList.add('hidden');
        if (photoFileInput) photoFileInput.value = '';
        if (photoInput) photoInput.value = '';
    };

    if (photoFileInput) {
        photoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    handlePhotoPreview(event.target.result);
                    if (photoInput) photoInput.value = '';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (photoInput) {
        photoInput.addEventListener('input', (e) => {
            if (e.target.value.trim() !== '') {
                handlePhotoPreview(e.target.value);
                if (photoFileInput) photoFileInput.value = '';
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
                const id = card.dataset.id;
<<<<<<< HEAD
                const name = card.querySelector('h3').textContent.trim();

                console.log('Attempting to delete item:', id, name);

=======
                const name = card.querySelector('h3').textContent;
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
                if (confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
                    const formData = new FormData();
                    formData.append('action', 'delete');
                    formData.append('id', id);

<<<<<<< HEAD
                    fetch('items.php', { // Relative to root dashboard
                        method: 'POST',
                        body: formData
                    })
                        .then(response => {
                            if (!response.ok) throw new Error('Network response was not ok');
                            return response.json();
                        })
                        .then(data => {
                            if (data.success) {
                                console.log('Successfully deleted:', name);
                                card.remove();
                            } else {
                                console.error('Deletion failed from server:', data.message);
                                alert('Erreur: ' + data.message);
                            }
                        })
                        .catch(err => {
                            console.error('Fetch error:', err);
                            alert('Une erreur est survenue lors de la suppression.');
=======
                    fetch('items.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                card.remove();
                            } else {
                                alert('Erreur: ' + data.message);
                            }
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
                        });
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
            const photo = document.getElementById('product-photo').value;
<<<<<<< HEAD
            const isSpecial = document.getElementById('product-special').checked ? 1 : 0;
            const discount = document.getElementById('product-discount').value || 0;
=======
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5

            const formData = new FormData();
            formData.append('action', currentMode);
            if (currentMode === 'edit' && currentEditCard) {
                formData.append('id', currentEditCard.dataset.id);
            }
            formData.append('name', name);
            formData.append('type', type);
            formData.append('category', category);
            formData.append('price', price);
<<<<<<< HEAD
            formData.append('photo', photo);
            formData.append('is_special_offer', isSpecial);
            formData.append('discount_percentage', discount);
=======
            formData.append('photo', photo); // Updated to photo
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5

            fetch('items.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload(); // Simplest way to reflect changes
                    } else {
                        alert('Erreur: ' + data.message);
                    }
                });

            closeModal();
            productForm.reset();
            resetPreview();
        });
    }
});
