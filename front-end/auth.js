// ==========================================
// AUTH MIDDLEWARE FRONT-END
// ==========================================

(function () {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const page =
        window.location.pathname
        .split("/")
        .pop();

    // Halaman yang boleh diakses tanpa login
    const publicPages = [
        "login.html",
        "register.html",
        "index.html"
    ];

    if (publicPages.includes(page)) {
        return;
    }

    // Belum login
    if (!token) {

        alert("Silakan login terlebih dahulu!");

        window.location.href = "login.html";

        return;
    }

    // Halaman admin
    if (
        page.includes("admin")
        &&
        role !== "admin"
    ) {

        alert("Akses khusus admin!");

        window.location.href =
            "dashboard_customer.html";

        return;
    }

    // Halaman customer
    if (
        page.includes("customer")
        &&
        role !== "customer"
    ) {

        alert("Silakan login sebagai customer!");

        window.location.href =
            "dashboard_admin.html";

    }

})();