console.log("Dashboard Loaded - Version Hybrid Design + New Buttons 1.1");
let games = [];

async function fetchGames() {
    const formData = new FormData();
    formData.append('action', 'get_items');

    try {
        const response = await fetch('index.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            games = data.items;
            displayGames();
            // Fetch cart after games are loaded (or concurrently)
            fetchCart();
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

async function fetchCart() {
    const formData = new FormData();
    formData.append('action', 'get_cart');
    try {
        const response = await fetch('index.php', { method: 'POST', body: formData });
        const data = await response.json();
        if (data.success) {
            state.cart = data.cart;
            updateCartCount();
            renderCartIems();
            // No need to save to localStorage as we rely on DB
        }
    } catch (e) {
        console.error("Cart fetch error", e);
    }
}

const state = {
    cart: [], // Source of truth is now server, initially empty until fetch
    filters: {
        text: '',
        category: 'all',
        platform: 'all',
        maxPrice: 1000,
        sortBy: 'default'
    },
    currentModalGame: null
};

// --- DOM Elements ---
const gamesGrid = document.getElementById('games-grid');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const modal = document.getElementById('game-modal');
const categoryPills = document.getElementById('category-pills');
const platformSelect = document.getElementById('platform-select');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');

function initFilters() {
    // Category Pills
    if (categoryPills) {
        categoryPills.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                // Remove active class from all pills
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                // Add to clicked
                e.target.classList.add('active');
                state.filters.category = e.target.dataset.category;
                displayGames();
            }
        });
    }
    if (platformSelect) {
        platformSelect.addEventListener('change', (e) => {
            state.filters.platform = e.target.value;
            displayGames();
        });
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.filters.sortBy = e.target.value;
            displayGames();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.filters.text = e.target.value;
            displayGames();
        });
    }
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            state.filters.maxPrice = e.target.value;
            priceValue.textContent = `${e.target.value}€`;
            displayGames();
        });
    }
}
function filterGames() {
    const { text, category, platform, maxPrice, sortBy } = state.filters;
    let filtered = games.filter(game => {
        const matchText = game.title.toLowerCase().includes(text.toLowerCase()) ||
            game.description.toLowerCase().includes(text.toLowerCase()) ||
            game.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()));
        const matchCategory = category === 'all' || game.category === category;
        const matchPlatform = platform === 'all' || game.platform === platform;
        const matchPrice = game.price <= maxPrice;
        return matchText && matchCategory && matchPlatform && matchPrice;
    });
    switch (sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        default:
            break;
    }

    return filtered;
}
function displayGames() {
    if (!gamesGrid) return;
    const filteredGames = filterGames();
    gamesGrid.innerHTML = '';
    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><h3>Aucun jeu trouvé 😢</h3><p>Essayez de modifier vos filtres.</p></div>';
        return;
    }
    filteredGames.forEach((game, index) => {
        const delay = index * 50;
        gamesGrid.innerHTML += createGameCard(game, delay);
    });
}
// Reverted to Premium Design with Description Box + New Modal Logic

