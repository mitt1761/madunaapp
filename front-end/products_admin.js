const token = localStorage.getItem("token");

let allProducts = [];

// ======================
// LOAD PRODUK
// ======================

async function loadProducts() {
    try {
        const response = await fetch("http://localhost:5000/api/products");
        allProducts = await response.json();
        
        document.getElementById("totalProducts").textContent = allProducts.length;
        renderProducts(allProducts);
    } catch (error) {
        console.error(error);
        alert("Gagal mengambil data produk");
    }
}

function renderProducts(products) {
    const table = document.getElementById("productsTable");
    table.innerHTML = "";

    if (products.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="empty-state text-muted opacity-75">
                        <i class="bi bi-mailbox fs-1 mb-2 d-block"></i>
                        <p class="mb-0 fw-medium">Tidak ditemukan data yang sesuai.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(product => {
        table.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="assets/${product.image}" class="product-img shadow-sm rounded-3" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td class="fw-medium text-dark">${product.name}</td>
            <td>${product.volume}</td>
            <td class="fw-semibold text-primary">Rp ${Number(product.price).toLocaleString("id-ID")}</td>
            <td>${product.stock}</td>
            <td>
                <div class="d-flex justify-content-center align-items-center gap-2 text-nowrap">
                    <button
                    class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium d-flex align-items-center"
                    onclick="openEditModal(${product.id}, '${product.name}', '${product.category}', '${product.volume}', \`${product.description || ""}\`, '${product.image}', ${product.price}, ${product.stock})">
                        <i class="bi bi-pencil-square me-1"></i>Edit
                    </button>
                    <button
                    class="btn btn-sm btn-outline-danger rounded-pill px-3 fw-medium d-flex align-items-center"
                    onclick="deleteProduct(${product.id})">
                        <i class="bi bi-trash me-1"></i>Hapus
                    </button>
                </div>
            </td>
        </tr>
        `;
    });
}

// REALTIME SEARCH
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const keyword = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
});

// ======================
// MODAL EDIT
// ======================

function openEditModal(
id,
name,
category,
volume,
description,
image,
price,
stock
){


document
.getElementById("editModal")
.style.display = "flex";

document
.getElementById("editId")
.value = id;

document
.getElementById("editName")
.value = name;

document
.getElementById("editCategory")
.value = category;

document
.getElementById("editVolume")
.value = volume;

document
.getElementById("editDescription")
.value = description;

document
.getElementById("editImage")
.value = image;

document
.getElementById("editPrice")
.value = price;

document
.getElementById("editStock")
.value = stock;


}

// ======================
// TOMBOL TAMBAH PRODUK
// ======================

window.openAddModal = function() {
    const editModal = document.getElementById("editModal");
    if(editModal) editModal.style.display = "flex";

    const editId = document.getElementById("editId");
    if(editId) editId.value = "";

    const editName = document.getElementById("editName");
    if(editName) editName.value = "";

    const editCategory = document.getElementById("editCategory");
    if(editCategory) editCategory.value = "";

    const editVolume = document.getElementById("editVolume");
    if(editVolume) editVolume.value = "";

    const editDescription = document.getElementById("editDescription");
    if(editDescription) editDescription.value = "";

    const editImage = document.getElementById("editImage");
    if(editImage) editImage.value = "";

    const editPrice = document.getElementById("editPrice");
    if(editPrice) editPrice.value = "";

    const editStock = document.getElementById("editStock");
    if(editStock) editStock.value = "";
};

// ======================
// CHOOSE FILE
// ======================

const imageFile =
document.getElementById(
"editImageFile"
);

if(imageFile){


imageFile.addEventListener(
"change",
function(){

    if(this.files.length > 0){

        document
        .getElementById("editImage")
        .value =
        this.files[0].name;

    }

});


}

// ======================
// SIMPAN
// ======================

const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
        const id = document.getElementById("editId").value;
        const isNewProduct = id === "";
        const url = isNewProduct ? "http://localhost:5000/api/products" : `http://localhost:5000/api/products/${id}`;
        const method = isNewProduct ? "POST" : "PUT";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: document.getElementById("editName").value,
                    category: document.getElementById("editCategory").value,
                    volume: document.getElementById("editVolume").value,
                    description: document.getElementById("editDescription").value,
                    image: document.getElementById("editImage").value,
                    price: document.getElementById("editPrice").value,
                    stock: document.getElementById("editStock").value
                })
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan produk");
            }

            document.getElementById("editModal").style.display = "none";
            loadProducts();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan produk");
        }
    });
}

// ======================
// HAPUS PRODUK
// ======================

window.deleteProduct = async function(id){
    Swal.fire({
        title: 'Yakin hapus produk?',
        text: 'Data produk akan dihapus permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
        if(result.isConfirmed) {
            try{
                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method:"DELETE",
                    headers:{ Authorization: `Bearer ${token}` }
                });
                if(!response.ok) throw new Error("Gagal menghapus produk");
                loadProducts();
            }catch(error){
                console.error(error);
                alert("Gagal menghapus produk");
            }
        }
    });
}

// ======================
// CANCEL
// ======================

const cancelBtn = document.getElementById("cancelBtn");
if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        document.getElementById("editModal").style.display = "none";
    });
}

// ======================
// REFRESH
// ======================

const refreshBtn = document.getElementById("refreshBtn");
if (refreshBtn) {
    refreshBtn.addEventListener("click", loadProducts);
}

// ======================
// INIT
// ======================

loadProducts();
