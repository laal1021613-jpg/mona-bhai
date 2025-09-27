// Shop-specific JavaScript
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;

document.addEventListener('DOMContentLoaded', function() {
    initializeShop();
});

function initializeShop() {
    loadStoredData();
    generateProducts();
    setupShopEventListeners();
    updateUI();
    loadProducts();
    checkForSearchResults();
}

function setupShopEventListeners() {
    // Filter controls
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const featureFilter = document.getElementById('feature-filter');
    const sortSelect = document.getElementById('sort-select');
    const clearFilters = document.getElementById('clear-filters');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    if (featureFilter) {
        featureFilter.addEventListener('change', applyFilters);
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAllFilters);
    }
}

function loadProducts() {
    filteredProducts = [...products];
    applyFilters();
}

function checkForSearchResults() {
    const searchResults = sessionStorage.getItem('searchResults');
    const searchQuery = sessionStorage.getItem('searchQuery');
    
    if (searchResults && searchQuery) {
        filteredProducts = JSON.parse(searchResults);
        displayProducts();
        updateResultsInfo(`Search results for "${searchQuery}"`);
        
        // Clear search results from session storage
        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchQuery');
        
        // Show clear filters button
        const clearFilters = document.getElementById('clear-filters');
        if (clearFilters) {
            clearFilters.style.display = 'inline-block';
        }
    }
}

function applyFilters() {
    let filtered = [...products];
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categoryFilter.value) {
        filtered = filtered.filter(product => product.category === categoryFilter.value);
    }
    
    // Price filter
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter && priceFilter.value) {
        const [min, max] = priceFilter.value.split('-');
        if (max === '+') {
            filtered = filtered.filter(product => product.price >= parseInt(min));
        } else {
            filtered = filtered.filter(product => 
                product.price >= parseInt(min) && product.price <= parseInt(max)
            );
        }
    }
    
    // Feature filter
    const featureFilter = document.getElementById('feature-filter');
    if (featureFilter && featureFilter.value) {
        const feature = featureFilter.value;
        filtered = filtered.filter(product => {
            const features = product.features.join(' ').toLowerCase();
            switch (feature) {
                case 'noise-cancellation':
                    return features.includes('noise') || features.includes('anc');
                case 'water-resistant':
                    return features.includes('water') || features.includes('ipx') || features.includes('sweat');
                case 'wireless-charging':
                    return features.includes('wireless charging');
                case 'long-battery':
                    return features.includes('20h') || features.includes('25h') || features.includes('30h');
                default:
                    return true;
            }
        });
    }
    
    // Sort products
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect && sortSelect.value) {
        switch (sortSelect.value) {
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
                // Featured - keep original order
                break;
        }
    }
    
    filteredProducts = filtered;
    currentPage = 1;
    displayProducts();
    updateResultsInfo();
    updatePagination();
    
    // Show/hide clear filters button
    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) {
        const hasFilters = (categoryFilter && categoryFilter.value) ||
                          (priceFilter && priceFilter.value) ||
                          (featureFilter && featureFilter.value);
        clearFilters.style.display = hasFilters ? 'inline-block' : 'none';
    }
}

function clearAllFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const featureFilter = document.getElementById('feature-filter');
    const sortSelect = document.getElementById('sort-select');
    const clearFilters = document.getElementById('clear-filters');
    
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (featureFilter) featureFilter.value = '';
    if (sortSelect) sortSelect.value = 'featured';
    if (clearFilters) clearFilters.style.display = 'none';
    
    loadProducts();
}

function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (pageProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = pageProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>` : ''}
                <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-features">
                    ${product.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="product-price">
                    <span class="price-current">$${product.price}</span>
                    ${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="quick-view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateResultsInfo(customMessage = null) {
    const resultsCount = document.getElementById('results-count');
    if (!resultsCount) return;
    
    if (customMessage) {
        resultsCount.textContent = customMessage;
    } else {
        const total = filteredProducts.length;
        const startIndex = (currentPage - 1) * productsPerPage + 1;
        const endIndex = Math.min(currentPage * productsPerPage, total);
        
        if (total === 0) {
            resultsCount.textContent = 'No products found';
        } else if (total === products.length) {
            resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} products`;
        } else {
            resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} filtered products`;
        }
    }
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Previous
        </button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    displayProducts();
    updateResultsInfo();
    updatePagination();
    
    // Scroll to top of products section
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Store product data for product detail page
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    
    // Navigate to product detail page
    window.location.href = 'product-detail.html';
}

// Add shop-specific styles
const shopStyles = `
.shop-header {
    padding: 120px 0 60px;
    background: linear-gradient(135deg, var(--gray-50), var(--white));
    text-align: center;
}

.shop-header h1 {
    font-size: 2.5rem;
    color: var(--gray-900);
    margin-bottom: 1rem;
}

.shop-controls {
    padding: 40px 0;
    background: var(--white);
    border-bottom: 1px solid var(--gray-200);
}

.controls-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
}

.filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-group label {
    font-weight: 500;
    color: var(--gray-700);
    white-space: nowrap;
}

.filter-group select {
    padding: 8px 12px;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius);
    background: var(--white);
    color: var(--gray-700);
    cursor: pointer;
}

.sort-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sort-controls label {
    font-weight: 500;
    color: var(--gray-700);
}

.sort-controls select {
    padding: 8px 12px;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius);
    background: var(--white);
    color: var(--gray-700);
    cursor: pointer;
}

.results-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.results-info span {
    color: var(--gray-600);
    font-size: 0.9rem;
}

.products-section {
    padding: 40px 0 80px;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.product-description {
    font-size: 0.9rem;
    color: var(--gray-600);
    margin-bottom: 1rem;
    line-height: 1.4;
}

.product-features {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.feature-tag {
    background: var(--gray-100);
    color: var(--gray-700);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
}

.no-products {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    color: var(--gray-500);
}

.no-products i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--gray-300);
}

.no-products h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--gray-600);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.pagination-btn {
    padding: 8px 12px;
    border: 1px solid var(--gray-300);
    background: var(--white);
    color: var(--gray-700);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.9rem;
}

.pagination-btn:hover {
    background: var(--gray-100);
    border-color: var(--gray-400);
}

.pagination-btn.active {
    background: var(--primary-color);
    color: var(--white);
    border-color: var(--primary-color);
}

.pagination-dots {
    padding: 8px 4px;
    color: var(--gray-400);
}

@media (max-width: 768px) {
    .controls-wrapper {
        flex-direction: column;
        align-items: stretch;
    }
    
    .filters {
        justify-content: center;
    }
    
    .filter-group {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }
    
    .sort-controls {
        justify-content: center;
    }
    
    .results-info {
        text-align: center;
        justify-content: center;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .shop-header h1 {
        font-size: 2rem;
    }
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = shopStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.changePage = changePage;
window.viewProduct = viewProduct;