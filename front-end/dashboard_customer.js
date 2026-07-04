// ==========================================
// CEK LOGIN CUSTOMER
// ==========================================

const NAMA_PELANGGAN_AKTIF =
    localStorage.getItem("name") ||
    "Pelanggan";

const USER_ID =
    localStorage.getItem("userId");

let cart = [];

// ==========================================
// INIT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const greeting =
        document.getElementById(
            "userNameGreeting"
        );

    if (greeting) {

        greeting.style.display =
            "inline";

        greeting.textContent =
            `Halo, ${NAMA_PELANGGAN_AKTIF} 👋`;
    }

    loadProducts();

});

// ==========================================
// LOGOUT
// ==========================================

function handleLogout() {

    const confirmLogout =
        confirm("Yakin ingin logout?");

    if (!confirmLogout) return;

    localStorage.clear();

    window.location.href =
        "login.html";
}

// ==========================================
// LOAD PRODUK DARI DATABASE
// ==========================================

async function loadProducts() {

    const productContainer =
        document.getElementById(
            "productContainer"
        );

    productContainer.innerHTML =
        "<div class='loading-text'>Memuat produk...</div>";

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/products"
            );

        const products =
            await response.json();

        productContainer.innerHTML = "";

        products.forEach(product => {

            const harga =
                Number(product.price);

            const hargaRupiah =
                harga.toLocaleString(
                    "id-ID"
                );

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "product-card";

            card.innerHTML = `
                <div>

                    <div class="product-image-container">

                        <div class="product-badge">
                            Stok ${product.stock}
                        </div>

                        <img
                            src="assets/satu-botol.png"
                            alt="${product.name}"
                        >

                    </div>

                    <h3>${product.name}</h3>

                    <p class="product-desc">
                        Madu murni Gunung Latimojong.
                    </p>

                    <div class="product-price">
                        Rp ${hargaRupiah}
                    </div>

                </div>

                <button
                    class="btn-add-cart"
                    onclick="addToCart(
                        ${product.id},
                        '${product.name}',
                        ${harga}
                    )"
                >
                    Tambah ke Keranjang
                </button>
            `;

            productContainer.appendChild(
                card
            );

        });

    } catch (error) {

        productContainer.innerHTML =
            "<div class='loading-text'>Gagal memuat produk</div>";

        console.error(error);

    }

}

// ==========================================
// KERANJANG
// ==========================================

function addToCart(id, nama, harga) {

    const item =
        cart.find(
            product =>
                product.id === id
        );

    if (item) {

        item.qty++;

    } else {

        cart.push({
            id,
            nama,
            harga,
            qty: 1
        });

    }

    updateCartUI();

}

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    updateCartUI();

}

function updateCartUI() {

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartTotalPrice =
        document.getElementById(
            "cartTotalPrice"
        );

    let totalHarga = 0;

    cartItems.innerHTML = "";

    cart.forEach(item => {

        const subtotal =
            item.harga * item.qty;

        totalHarga += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div class="cart-item-info">

                    <h4>
                        ${item.nama}
                        (x${item.qty})
                    </h4>

                    <p>
                        Rp ${subtotal.toLocaleString("id-ID")}
                    </p>

                </div>

                <button
                    class="btn-remove"
                    onclick="removeFromCart(${item.id})"
                >
                    Hapus
                </button>

            </div>
        `;

    });

    cartCount.textContent =
        cart.reduce(
            (sum, item) =>
                sum + item.qty,
            0
        );

    cartTotalPrice.textContent =
        "Rp " +
        totalHarga.toLocaleString(
            "id-ID"
        );

}

// ==========================================
// MODAL KERANJANG
// ==========================================

function toggleCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );

    modal.style.display =
        modal.style.display === "flex"
            ? "none"
            : "flex";
}

// ==========================================
// CHECKOUT
// ==========================================

async function checkoutWA() {

    if (cart.length === 0) {

        alert(
            "Keranjang masih kosong!"
        );

        return;
    }

    try {

        let total = 0;

        cart.forEach(item => {

            total +=
                item.harga *
                item.qty;

        });

        const orderData = {

            user_id: USER_ID,

            quantity:
                cart.reduce(
                    (sum, item) =>
                        sum + item.qty,
                    0
                ),

            total_price: total,

            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.qty
            }))

        };
        const response =
            await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },
                    body: JSON.stringify(
                        orderData
                    )
                }
            );

        if (!response.ok) {

            throw new Error(
                "Gagal checkout"
            );

        }

        const nomorWA =
            "6285391832772";

        let pesan =
            `Halo Admin Maduna,%0A%0A`;

        cart.forEach(item => {

            pesan +=
                `${item.nama} x${item.qty}%0A`;

        });

        pesan +=
            `%0ATotal: Rp ${total.toLocaleString("id-ID")}`;

        window.open(
            `https://wa.me/${nomorWA}?text=${pesan}`,
            "_blank"
        );

        cart = [];

        updateCartUI();

        toggleCart();

        alert(
            "Pesanan berhasil dibuat"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Gagal checkout"
        );

    }

}

// ==========================================
// RIWAYAT PESANAN
// ==========================================

function toggleHistory() {

    const modal =
        document.getElementById(
            "historyModal"
        );

    if (
        modal.style.display ===
        "flex"
    ) {

        modal.style.display =
            "none";

    } else {

        renderHistory();

        modal.style.display =
            "flex";
    }

}

async function renderHistory() {

    const historyItems = document.getElementById("historyItems");
    const token = localStorage.getItem("token");
    
    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Sesi Habis',
            text: 'Sesi login telah berakhir. Silakan login kembali.',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = "login.html";
        });
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/orders/history/${USER_ID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const orders =
            await response.json();

        historyItems.innerHTML = "";

        if (
            orders.length === 0
        ) {

            historyItems.innerHTML =
                `
            <tr>
                <td colspan="4">
                    Belum ada pesanan
                </td>
            </tr>
            `;

            return;
        }

        orders.forEach(order => {

            historyItems.innerHTML += `
                <tr>

                    <td>${order.id}</td>

                    <td>
                        ${new Date(
                order.order_date
            ).toLocaleDateString(
                "id-ID"
            )}
                    </td>

                    <td>
                        Rp ${Number(
                order.total_price
            ).toLocaleString(
                "id-ID"
            )}
                    </td>

                    <td>

                        <span class="
                        status-badge
                        status-${order.status}
                        ">

                        ${order.status}

                        </span>

                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}