function createGameCard(game, delay = 0) {
    const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;

    return `
        <div class="game-card" data-id="${game.id}" style="animation: bounceIn 0.5s ease backwards ${delay}ms;">
            <div class="card-photo-wrapper">
                <div class="card-tags-top">
                    ${game.tags.slice(0, 2).map(tag => `<span class="tag-badge">${tag.toUpperCase()}</span>`).join('')}
                </div>
                ${discount > 0 ? `<span class="discount-pill">-${discount}%</span>` : ''}
                <img src="${game.photo}" alt="${game.title}" loading="lazy">
                <div class="card-overlay-premium">
                     <button class="btn-hover-details" onclick="openModal(${game.id})">
                        <span>Voir détails</span>
                        <div class="btn-glow"></div>
                     </button>
                     <button class="btn-hover-add" onclick="event.stopPropagation(); addToCart(${game.id})">
                        🛒
                     </button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${game.title}</h3>
                
                <div class="card-rating-row">
                    <div class="rating-stars-small">${'★'.repeat(Math.round(game.rating))}${'☆'.repeat(5 - Math.round(game.rating))}</div>
                    <span class="rating-number">${game.rating}/5</span>
                </div>

                <div class="card-footer-row">
                    <div class="card-price-primary">${game.price} €</div>
                    <div class="card-actions-icons">
                        <button class="icon-btn-action" title="Ajouter au panier" onclick="event.stopPropagation(); addToCart(${game.id})">
                            🛒
                        </button>
                        <button class="icon-btn-action" title="Ajouter aux favoris">
                            ❤️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Updated Modal to match "Among Us" reference
function openModal(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    state.currentModalGame = game;
    const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;

    const modalHtml = `
        <div class="modal-content-new">
            <button class="close-modal-new" onclick="closeModal()">×</button>
            
            <div class="modal-image-col">
                <img src="${game.photo}" alt="${game.title}">
            </div>
            
            <div class="modal-info-col">
                <div class="modal-badges">
                    <span class="modal-badge-category">${game.category}</span>
                    <span class="modal-badge-platform">${game.platform}</span>
                </div>
                
                <div class="modal-rating-row">
                    <span class="stars">${'★'.repeat(Math.floor(game.rating))}</span>
                    <span class="score">${game.rating}/5</span>
                </div>

                <h2 class="modal-title">${game.title}</h2>
                <p class="modal-description">${game.description}</p>

                <div class="modal-price-box">
                    ${discount > 0 ? `<span class="save-badge">Save ${discount}%</span>` : ''}
                    
                    <div class="modal-prices">
                        <span class="current-price">${game.price} €</span>
                        ${game.originalPrice ? `<span class="old-price">${game.originalPrice} €</span>` : ''}
                    </div>

                    <div class="modal-actions">
                        <button class="btn-modal-add" onclick="addToCart(${game.id}, this)">
                            🛒 Ajouter au panier
                        </button>
                        <button class="btn-modal-heart">
                            ❤️
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

    const modalContainer = document.getElementById('game-modal');
    // Clear old content structure if needed or just replace innerHTML
    modalContainer.innerHTML = modalHtml;

    // We need to ensure the modal container has the class 'modal' and is displayed
    modalContainer.className = 'modal active'; // Simple active toggle
    modalContainer.style.display = 'flex';
}
function updateCartCount() {
    if (cartCount) {
        // Sum of all quantities
        const totalCount = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalCount;
    }
}
// Update Wishlist function removed
function addToCart(gameId, btnElement = null) {
    const game = games.find(g => g.id == gameId);
    if (!game) return;

    // Add visual feedback if button element is passed
    if (btnElement) {
        const originalContent = btnElement.innerHTML;
        btnElement.classList.add('added');
        btnElement.innerHTML = `<span>Ajouté</span> <span>✔️</span>`;

        setTimeout(() => {
            btnElement.classList.remove('added');
            btnElement.innerHTML = originalContent;
        }, 2000);
    }

    // Check if item already exists
    const existingItem = state.cart.find(item => item.id === game.id);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        showNotification(`Quantité augmentée: ${game.title} (x${existingItem.quantity})`, 'info');
    } else {
        // Create a copy to match cart structure with quantity
        const cartItem = { ...game, quantity: 1 };
        state.cart.push(cartItem);
        showNotification(`Ajouté au panier: ${game.title} `, 'success');
    }

    updateCartCount();
    renderCartIems();

    // Persist to local storage
    localStorage.setItem('cart', JSON.stringify(state.cart));

    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && !sidebar.classList.contains('active')) {
        toggleCart();
    }
}
// Toggle Wishlist function removed
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('active');
    renderCartIems();
}
function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('active');

    // Close on click outside
    document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('.profile-dropdown-container')) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeMenu);
        }
    });
}
// Toggle Wishlist Sidebar function removed


function renderCartIems() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Votre panier est vide 🛒</div>';
    } else {
        state.cart.forEach((item, index) => {
            const qty = item.quantity || 1;
            total += item.price * qty;

            cartItemsContainer.innerHTML += `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.photo}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <span class="cart-item-title">${item.title}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${index}, false)">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
                <div class="cart-item-price-row">
                    <span class="cart-item-price-single">${(item.price).toFixed(2)} €</span>
                    <div class="cart-item-qty-container">
                        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span class="qty-num">${qty}</span>
                        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
    `;
        });
    }

    if (cartTotalPrice) cartTotalPrice.textContent = total.toFixed(2) + ' €';
}

