// Cart page JavaScript
let orderNumber = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

function initializeCart() {
    loadStoredData();
    generateProducts();
    setupCartEventListeners();
    updateUI();
    displayCart();
}

function setupCartEventListeners() {
    // Checkout modal
    const checkoutModalClose = document.getElementById('checkout-modal-close');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutModalClose) {
        checkoutModalClose.addEventListener('click', hideCheckoutModal);
    }

    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                hideCheckoutModal();
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Payment method change
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', handlePaymentMethodChange);
    });

    // Card input formatting
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');

    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }
    if (cardExpiry) {
        cardExpiry.addEventListener('input', formatCardExpiry);
    }
    if (cardCvv) {
        cardCvv.addEventListener('input', formatCardCvv);
    }
}

function displayCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary">
                    <i class="fas fa-shopping-bag"></i>
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    cartContent.innerHTML = `
        <div class="cart-items">
            <div class="cart-header">
                <h2>Cart Items (${cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
                <button class="btn btn-secondary clear-cart-btn" onclick="clearCart()">
                    <i class="fas fa-trash"></i>
                    Clear Cart
                </button>
            </div>
            
            <div class="cart-items-list">
                ${cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p class="item-price">$${item.price.toFixed(2)} each</p>
                        </div>
                        <div class="item-quantity">
                            <label>Quantity:</label>
                            <div class="quantity-controls">
                                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="item-total">
                            <span class="total-price">$${(item.price * item.quantity).toFixed(2)}</span>
                            <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="cart-summary">
            <div class="summary-card">
                <h3>Order Summary</h3>
                
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                
                <div class="summary-line">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                </div>
                
                <div class="summary-line">
                    <span>Tax:</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                
                <div class="summary-line total-line">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                
                ${shipping > 0 ? `
                    <div class="shipping-notice">
                        <i class="fas fa-info-circle"></i>
                        Add $${(50 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                ` : `
                    <div class="shipping-notice free-shipping">
                        <i class="fas fa-check-circle"></i>
                        You qualify for free shipping!
                    </div>
                `}
                
                <div class="checkout-actions">
                    <button class="btn btn-primary btn-full" onclick="proceedToCheckout()">
                        <i class="fas fa-lock"></i>
                        Proceed to Checkout
                    </button>
                    <a href="shop.html" class="btn btn-secondary btn-full">
                        <i class="fas fa-arrow-left"></i>
                        Continue Shopping
                    </a>
                </div>
                
                <div class="security-badges">
                    <div class="security-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>Secure Checkout</span>
                    </div>
                    <div class="security-item">
                        <i class="fas fa-lock"></i>
                        <span>SSL Protected</span>
                    </div>
                    <div class="security-item">
                        <i class="fas fa-undo"></i>
                        <span>30-Day Returns</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.min(10, newQuantity); // Max 10 items
        localStorage.setItem('cart', JSON.stringify(cart));
        updateUI();
        displayCart();
        showMessage('Cart updated', 'success');
    }
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateUI();
        displayCart();
        showMessage(`${item.name} removed from cart`, 'success');
    }
}

function clearCart() {
    if (cart.length === 0) return;

    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateUI();
        displayCart();
        showMessage('Cart cleared', 'success');
    }
}

function proceedToCheckout() {
    if (!currentUser) {
        showMessage('Please login to proceed with checkout', 'error');
        showAuthModal();
        return;
    }

    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }

    showCheckoutModal();
}

function showCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Pre-fill user information
        if (currentUser) {
            const nameField = document.getElementById('checkout-name');
            const emailField = document.getElementById('checkout-email');
            const phoneField = document.getElementById('checkout-phone');
            
            if (nameField) nameField.value = currentUser.name || '';
            if (emailField) emailField.value = currentUser.email || '';
            if (phoneField) phoneField.value = currentUser.phone || '';
        }
        
        updateCheckoutSummary();
    }
}

function hideCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function updateCheckoutSummary() {
    const summaryDetails = document.getElementById('checkout-summary-details');
    if (!summaryDetails) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    summaryDetails.innerHTML = `
        <div class="summary-items">
            ${cart.map(item => `
                <div class="summary-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="summary-totals">
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-line total-line">
                <span><strong>Total:</strong></span>
                <span><strong>$${total.toFixed(2)}</strong></span>
            </div>
        </div>
    `;
}

function handlePaymentMethodChange(e) {
    const cardDetails = document.getElementById('card-details');
    if (cardDetails) {
        cardDetails.style.display = e.target.value === 'card' ? 'block' : 'none';
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

function formatCardExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function formatCardCvv(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
}

function handleCheckout(e) {
    e.preventDefault();

    // Validate form
    const form = e.target;
    const formData = new FormData(form);
    
    const requiredFields = ['checkout-name', 'checkout-email', 'checkout-phone', 'checkout-address', 'checkout-city', 'checkout-zip'];
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            isValid = false;
            if (field) {
                field.style.borderColor = 'var(--error-color)';
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 3000);
            }
        }
    });

    // Validate payment method
    const paymentMethod = formData.get('payment');
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');

        if (!cardNumber?.value || cardNumber.value.replace(/\s/g, '').length < 16) {
            isValid = false;
            if (cardNumber) cardNumber.style.borderColor = 'var(--error-color)';
        }
        if (!cardExpiry?.value || cardExpiry.value.length < 5) {
            isValid = false;
            if (cardExpiry) cardExpiry.style.borderColor = 'var(--error-color)';
        }
        if (!cardCvv?.value || cardCvv.value.length < 3) {
            isValid = false;
            if (cardCvv) cardCvv.style.borderColor = 'var(--error-color)';
        }
    }

    if (!isValid) {
        showMessage('Please fill in all required fields correctly', 'error');
        return;
    }

    // Process order
    processOrder(formData);
}

