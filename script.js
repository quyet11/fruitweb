function toggleSignInForm() {
    var loginForm = document.getElementById("login");
    var registerForm = document.getElementById("register");

    // Toggle visibility of sign in form
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none"; // Hide register form if it's visible
    } else {
        loginForm.style.display = "none";
    }
}

function toggleRegisterForm() {
    var loginForm = document.getElementById("login");
    var registerForm = document.getElementById("register");

    // Toggle visibility of register form
    if (registerForm.style.display === "none") {
        registerForm.style.display = "block";
        loginForm.style.display = "none"; // Hide sign in form if it's visible
    } else {
        registerForm.style.display = "none";
    }
}


// cart
let iconCart = document.querySelector('.search');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.products_box');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.search span')

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})
const addDatatoHTML = () => {
    if (!listProductHTML) {
        console.error('Element with class "listProduct" not found.');
        return;
    }
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('products_card');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <div class="products_img">
                <img src="${product.image}" alt= "">
            </div>
            <div class="products_tag">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addcart">Add to cart</button>
            </div>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addcart')) {
        let productCard = positionClick.closest('.products_card');
        if (productCard) {
            let product_id = productCard.dataset.id;
            if (product_id !== undefined) {
                console.log('Product ID:', product_id);
                addToCart(product_id);
            } else {
                console.error('Product ID is undefined.');
            }
        } else {
            console.error('Could not find parent element with class "products_card".');
        }
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);

    if (positionThisProductInCart < 0) {
        // If the product is not in the cart, add it with quantity 1
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else if (carts[positionThisProductInCart].quantity < 10) {
        // If the product is in the cart and the quantity is less than 10, increase the quantity
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    } else {
        // If the quantity is already 10 or more, show "Out of Stock" message
        alert('Out of Stock. You cannot add more than 10 units of this product.');
        return;
    }

    // Update the cart display
    addCarttoHTML();
    // Save the cart to local storage
    addCarttoMemory();
}

const addCarttoMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}


const addCarttoHTML = () => {
    if (!listCartHTML) {
        console.error('Element with class "listCart" not found.');
        return;
    }

    listCartHTML.innerHTML = '';
    let totalQuantity = 0;


    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;

            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);

            if (positionProduct !== -1) {
                let info = listProducts[positionProduct];
                newCart.innerHTML = `
                    <div class="image">
                        <img src="${info.image}" alt="">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">
                        $${info.price* cart.quantity}
                    </div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${cart.quantity}</span>
                        <span class="plus">></span>
                    </div>
                `;
                listCartHTML.appendChild(newCart);
            } else {
                console.error(`Product with ID ${cart.product_id} not found in listProducts.`);
            }
        });
    }
    iconCartSpan.innerText = totalQuantity;
};



listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    // Tìm phần tử cha có thuộc tính dataset.id
    let productElement = positionClick.closest('.item');

    if (productElement) {
        let product_id = productElement.dataset.id;

        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
            ChangeQuantity(product_id, type);
        }
    }
});

const ChangeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;

                break;

            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                }
                break;

        }
    }
    addCarttoMemory();
    addCarttoHTML();
}
const initApp = () => {
        // Lấy dữ liệu từ tệp json
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                listProducts = data;
                addDatatoHTML();

                //get cart from memory
                if (localStorage.getItem('cart')) {
                    carts = JSON.parse(localStorage.getItem('cart'));
                    addCarttoHTML();
                }
            })
    }
    // ... (previous code)

// Lấy phần tử nút "Check Out"
let checkOutButton = document.querySelector('.checkOut');

// Thêm sự kiện click cho nút "Check Out"
checkOutButton.addEventListener('click', () => {
    // Tính tổng số tiền của tất cả mặt hàng trong giỏ hàng
    let totalAmount = calculateTotalAmount();

    // Hiển thị thông báo với tổng số tiền
    alert(' Total Amount: $' + totalAmount);
});

// Hàm tính tổng số tiền của tất cả mặt hàng trong giỏ hàng
const calculateTotalAmount = () => {
    let totalAmount = 0;

    carts.forEach(cart => {
        let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);

        if (positionProduct !== -1) {
            let info = listProducts[positionProduct];
            totalAmount += info.price * cart.quantity;
        } else {
            console.error(`Product with ID ${cart.product_id} not found in listProducts.`);
        }
    });

    return totalAmount;
};

// ... (previous code)

// Thêm sự kiện click cho nút "Check Out"
checkOutButton.addEventListener('click', () => {
    // Tính tổng số tiền của tất cả mặt hàng trong giỏ hàng
    let totalAmount = calculateTotalAmount();



    // Xóa dữ liệu khỏi Shopping Cart và clear cả span
    clearShoppingCart();
});

// Hàm xóa dữ liệu khỏi Shopping Cart và clear cả span
const clearShoppingCart = () => {
    // Lấy phần tử chứa danh sách sản phẩm trong giỏ hàng
    let listCart = document.querySelector('.listCart');

    // Đặt lại thông tin tên và số lượng trong các span
    let nameSpans = document.querySelectorAll('.name');
    let quantitySpans = document.querySelectorAll('.quantity span:nth-child(2)');

    nameSpans.forEach(span => {
        span.textContent = 'NAME';
    });

    quantitySpans.forEach(span => {
        span.textContent = '1'; // hoặc bất kỳ giá trị mặc định nào bạn muốn
    });

    // Xóa toàn bộ nội dung trong danh sách giỏ hàng
    listCart.innerHTML = '';

    // Reset the carts array to an empty array
    carts = [];

    // Update the cart display
    addCarttoHTML();

    // Save the empty cart to local storage
    addCarttoMemory();
};

// ... (remaining code)






initApp();