function changeQuantity(index, delta) {
    const item = state.cart[index];
    if (!item) return;

    item.quantity = (item.quantity || 1) + delta;

    if (item.quantity <= 0) {
        removeFromCart(index, false);
    } else {
        updateCartCount();
        renderCartIems();
        // Server Sync
        const formData = new FormData();
        formData.append('action', 'update_cart_quantity');
        formData.append('game_id', item.id);
        formData.append('quantity', item.quantity);
        fetch('index.php', { method: 'POST', body: formData });
    }
}

function removeFromCart(index, decreaseOne = true) {
    const item = state.cart[index];
    if (!item) return;

    if (decreaseOne && (item.quantity || 1) > 1) {
        item.quantity--;
        changeQuantity(index, 0); // Hack to trigger update sync without double changing
    } else {
        // Full remove
        const gameId = item.id;
        state.cart.splice(index, 1);
        updateCartCount();
        renderCartIems();

        const formData = new FormData();
        formData.append('action', 'remove_from_cart');
        formData.append('game_id', gameId);
        fetch('index.php', { method: 'POST', body: formData });
    }
}

function checkout() {
    if (state.cart.length === 0) {
        showNotification("Votre panier est vide !", "warning");
        return;
    }

    const formData = new FormData();
    formData.append('action', 'checkout');

    fetch('index.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification("Commande validée ! (Sauvegardée en BDD)", "success");
                state.cart = [];
                updateCartCount();
                renderCartIems();
                toggleCart();
            } else {
                showNotification("Erreur lors de la commande: " + data.message, "danger");
            }
        });
}
function showNotification(msg, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type} `;
    notif.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : type === 'info' ? 'var(--primary)' : 'var(--danger)'};
    color: white;
    padding: 1rem 2rem;
    border-radius: var(--radius-sm);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideInRight 0.3s ease forwards;
    z-index: 3000;
    `;
    notif.textContent = msg;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideInRight 0.3s ease reverse forwards';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
function openModal(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    state.currentModalGame = game;
    const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;

    const modalHtml = `
        <div class="modal-content-custom">
            <div class="modal-bg-layer" style="background-image: url('${game.photo}')"></div>
            <div class="modal-overlay-dark"></div>
            
            <button class="modal-close-custom" onclick="closeModal()">×</button>
            
            <div class="modal-header-pills">
                <span class="pill-platform">Multi-plateforme</span>
            </div>

            <div class="modal-left">
                <div class="modal-image-wrapper">
                    <img src="${game.photo}" alt="${game.title}">
                </div>
            </div>
            
            <div class="modal-right">
                <div class="modal-cat-row">
                    <span class="modal-cat">${game.category}</span>
                    <span class="modal-rating-score">★ ${game.rating}/5</span>
                </div>
                
                <h2 class="modal-title-custom">${game.title}</h2>
                
                <p class="modal-desc-custom">${game.description}</p>

                <div class="modal-footer-custom">
                    <div class="modal-price-pill">
                        ${game.price} €
                        ${discount > 0 ? `<span class="discount-label">-${discount}%</span>` : ''}
                    </div>
                    
                    <div class="modal-actions-primary">
                        <button class="btn-add-modal" onclick="addToCart(${game.id}, this)">
                            Ajouter au panier
                        </button>
                        <button class="btn-modal-heart" onclick="toggleFavorite(${game.id})">
                            ❤️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalContainer = document.getElementById('game-modal');
    if (modalContainer) {
        modalContainer.innerHTML = modalHtml;
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modalContainer = document.getElementById('game-modal');
    if (modalContainer) {
        modalContainer.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openImmersiveDetail(gameId) {
    openModal(gameId);
}

function closeImmersiveDetail() {
    closeModal();
}
function initParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles-container';

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random properties
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    background: ${Math.random() > 0.5 ? 'var(--primary)' : 'var(--accent)'};
    left: ${x}%;
    top: ${y}%;
    opacity: ${Math.random() * 0.5 + 0.2};
    box-shadow: 0 0 10px ${Math.random() > 0.5 ? 'var(--primary)' : 'var(--accent)'};
    animation: floatParticle ${duration}s linear infinite;
    animation-delay: -${delay}s;
    `;

        particleContainer.appendChild(particle);
    }

    heroSection.appendChild(particleContainer);
}

