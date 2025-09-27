// Product detail page JavaScript
let currentProduct = null;
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
});

function initializeProductDetail() {
    loadStoredData();
    generateProducts();
    setupProductDetailEventListeners();
    updateUI();
    loadProductDetail();
    loadRelatedProducts();
}

function setupProductDetailEventListeners() {
    // Review modal
    const reviewModalClose = document.getElementById('review-modal-close');
    const reviewModal = document.getElementById('review-modal');
    const reviewForm = document.getElementById('review-form');

    if (reviewModalClose) {
        reviewModalClose.addEventListener('click', hideReviewModal);
    }

    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                hideReviewModal();
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    // Rating input
    const ratingStars = document.querySelectorAll('#rating-input i');
    ratingStars.forEach(star => {
        star.addEventListener('click', handleRatingClick);
        star.addEventListener('mouseover', handleRatingHover);
    });

    const ratingInput = document.getElementById('rating-input');
    if (ratingInput) {
        ratingInput.addEventListener('mouseleave', resetRatingDisplay);
    }
}

function loadProductDetail() {
    const selectedProduct = sessionStorage.getItem('selectedProduct');
    const quickViewProduct = sessionStorage.getItem('quickViewProduct');
    
    let productData = null;
    
    if (selectedProduct) {
        productData = JSON.parse(selectedProduct);
        sessionStorage.removeItem('selectedProduct');
    } else if (quickViewProduct) {
        productData = JSON.parse(quickViewProduct);
        sessionStorage.removeItem('quickViewProduct');
    } else {
        // Fallback to first product if no product selected
        productData = products[0];
    }
    
    if (!productData) {
        window.location.href = 'shop.html';
        return;
    }
    
    currentProduct = productData;
    displayProductDetail(productData);
    updateBreadcrumb(productData.name);
}

