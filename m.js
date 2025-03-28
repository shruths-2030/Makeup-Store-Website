let cart = {};
let wishlist = {};

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', type);
    alertDiv.textContent = message;
    alertDiv.style.fontSize = '25px'; // Increased font size
    alertContainer.appendChild(alertDiv);

    // Remove alert after 3 seconds
    setTimeout(() => {
        alertContainer.removeChild(alertDiv);
    }, 5000);
}

function addToCart(name, price) {
    if (cart[name]) {
        cart[name].quantity++;
    } else {
        cart[name] = { price: price, quantity: 1 };
    }
    updateCartDisplay();
    showAlert(`${name} added to cart! See below`);
}

function removeFromCart(name) {
    if (cart[name]) {
        if (cart[name].quantity > 1) {
            cart[name].quantity--;
        } else {
            delete cart[name];
        }
        updateCartDisplay();
    }
}

function clearCart() {
    cart = {};
    updateCartDisplay();
    showAlert('Cart cleared');
}

function updateCartDisplay() {
    let cartItemsContainer = document.getElementById('cart-items');
    let cartCount = 0;
    let total = 0;
    
    let cartHTML = `
        <div class="cart-box">
            <h1>Shopping Cart 🛒</h1>
            <div class="cart-content">
    `;
    if (Object.keys(cart).length === 0) {
        cartHTML += '<p>Cart is empty.</p>';
    } else {
        cartHTML += '<div class="cart-list">';
        for (let item in cart) {
            cartCount += cart[item].quantity;
            total += cart[item].price * cart[item].quantity;
            cartHTML += `
                <div class="cart-item">
                    <span>${item} - ₹${cart[item].price}, Quantity: ${cart[item].quantity}</span>
                    <img class='bin-icon' src='bin.webp' onclick="removeFromCart('${item}')">
                </div>
            `;
        }
        cartHTML += '</div>';
        cartHTML += `<p><strong>Total: ₹${total}</strong></p>`;
    }
    
    cartHTML += `
        </div>
            <button id="clear" onclick="clearCart()" class="clear-cart-btn">Clear Cart</button>
        </div>
    `;
    
    cartItemsContainer.innerHTML = cartHTML;
}

// Add event listeners to wishlist icons after the page loads
document.addEventListener('DOMContentLoaded', () => {
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            toggleWishlist(this, name, price);
        });
    });
});

function toggleWishlist(iconElement, name, price) {
    if (wishlist[name]) {
        // Remove from wishlist
        delete wishlist[name];
        iconElement.textContent = '🤍';
        iconElement.classList.remove('active');
        showAlert(`${name} removed from wishlist`);
    } else {
        // Add to wishlist
        wishlist[name] = { price: price };
        iconElement.textContent = '❤️';
        iconElement.classList.add('active');
        showAlert(`${name} added to wishlist! See below`);
    }
    
    updateWishlistDisplay();
}

function updateWishlistDisplay() {
    let wishlistItemsContainer = document.getElementById('wishlist-items');
    
    let wishlistHTML = `
        <div class="wishlist-box">
            <h1>Wishlist 💕</h1>
            <div class="wishlist-content">
    `;
    
    if (Object.keys(wishlist).length === 0) {
        wishlistHTML += '<p>Wishlist is empty.</p>';
    } else {
        wishlistHTML += '<div class="wishlist-list">';
        for (let item in wishlist) {
            wishlistHTML += `
                <div class="wishlist-item">
                    <span>${item} - ₹${wishlist[item].price}</span>
                    <span class="remove-wishlist-item" onclick="removeFromWishlist('${item}')">🗑️</span>
                </div>
            `;
        }
        wishlistHTML += '</div>';
    }
    
    wishlistHTML += `
        </div>
            <button id="clear-wishlist" onclick="clearWishlist()">Clear Wishlist</button>
        </div>
    `;
    
    wishlistItemsContainer.innerHTML = wishlistHTML;
}

function removeFromWishlist(name) {
    // Remove from wishlist object
    delete wishlist[name];
    
    // Remove red heart from the product icon
    const productIcon = document.querySelector(`.wishlist-icon[data-name="${name}"]`);
    if (productIcon) {
        productIcon.textContent = '🤍';
        productIcon.classList.remove('active');
    }
    
    // Update wishlist display
    updateWishlistDisplay();
    showAlert(`${name} removed from wishlist`);
}

function clearWishlist() {
    // Remove active class and reset heart icon for all wishlist icons
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    wishlistIcons.forEach(icon => {
        icon.textContent = '🤍';
        icon.classList.remove('active');
    });
    
    // Clear wishlist object
    wishlist = {};
    updateWishlistDisplay();
    showAlert('Wishlist cleared');
}

function checkout() {
    if (Object.keys(cart).length === 0) {
        showAlert('Your cart is empty.', 'warning');
        return;
    }
    
    let total = 0;
    for (let item in cart) {
        total += cart[item].price * cart[item].quantity;
    }
    
    // Show updated checkout alert with total in Rupees
    showAlert(`Checkout successful! Total: ₹${total}\n\nThank you for shopping with us!`, 'success');
    clearCart();
}

// Initial display setup
window.onload = function() {
    updateCartDisplay();
    updateWishlistDisplay();
};