function processOrder(formData) {
    // Generate order number
    orderNumber = 'SW' + Date.now().toString().slice(-8);
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order object
    const order = {
        orderNumber,
        userId: currentUser.id,
        items: [...cart],
        subtotal,
        shipping,
        tax,
        total,
        customerInfo: {
            name: formData.get('checkout-name') || document.getElementById('checkout-name').value,
            email: formData.get('checkout-email') || document.getElementById('checkout-email').value,
            phone: formData.get('checkout-phone') || document.getElementById('checkout-phone').value,
            address: formData.get('checkout-address') || document.getElementById('checkout-address').value,
            city: formData.get('checkout-city') || document.getElementById('checkout-city').value,
            zip: formData.get('checkout-zip') || document.getElementById('checkout-zip').value
        },
        paymentMethod: formData.get('payment'),
        orderDate: new Date().toISOString(),
        status: 'confirmed'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Send order details to WhatsApp with image URLs
    let paymentDetails = '';
    if (order.paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        paymentDetails = `\nCard Number: ${cardNumber}\nExpiry: ${cardExpiry}\nCVV: ${cardCvv}`;
    } else if (order.paymentMethod === 'paypal') {
        paymentDetails = '\nPayPal selected';
    } else {
        paymentDetails = '\nCash on Delivery';
    }

    let itemsList = '';
    cart.forEach(item => {
        const price = item.price;
        const qty = item.quantity;
        const itemTotal = price * qty;
        itemsList += `\n- ${item.name} x ${qty}: $${itemTotal.toFixed(2)}\n  Image: ${item.image}`;
    });

    const message = `New Order:\n\nOrder Number: ${orderNumber}\n\nShipping Info:\nName: ${order.customerInfo.name}\nEmail: ${order.customerInfo.email}\nPhone: ${order.customerInfo.phone}\nAddress: ${order.customerInfo.address}, ${order.customerInfo.city} ${order.customerInfo.zip}\n\nPayment Method: ${getPaymentMethodName(order.paymentMethod)}${paymentDetails}\n\nItems:${itemsList}\n\nSubtotal: $${subtotal.toFixed(2)}\nShipping: $${shipping.toFixed(2)}\nTax: $${tax.toFixed(2)}\nTotal: $${total.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/+923074242761?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));

    // Hide checkout modal and show confirmation
    hideCheckoutModal();
    showOrderConfirmation(order);
    updateUI();
}

function showOrderConfirmation(order) {
    const modal = document.getElementById('confirmation-modal');
    const orderDetails = document.getElementById('order-details');
    
    if (orderDetails) {
        orderDetails.innerHTML = `
            <div class="order-info">
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> ${getPaymentMethodName(order.paymentMethod)}</p>
                <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
            </div>
            
            <div class="order-items">
                <h4>Items Ordered:</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
}

function printOrder() {
    if (!orderNumber) return;
    
    const printContent = `
        <html>
        <head>
            <title>Order Receipt - ${orderNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-info { margin-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f2f2f2; }
                .total { font-weight: bold; font-size: 1.2em; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SoundWave</h1>
                <h2>Order Receipt</h2>
            </div>
            ${document.getElementById('order-details').innerHTML}
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

function getPaymentMethodName(method) {
    switch (method) {
        case 'card': return 'Credit/Debit Card';
        case 'paypal': return 'PayPal';
        case 'cod': return 'Cash on Delivery';
        default: return method;
    }
}

// Add cart-specific styles
const cartStyles = `
.cart-header {
    padding: 120px 0 60px;
    background: linear-gradient(135deg, var(--gray-50), var(--white));
    text-align: center;
}

.cart-header h1 {
    font-size: 2.5rem;
    color: var(--gray-900);
    margin-bottom: 1rem;
}

.cart-section {
    padding: 40px 0 80px;
}

.cart-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: start;
}

.empty-cart {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    background: var(--gray-50);
    border-radius: 16px;
}

.empty-cart-icon {
    font-size: 4rem;
    color: var(--gray-300);
    margin-bottom: 1rem;
}

.empty-cart h2 {
    color: var(--gray-600);
    margin-bottom: 1rem;
}

.empty-cart p {
    color: var(--gray-500);
    margin-bottom: 2rem;
}

.cart-items {
    background: var(--white);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--gray-200);
}

