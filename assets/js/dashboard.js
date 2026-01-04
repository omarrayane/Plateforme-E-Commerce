
const games = [
    {
        id: 1,
        title: "The Legend of Zelda: Breath of the Wild",
        description: "Explorez un monde ouvert immense dans cette aventure épique de Nintendo. Une liberté totale vous attend.",
        price: 59.99,
        originalPrice: 79.99,
        category: "Aventure",
        platform: "Nintendo Switch",
        rating: 4.9,
        image: "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
        tags: ["Aventure", "Monde Ouvert", "Nintendo"]
    },
    {
        id: 2,
        title: "Cyberpunk 2077",
        description: "Plongez dans un futur dystopique avec des choix qui impactent l'histoire. Night City n'attend que vous.",
        price: 49.99,
        originalPrice: 69.99,
        category: "RPG",
        platform: "PC",
        rating: 4.5,
        image: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
        tags: ["RPG", "Cyberpunk", "Futuriste"]
    },
    {
        id: 3,
        title: "Elden Ring",
        description: "Une aventure RPG d'action fantastique dans un monde créé par Hidetaka Miyazaki et George R.R. Martin.",
        price: 59.99,
        originalPrice: 69.99,
        category: "RPG",
        platform: "PlayStation",
        rating: 4.8,
        image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
        tags: ["RPG", "Dark Fantasy", "Difficile"]
    },
    {
        id: 4,
        title: "Super Mario Odyssey",
        description: "Rejoignez Mario dans une aventure en 3D massive et globe-trotter.",
        price: 45.99,
        originalPrice: 59.99,
        category: "Plateforme",
        platform: "Nintendo Switch",
        rating: 4.7,
        image: "https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg",
        tags: ["Plateforme", "Familial", "Nintendo"]
    },
    {
        id: 5,
        title: "God of War Ragnarök",
        description: "Kratos et Atreus doivent s'aventurer dans chacun des neuf royaumes.",
        price: 69.99,
        originalPrice: 79.99,
        category: "Action",
        platform: "PlayStation",
        rating: 4.9,
        image: "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg",
        tags: ["Action", "Mythologie", "Story-Rich"]
    },
    {
        id: 6,
        title: "Red Dead Redemption 2",
        description: "Une histoire épique de hors-la-loi au cœur de l'Amérique impitoyable.",
        price: 19.99,
        originalPrice: 59.99,
        category: "Aventure",
        platform: "Xbox",
        rating: 4.9,
        image: "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg",
        tags: ["Western", "Monde Ouvert", "Action"]
    },
    {
        id: 7,
        title: "FIFA 24",
        description: "Le jeu du monde entier. La simulation de football la plus réaliste.",
        price: 69.99,
        originalPrice: null,
        category: "Sport",
        platform: "Multi-plateforme",
        rating: 4.0,
        image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/EA_Sports_FC_24_cover.jpg/220px-EA_Sports_FC_24_cover.jpg",
        tags: ["Sport", "Football", "Compétitif"]
    },
    {
        id: 8,
        title: "The Witcher 3: Wild Hunt",
        description: "Vous êtes Geralt de Riv, tueur de monstres à gages.",
        price: 29.99,
        originalPrice: 39.99,
        category: "RPG",
        platform: "PC",
        rating: 4.8,
        image: "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
        tags: ["RPG", "Fantasy", "Mature"]
    },
    {
        id: 9,
        title: "Minecraft",
        description: "Préparez-vous pour une aventure aux possibilités illimitées.",
        price: 19.99,
        originalPrice: 29.99,
        category: "Simulation",
        platform: "Multi-plateforme",
        rating: 4.6,
        image: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
        tags: ["Créatif", "Survie", "Sandbox"]
    },
    {
        id: 10,
        title: "Mario Kart 8 Deluxe",
        description: "Faites la course avec vos amis ou affrontez-les dans un mode bataille revu.",
        price: 49.99,
        originalPrice: 59.99,
        category: "Course",
        platform: "Nintendo Switch",
        rating: 4.8,
        image: "https://upload.wikimedia.org/wikipedia/en/b/b5/MarioKart8Boxart.jpg",
        tags: ["Course", "Multijoueur", "Fun"]
    },
    {
        id: 11,
        title: "Starfield",
        description: "Dans ce RPG nouvelle génération, créez le personnage de vos rêves et explorez l'espace.",
        price: 69.99,
        originalPrice: null,
        category: "RPG",
        platform: "Xbox",
        rating: 4.2,
        image: "https://upload.wikimedia.org/wikipedia/en/6/6d/Starfield_cover_art.jpg",
        tags: ["Espace", "RPG", "Exploration"]
    },
    {
        id: 12,
        title: "Among Us",
        description: "Un jeu de travail d'équipe et de trahison dans l'espace !",
        price: 3.99,
        originalPrice: 4.99,
        category: "Party",
        platform: "Multi-plateforme",
        rating: 4.4,
        image: "https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg",
        tags: ["Multijoueur", "Stratégie", "Fun"]
    }
];