// --- Animated Counter ---
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
function initScrollAnimations() {
    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, options);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}
function initShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/')) {
            const search = document.getElementById('search-input');
            if (search && document.activeElement !== search) {
                e.preventDefault();
                search.focus();
                search.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        if (e.key === 'Escape') {
            closeImmersiveDetail();
            toggleCart(false);
        }
    });
}
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (themeIcon) themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';

        showNotification(`Mode ${newTheme === 'dark' ? 'Sombre' : 'Clair'} activé`, 'info');
    });
}

// --- Enhanced Search with Autocomplete ---
function initSearchAutocomplete() {
    const input = document.getElementById('search-input');
    const suggestions = document.querySelector('.search-suggestions');
    if (!input || !suggestions) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            suggestions.style.display = 'none';
            return;
        }

        const matches = games.filter(g =>
            g.title.toLowerCase().includes(query) ||
            g.category.toLowerCase().includes(query)
        ).slice(0, 5);

        if (matches.length > 0) {
            suggestions.innerHTML = matches.map(m => `
        <div class="search-suggestion-item" onclick="openImmersiveDetail(${m.id})">
            <img src="${m.photo}" class="suggestion-photo" alt="">
                <div class="suggestion-info">
                    <h4>${m.title}</h4>
                    <p>${m.category} • ${m.price} €</p>
                </div>
            </div>
    `).join('');
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });
}

// --- Newsletter Subscription ---
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    if (!email || !email.includes('@')) {
        showNotification("Veuillez entrer une adresse email valide", "warning");
        return;
    }

    // Simuler un chargement
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Traitement...';
    btn.disabled = true;

    setTimeout(() => {
        showNotification("Merci ! Vous êtes maintenant inscrit à notre newsletter.", "success");
        document.getElementById('newsletter-email').value = '';
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
}
function initTiltEffect() {
}
const heroSlides = [
    {
        image: "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=2070&auto=format&fit=crop",
        title: "Le Gaming Réinventé",
        text: "Découvrez une nouvelle ère de jeu."
    },
    {
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
        title: "Immersion Totale",
        text: "Plongez dans des mondes infinis."
    },
    {
        image: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=2070&auto=format&fit=crop",
        title: "Performance Ultime",
        text: "Jouez sans limites."
    }
];

let currentSlide = 0;

function initHeroCarousel() {
    const container = document.getElementById('hero-carousel');
    const indicators = document.getElementById('hero-indicators');

    if (!container || !indicators) return;

    container.innerHTML = heroSlides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${slide.image}')"></div>
            `).join('');

    indicators.innerHTML = heroSlides.map((_, index) => `
            <div class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
                `).join('');

    // Auto rotate
    setInterval(nextSlide, 5000);
}

function handleContact(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    setTimeout(() => {
        showNotification('Message envoyé avec succès !', 'success');
        e.target.reset();
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

function handleSpecialOffer(gameTitle, action) {
    // Find game by title (fuzzy match to be safe)
    const game = games.find(g => g.title.toLowerCase().includes(gameTitle.toLowerCase()) || gameTitle.toLowerCase().includes(g.title.toLowerCase()));

    if (!game) {
        showNotification(`Désolé, ${gameTitle} n'est pas disponible pour le moment.`, 'error');
        return;
    }

    if (action === 'buy') {
        addToCart(game.id);
    } else if (action === 'view') {
        openModal(game.id);
    }
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.indicator');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    const next = (currentSlide + 1) % heroSlides.length;
    goToSlide(next);
}


document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    fetchGames();
    updateCartCount();
    updateCartCount();
    // updateWishlistCount();

    initHeroCarousel();
    initParticles();
    initThemeToggle();
    initSearchAutocomplete();
    initShortcuts();
    initScrollAnimations();
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes floatParticle {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-100vh) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