function displayProductDetail(product) {
    const productDetailContent = document.getElementById('product-detail-content');
    if (!productDetailContent) return;
    
    const reviews = getProductReviews(product.id);
    const averageRating = reviews.length > 0 ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 
        product.rating;
    
    productDetailContent.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img src="${product.image}" alt="${product.name}" id="main-product-image">
                <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="thumbnail-images">
                <img src="${product.image}" alt="${product.name}" class="thumbnail active" onclick="changeMainImage('${product.image}')">
                <img src="${product.image.replace('?w=300', '?w=300&h=300&fit=crop&crop=top')}" alt="${product.name}" class="thumbnail" onclick="changeMainImage('${product.image.replace('?w=300', '?w=300&h=300&fit=crop&crop=top')}')">
                <img src="${product.image.replace('?w=300', '?w=300&h=300&fit=crop&crop=bottom')}" alt="${product.name}" class="thumbnail" onclick="changeMainImage('${product.image.replace('?w=300', '?w=300&h=300&fit=crop&crop=bottom')}')">
                <img src="${product.image.replace('?w=300', '?w=300&h=300&fit=crop&crop=left')}" alt="${product.name}" class="thumbnail" onclick="changeMainImage('${product.image.replace('?w=300', '?w=300&h=300&fit=crop&crop=left')}')">
            </div>
        </div>
        
        <div class="product-info">
            <div class="product-header">
                <h1>${product.name}</h1>
                ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>` : ''}
            </div>
            
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(averageRating)}
                </div>
                <span class="rating-text">${averageRating.toFixed(1)} (${reviews.length} reviews)</span>
            </div>
            
            <div class="product-price">
                <span class="price-current">$${product.price}</span>
                ${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}
                ${product.originalPrice ? `<span class="discount-percent">Save ${Math.round((1 - product.price / product.originalPrice) * 100)}%</span>` : ''}
            </div>
            
            <p class="product-description">${product.description}</p>
            
            <div class="product-features">
                <h3>Key Features:</h3>
                <ul>
                    ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-actions">
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <div class="quantity-controls">
                        <button type="button" onclick="changeQuantity(-1)">-</button>
                        <input type="number" id="quantity-input" value="1" min="1" max="10">
                        <button type="button" onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
                
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCartWithQuantity(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                
                <button class="btn btn-secondary" onclick="buyNow(${product.id})">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
            </div>
            
            <div class="product-guarantees">
                <div class="guarantee-item">
                    <i class="fas fa-shipping-fast"></i>
                    <span>Free shipping on orders over $50</span>
                </div>
                <div class="guarantee-item">
                    <i class="fas fa-undo"></i>
                    <span>30-day return policy</span>
                </div>
                <div class="guarantee-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>2-year warranty included</span>
                </div>
                <div class="guarantee-item">
                    <i class="fas fa-headset"></i>
                    <span>24/7 customer support</span>
                </div>
            </div>
        </div>
    `;
    
    // Add product specifications and reviews sections
    const specsAndReviews = `
        <div class="product-tabs">
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="showTab('specifications')">Specifications</button>
                <button class="tab-btn" onclick="showTab('reviews')">Reviews (${reviews.length})</button>
            </div>
            
            <div class="tab-content">
                <div id="specifications" class="tab-pane active">
                    <h3>Technical Specifications</h3>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">Bluetooth Version:</span>
                            <span class="spec-value">5.0</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Battery Life:</span>
                            <span class="spec-value">${product.features.find(f => f.includes('h Battery')) || '20h Battery'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Water Resistance:</span>
                            <span class="spec-value">${product.features.find(f => f.includes('IPX')) || 'IPX4'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Charging Time:</span>
                            <span class="spec-value">1.5 hours</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Driver Size:</span>
                            <span class="spec-value">10mm</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Frequency Response:</span>
                            <span class="spec-value">20Hz - 20kHz</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Weight:</span>
                            <span class="spec-value">5g per earbud</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Compatibility:</span>
                            <span class="spec-value">iOS, Android, Windows</span>
                        </div>
                    </div>
                </div>
                
                <div id="reviews" class="tab-pane">
                    <div class="reviews-header">
                        <h3>Customer Reviews</h3>
                        <button class="btn btn-primary" onclick="showReviewModal()">Write Review</button>
                    </div>
                    
                    <div class="reviews-summary">
                        <div class="rating-breakdown">
                            <div class="overall-rating">
                                <span class="rating-number">${averageRating.toFixed(1)}</span>
                                <div class="stars">${generateStars(averageRating)}</div>
                                <span class="review-count">${reviews.length} reviews</span>
                            </div>
                            <div class="rating-bars">
                                ${generateRatingBars(reviews)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="reviews-list">
                        ${reviews.length > 0 ? reviews.map(review => `
                            <div class="review-item">
                                <div class="review-header">
                                    <div class="reviewer-info">
                                        <span class="reviewer-name">${review.userName}</span>
                                        <div class="stars">${generateStars(review.rating)}</div>
                                    </div>
                                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                                </div>
                                <p class="review-comment">${review.comment}</p>
                            </div>
                        `).join('') : '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    productDetailContent.innerHTML += specsAndReviews;
}

function loadRelatedProducts() {
    const relatedProductsGrid = document.getElementById('related-products-grid');
    if (!relatedProductsGrid || !currentProduct) return;
    
    // Get products from the same category, excluding current product
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    // If not enough products in same category, add random products
    if (relatedProducts.length < 4) {
        const additionalProducts = products
            .filter(p => p.id !== currentProduct.id && !relatedProducts.includes(p))
            .slice(0, 4 - relatedProducts.length);
        relatedProducts.push(...additionalProducts);
    }
    
    relatedProductsGrid.innerHTML = relatedProducts.map(product => `
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

function updateBreadcrumb(productName) {
    const breadcrumb = document.getElementById('product-breadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = productName;
    }
}

function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === imageSrc) {
            thumb.classList.add('active');
        }
    });
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity-input');
    if (!quantityInput) return;
    
    const currentValue = parseInt(quantityInput.value);
    const newValue = Math.max(1, Math.min(10, currentValue + delta));
    quantityInput.value = newValue;
}

function addToCartWithQuantity(productId) {
    if (!currentUser) {
        showMessage('Please login to add items to cart', 'error');
        showAuthModal();
        return;
    }
    
    const quantityInput = document.getElementById('quantity-input');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
    showMessage(`${quantity}x ${product.name} added to cart!`, 'success');
}