const state = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    filters: {
        text: '',
        category: 'all',
        platform: 'all',
        maxPrice: 100,
        sortBy: 'default'
    },
    currentModalGame: null
};

// --- DOM Elements ---
const gamesGrid = document.getElementById('games-grid');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
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
function createGameCard(game, delay = 0) {
    const isWishlisted = state.wishlist.some(g => g.id === game.id);
    const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;

    return `
        <div class="game-card" data-id="${game.id}" style="animation: bounceIn 0.5s ease backwards ${delay}ms;">
            <div class="card-image-wrapper">
                <span class="card-badge">${game.category}</span>
                <span class="platform-badge">${game.platform}</span>
                ${discount > 0 ? `<span class="card-badge discount" style="background: var(--danger); top: 3.5rem;">-${discount}%</span>` : ''}
                <img src="${game.image}" alt="${game.title}" loading="lazy">
                <div class="hover-overlay">
                    <button class="btn btn-primary btn-view" onclick="openModal(${game.id})">Voir détails</button>
                    <button class="btn btn-secondary btn-quick-add" onclick="event.stopPropagation(); addToCart(${game.id})">
                        🛒 Ajouter
                    </button>
                </div>
                <div class="card-glow"></div>
            </div>
            <div class="card-content">
                <div class="game-tags">
                    ${game.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <h3 class="card-title">${game.title}</h3>
                <div class="rating-display">
                    <div class="rating-stars">${'★'.repeat(Math.floor(game.rating))}${'☆'.repeat(5 - Math.floor(game.rating))}</div>
                    <span class="rating-score">${game.rating}/5</span>
                </div>
                <div class="card-price-row">
                    <div class="price-info">
                        <span class="price">${game.price} €</span>
                        ${game.originalPrice && game.originalPrice > game.price ? `<span class="original-price">${game.originalPrice} €</span>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon" onclick="event.stopPropagation(); addToCart(${game.id})" title="Ajouter au panier">
                            🛒
                        </button>
                        <button class="btn-icon btn-heart ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${game.id})" title="Ajouter aux favoris">
                            ❤️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function updateCartCount() {
    if (cartCount) cartCount.textContent = state.cart.length;
}
function updateWishlistCount() {
    if (wishlistCount) wishlistCount.textContent = state.wishlist.length; // Corrected ID usage
}
function addToCart(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    state.cart.push(game);
    updateCartCount();
    renderCartIems();
    showNotification(`Ajouté au panier: ${game.title}`, 'success');
    localStorage.setItem('cart', JSON.stringify(state.cart));
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && !sidebar.classList.contains('active')) {
        toggleCart();
    }
}
function toggleWishlist(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    const index = state.wishlist.findIndex(g => g.id === gameId);
    const heartBtn = event.target;
    if (index === -1) {
        state.wishlist.push(game);
        heartBtn.style.color = '#ef4444';
        showNotification(`Ajouté aux favoris: ${game.title}`, 'success');
    } else {
        state.wishlist.splice(index, 1);
        heartBtn.style.color = '';
        showNotification(`Retiré des favoris: ${game.title}`, 'info');
    }
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    updateWishlistCount();
}
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    renderCartIems();
}
function toggleWishlistSidebar() {
    showNotification("Fonctionnalité Liste de Souhaits complète à venir !", "info");
}


