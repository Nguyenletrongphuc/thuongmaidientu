
document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username"); // Lấy tên người dùng từ localStorage
    const navList = document.querySelector(".header__nav-list:last-child"); // Lấy danh sách menu

    if (username) {
        // Nếu đã đăng nhập, hiển thị giao diện người dùng
        navList.innerHTML = `
            <li class="header__nav-item header__nav-user">
                <img src="/asset/img/user-img-default.webp" alt="" class="header__nav-item__user-img">
                <span class="header__nav-item__user-name">${username}</span>
                <ul class="header__nav-user-menu">
                    <li class="header__nav-user__item">
                        <a href="">Tài khoản</a>
                    </li>
                    <li class="header__nav-user__item">
                        <a href="">Địa chỉ</a>
                    </li>
                    <li class="header__nav-user__item">
                        <a href="">Đơn mua</a>
                    </li>
                    <li class="header__nav-user__item header__nav-user__ngancach">
                        <a href="#" id="logout-btn">Đăng xuất</a>
                    </li>
                </ul>
            </li>
        `;

        // Xử lý đăng xuất
        const logoutBtn = document.getElementById("logout-btn");
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("username"); // Xóa thông tin người dùng
            localStorage.removeItem("token");    // Xóa token (nếu có)
            location.reload(); // Tải lại trang
        });
    } else {
        // Nếu chưa đăng nhập, hiển thị nút Đăng ký và Đăng nhập
        navList.innerHTML = `
            <li class="header__nav-item phancach">
                <a href="/dangki.html">Đăng ký</a>
            </li>
            <li class="header__nav-item">
                <a href="/dangnhap.html">Đăng nhập</a>
            </li>
        `;
    }
});
//xừ lý thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra sản phẩm đã có chưa
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
}