function buyNow(productId) {
    addToCartWithQuantity(productId);
    // Redirect to cart page
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

function showTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    const activePane = document.getElementById(tabName);
    if (activePane) {
        activePane.classList.add('active');
    }
}

function showReviewModal() {
    if (!currentUser) {
        showMessage('Please login to write a review', 'error');
        showAuthModal();
        return;
    }
    
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideReviewModal() {
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Reset form
    const form = document.getElementById('review-form');
    if (form) {
        form.reset();
    }
    selectedRating = 0;
    resetRatingDisplay();
}

function handleRatingClick(e) {
    selectedRating = parseInt(e.target.dataset.rating);
    updateRatingDisplay(selectedRating);
}

function handleRatingHover(e) {
    const hoverRating = parseInt(e.target.dataset.rating);
    updateRatingDisplay(hoverRating);
}

function resetRatingDisplay() {
    updateRatingDisplay(selectedRating);
}

function updateRatingDisplay(rating) {
    const stars = document.querySelectorAll('#rating-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

function handleReviewSubmit(e) {
    e.preventDefault();
    
    if (selectedRating === 0) {
        showMessage('Please select a rating', 'error');
        return;
    }
    
    const comment = document.getElementById('review-comment').value;
    
    if (!comment.trim()) {
        showMessage('Please write a review comment', 'error');
        return;
    }
    
    // Save review to localStorage
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
    if (!reviews[currentProduct.id]) {
        reviews[currentProduct.id] = [];
    }
    
    const newReview = {
        id: Date.now(),
        productId: currentProduct.id,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: selectedRating,
        comment: comment.trim(),
        date: new Date().toISOString()
    };
    
    reviews[currentProduct.id].push(newReview);
    localStorage.setItem('productReviews', JSON.stringify(reviews));
    
    hideReviewModal();
    showMessage('Review submitted successfully!', 'success');
    
    // Reload product detail to show new review
    displayProductDetail(currentProduct);
}

function getProductReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
    return reviews[productId] || [];
}

function generateRatingBars(reviews) {
    const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
    
    reviews.forEach(review => {
        ratingCounts[review.rating - 1]++;
    });
    
    const totalReviews = reviews.length;
    
    return ratingCounts.reverse().map((count, index) => {
        const starNumber = 5 - index;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        return `
            <div class="rating-bar">
                <span class="star-label">${starNumber} star</span>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="count">${count}</span>
            </div>
        `;
    }).join('');
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Store product data and reload page
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.reload();
}

// Add product detail specific styles
const productDetailStyles = `
.breadcrumb {
    padding: 100px 0 20px;
    background: var(--gray-50);
}

.breadcrumb-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.breadcrumb-nav a {
    color: var(--gray-600);
    text-decoration: none;
    transition: var(--transition);
}

.breadcrumb-nav a:hover {
    color: var(--primary-color);
}

.breadcrumb-nav i {
    color: var(--gray-400);
    font-size: 0.8rem;
}

.breadcrumb-nav span {
    color: var(--gray-800);
    font-weight: 500;
}

.product-detail {
    padding: 40px 0;
}

.product-detail-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    margin-bottom: 4rem;
}

.product-gallery {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.main-image {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: var(--gray-50);
}

.main-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
}

.main-image .wishlist-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
}

.thumbnail-images {
    display: flex;
    gap: 1rem;
}

.thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: var(--transition);
}

.thumbnail.active,
.thumbnail:hover {
    border-color: var(--primary-color);
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.product-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.product-header h1 {
    font-size: 2rem;
    color: var(--gray-900);
    margin: 0;
}

.product-rating {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.rating-text {
    color: var(--gray-600);
    font-size: 0.9rem;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.price-current {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
}

.price-original {
    font-size: 1.2rem;
    color: var(--gray-400);
    text-decoration: line-through;
}

.discount-percent {
    background: var(--success-color);
    color: var(--white);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.product-description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--gray-700);
}

.product-features h3 {
    margin-bottom: 1rem;
    color: var(--gray-900);
}

.product-features ul {
    list-style: none;
    padding: 0;
}

.product-features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: var(--gray-700);
}

.product-features li i {
    color: var(--success-color);
    font-size: 0.9rem;
}

.product-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--gray-50);
    border-radius: 12px;
}

.quantity-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.quantity-selector label {
    font-weight: 500;
    color: var(--gray-700);
}

.quantity-controls {
    display: flex;
    align-items: center;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius);
    overflow: hidden;
}

.quantity-controls button {
    background: var(--gray-100);
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: var(--transition);
    font-size: 1.2rem;
    font-weight: 500;
}

.quantity-controls button:hover {
    background: var(--gray-200);
}

.quantity-controls input {
    border: none;
    width: 60px;
    height: 40px;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
}

.add-to-cart-btn {
    font-size: 1.1rem;
    padding: 15px 30px;
}

.product-guarantees {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
}

.guarantee-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--gray-700);
}

.guarantee-item i {
    color: var(--primary-color);
    font-size: 1.1rem;
}

.product-tabs {
    grid-column: 1 / -1;
    margin-top: 2rem;
}

.tab-buttons {
    display: flex;
    border-bottom: 1px solid var(--gray-200);
    margin-bottom: 2rem;
}

.tab-btn {
    background: none;
    border: none;
    padding: 1rem 2rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: var(--gray-600);
    border-bottom: 3px solid transparent;
    transition: var(--transition);
}

.tab-btn.active,
.tab-btn:hover {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}

.tab-pane {
    display: none;
}

.tab-pane.active {
    display: block;
}

.specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.spec-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--gray-50);
    border-radius: 8px;
}

.spec-label {
    font-weight: 500;
    color: var(--gray-700);
}

.spec-value {
    color: var(--gray-900);
    font-weight: 600;
}

.reviews-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.reviews-summary {
    margin-bottom: 2rem;
}

.rating-breakdown {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: center;
}

.overall-rating {
    text-align: center;
}

.rating-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-color);
    display: block;
}

.overall-rating .stars {
    margin: 0.5rem 0;
}

.review-count {
    color: var(--gray-600);
    font-size: 0.9rem;
}

.rating-bars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.rating-bar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
}

.star-label {
    font-size: 0.9rem;
    color: var(--gray-600);
    min-width: 50px;
}

.bar-container {
    height: 8px;
    background: var(--gray-200);
    border-radius: 4px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: var(--warning-color);
    transition: var(--transition);
}

.count {
    font-size: 0.9rem;
    color: var(--gray-600);
    min-width: 30px;
    text-align: right;
}

.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.review-item {
    padding: 1.5rem;
    background: var(--gray-50);
    border-radius: 12px;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.reviewer-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.reviewer-name {
    font-weight: 600;
    color: var(--gray-900);
}

.review-date {
    color: var(--gray-500);
    font-size: 0.9rem;
}

.review-comment {
    color: var(--gray-700);
    line-height: 1.6;
    margin: 0;
}

.no-reviews {
    text-align: center;
    color: var(--gray-500);
    font-style: italic;
    padding: 2rem;
}

.rating-input {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.rating-input i {
    font-size: 1.5rem;
    color: var(--gray-300);
    cursor: pointer;
    transition: var(--transition);
}

.rating-input i:hover,
.rating-input i.fas {
    color: var(--warning-color);
}

.related-products {
    padding: 60px 0;
    background: var(--gray-50);
}

.related-products h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: var(--gray-900);
}

.related-products .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

@media (max-width: 768px) {
    .product-detail-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .product-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .product-header h1 {
        font-size: 1.5rem;
    }
    
    .price-current {
        font-size: 1.5rem;
    }
    
    .product-actions {
        padding: 1rem;
    }
    
    .quantity-selector {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .product-guarantees {
        grid-template-columns: 1fr;
    }
    
    .tab-buttons {
        overflow-x: auto;
    }
    
    .tab-btn {
        white-space: nowrap;
        padding: 1rem 1.5rem;
    }
    
    .rating-breakdown {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .reviews-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .specs-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = productDetailStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.changeMainImage = changeMainImage;
window.changeQuantity = changeQuantity;
window.addToCartWithQuantity = addToCartWithQuantity;
window.buyNow = buyNow;
window.showTab = showTab;
window.showReviewModal = showReviewModal;
window.viewProduct = viewProduct;