function renderCartIems() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Votre panier est vide 🛒</div>';
    } else {
        state.cart.forEach((item, index) => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price} €</div>
                        <span class="remove-item" onclick="removeFromCart(${index})">Retirer</span>
                    </div>
                </div>
            `;
        });
    }

    if (cartTotalPrice) cartTotalPrice.textContent = total.toFixed(2) + ' €';
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCartCount();
    renderCartIems();
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

function checkout() {
    if (state.cart.length === 0) {
        showNotification("Votre panier est vide !", "warning");
        return;
    }
    alert("Merci pour votre commande ! (Simulation)");
    state.cart = [];
    updateCartCount();
    renderCartIems();
    localStorage.setItem('cart', JSON.stringify(state.cart));
    toggleCart();
}
function showNotification(msg, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.style.cssText = `
        position: fixed;
        bottom: 20px; 
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : type === 'info' ? 'var(--primary)' : 'var(--danger)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-sm);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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
    openImmersiveDetail(gameId);
}
function closeModal() {
    closeImmersiveDetail();
}
function openImmersiveDetail(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    state.currentModalGame = game;
    const detailContainer = document.getElementById('product-detail');
    const bg = document.getElementById('immersive-bg');
    if (bg) {
        bg.style.backgroundImage = `url('${game.image}')`;
        bg.classList.add('active');
        bg.style.filter = 'blur(8px) brightness(0.4)';
    }
    const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;
    detailContainer.innerHTML = `
        <div class="product-detail-overlay" id="detail-overlay">
            <button class="close-detail" onclick="closeImmersiveDetail()">×</button>
            <div class="product-detail-content">
                <div class="detail-image-col">
                    <img src="${game.image}" alt="${game.title}">
                </div>
                <div class="detail-info-col">
                    <div class="detail-meta">
                        <span class="tag">${game.category}</span>
                        <span class="platform-badge">${game.platform}</span>
                        <span style="color:var(--warning)">★ ${game.rating}/5</span>
                    </div>
                    <h1 class="detail-title">${game.title}</h1>
                    <p class="detail-description">${game.description}</p>
                    
                    <div class="detail-price-block">
                        <div class="price-stack">
                            ${discount > 0 ? `<span class="discount-badge" style="background:var(--danger); margin-bottom:0.5rem">Save ${discount}%</span>` : ''}
                            <div class="detail-price">${game.price} €</div>
                            ${game.originalPrice ? `<span class="original-price" style="font-size:1.2rem">${game.originalPrice} €</span>` : ''}
                        </div>
                        <div class="detail-actions">
                            <button class="btn btn-primary btn-large" onclick="addToCart(${game.id}); closeImmersiveDetail()">
                                🛒 Ajouter au panier
                            </button>
                            <button class="btn btn-secondary btn-icon" onclick="toggleWishlist(${game.id})">
                                ❤️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.style.overflow = 'hidden';

    // Animate entrance
    const content = detailContainer.querySelector('.product-detail-content');
    content.style.opacity = '0';
    content.style.transform = 'translateY(50px)';
    requestAnimationFrame(() => {
        content.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    });

    detailContainer.style.display = 'block';
}

function closeImmersiveDetail() {
    const detailContainer = document.getElementById('product-detail');
    const bg = document.getElementById('immersive-bg');

    if (bg) {
        bg.classList.remove('active');
        bg.style.backgroundImage = '';
    }

    if (detailContainer) {
        detailContainer.innerHTML = '';
        detailContainer.style.display = 'none';
    }

    document.body.style.overflow = 'auto';
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
                    <img src="${m.image}" class="suggestion-image" alt="">
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
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
        title: "Le Gaming Réinventé",
        text: "Découvrez une nouvelle ère de jeu."
    },
    {
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
        title: "Immersion Totale",
        text: "Plongez dans des mondes infinis."
    },
    {
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2065&auto=format&fit=crop",
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

function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // Set end date (2 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        if (distance < 0) {
            // Timer expired
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    displayGames();
    updateCartCount();
    updateWishlistCount();
    initCountdown();
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
