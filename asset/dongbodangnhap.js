document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username"); // Lấy tên người dùng từ localStorage
    const navList = document.querySelector(".header__nav-list:last-child"); // Lấy danh sách menu
    const role = localStorage.getItem("role");

    if (username) {
        navList.innerHTML = `
            <li class="header__nav-item header__nav-user">
                <img src="/asset/img/user-img-default.webp" alt="" class="header__nav-item__user-img">
                <span class="header__nav-item__user-name rainbow-username">${username}</span>
                <ul class="header__nav-user-menu">
                    <li class="header__nav-user__item">
                        <a href="profile.html">Tài khoản</a>
                    </li>
                    <li class="header__nav-user__item">
                        <a href="">Địa chỉ</a>
                    </li>
                    <li class="header__nav-user__item">
                        <a href="donhang.html">Đơn mua</a>
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
            localStorage.removeItem("cart"); // Xóa giỏ hàng (nếu có)
            localStorage.removeItem("token");    // Xóa token (nếu có)
            localStorage.removeItem("role"); // Xóa role (nếu có)
            adminLink.style.display = "none";
            window.location.href = "index.html"; // Chuyển hướng về trang chủ
            location.reload(); // Tải lại trang
            
        });
    } else {
        // Nếu chưa đăng nhập, hiển thị nút Đăng ký và Đăng nhập
        navList.innerHTML = `
            <li class="header__nav-item">
                <button class="signup btn-9">
                    <a href="signup.html">Đăng Nhập/Đăng Ký</a>
                </button>
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
        existing.cartQuantity+= 1;
    } else {
        cart.push({ ...product, cartQuantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: 'Giỏ hàng của bạn + 1!',
});
}
document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem("role"); // Lấy role từ localStorage
    const adminLink = document.getElementById("adminLink"); // Lấy thẻ <a> điều hướng đến admin.html

    if (role === "admin") {
        adminLink.style.display = "block"; // Hiển thị thẻ <a> nếu role là admin
    }else {
        adminLink.style.display = "none"; // Ẩn thẻ <a> nếu role không phải là admin
    }
});
// Thêm CSS rainbow vào trang bằng JavaScript
const style = document.createElement('style');
style.innerHTML = `
.rainbow-username {
    font-weight: bold;
    font-size: 1.1em;
    background: linear-gradient(90deg, 
        #ff0000, #ff9900, #ffee00, #33ff00, #00ffee, #0066ff, #cc00ff, #ff0000);
    background-size: 400% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rainbow-move 3s linear infinite;
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
}
@keyframes rainbow-move {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
}
`;
document.head.appendChild(style);