.cart-header h2 {
    color: var(--gray-900);
    margin: 0;
}

.clear-cart-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
}

.cart-items-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.cart-item {
    display: grid;
    grid-template-columns: 80px 1fr auto auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: var(--gray-50);
    border-radius: 12px;
    transition: var(--transition);
}

.cart-item:hover {
    background: var(--gray-100);
}

.item-image img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
}

.item-details h3 {
    font-size: 1.1rem;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
}

.item-price {
    color: var(--gray-600);
    font-size: 0.9rem;
}

.item-quantity {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.item-quantity label {
    font-size: 0.9rem;
    color: var(--gray-600);
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
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: var(--transition);
    font-weight: 500;
}

.quantity-controls button:hover {
    background: var(--gray-200);
}

.quantity-controls .quantity {
    padding: 0 12px;
    font-weight: 500;
    min-width: 40px;
    text-align: center;
}

.item-total {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
}

.total-price {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-color);
}

.remove-item {
    background: var(--error-color);
    color: var(--white);
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}

.remove-item:hover {
    background: #dc2626;
    transform: scale(1.1);
}

.cart-summary {
    position: sticky;
    top: 100px;
}

.summary-card {
    background: var(--white);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.summary-card h3 {
    color: var(--gray-900);
    margin-bottom: 1.5rem;
    text-align: center;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: var(--gray-700);
}

.summary-line.total-line {
    border-top: 1px solid var(--gray-200);
    padding-top: 1rem;
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--gray-900);
}

.shipping-notice {
    background: var(--gray-100);
    padding: 1rem;
    border-radius: 8px;
    margin: 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--gray-700);
}

.shipping-notice.free-shipping {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
}

.shipping-notice i {
    color: var(--primary-color);
}

.free-shipping i {
    color: var(--success-color);
}

.checkout-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;
}

.security-badges {
    display: flex;
    justify-content: space-around;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--gray-200);
}

.security-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--gray-600);
}

.security-item i {
    font-size: 1.2rem;
    color: var(--success-color);
}

.checkout-modal-content {
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.checkout-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
}

.checkout-section h3 {
    color: var(--gray-900);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--gray-200);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.payment-option {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
}

.payment-option:hover {
    border-color: var(--primary-color);
    background: var(--gray-50);
}

.payment-option input[type="radio"] {
    margin-right: 1rem;
}

.payment-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}

.payment-label i {
    font-size: 1.2rem;
    color: var(--primary-color);
}

.card-details {
    background: var(--gray-50);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-top: 1rem;
}

.checkout-summary {
    background: var(--gray-50);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
}

.summary-items {
    margin-bottom: 1rem;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--gray-700);
}

.summary-totals .summary-line {
    font-size: 0.9rem;
}

.summary-totals .total-line {
    font-size: 1.1rem;
    color: var(--gray-900);
}

.checkout-btn {
    font-size: 1.1rem;
    padding: 15px 30px;
}

.confirmation-content {
    text-align: center;
    padding: 2rem;
}

.success-icon {
    font-size: 4rem;
    color: var(--success-color);
    margin-bottom: 1rem;
}

.confirmation-content h2 {
    color: var(--gray-900);
    margin-bottom: 1rem;
}

.confirmation-content p {
    color: var(--gray-600);
    margin-bottom: 2rem;
}

.order-info {
    background: var(--gray-50);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
    text-align: left;
}

.order-info p {
    margin-bottom: 0.5rem;
    color: var(--gray-700);
}

.order-items {
    background: var(--gray-50);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
    text-align: left;
}

.order-items h4 {
    margin-bottom: 1rem;
    color: var(--gray-900);
}

.order-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: var(--gray-700);
}

.confirmation-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .cart-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .cart-item {
        grid-template-columns: 60px 1fr;
        gap: 1rem;
    }
    
    .item-quantity,
    .item-total {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--gray-200);
    }
    
    .cart-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .checkout-modal-content {
        margin: 1rem;
        max-height: 85vh;
    }
    
    .confirmation-actions {
        flex-direction: column;
    }
    
    .security-badges {
        flex-direction: column;
        gap: 1rem;
    }
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = cartStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.closeConfirmationModal = closeConfirmationModal;
window.printOrder = printOrder;