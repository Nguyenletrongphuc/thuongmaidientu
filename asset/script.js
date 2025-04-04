document.addEventListener("DOMContentLoaded", () => {
    // Xử lý đăng ký
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Ngăn form gửi dữ liệu theo cách mặc định

            // Thu thập dữ liệu từ form
            const userData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
            };

            try {
                // Gửi dữ liệu đến API
                const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();
                alert(result.message); // Hiển thị thông báo từ server
                if (response.ok) {
                    window.location.href = "dangnhap.html"; // Chuyển hướng sau khi đăng ký thành công
                }
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Đã xảy ra lỗi khi kết nối đến server!");
            }
        });
    }

    // Xử lý đăng nhập
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Ngăn form gửi dữ liệu theo cách mặc định

            // Thu thập dữ liệu từ form
            const loginData = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
            };

            try {
                // Gửi yêu cầu đăng nhập đến API
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                const result = await response.json();

                if (response.ok) {
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem("username", result.name);
                    localStorage.setItem("token", result.token);

                    // Hiển thị thông báo trên console
                    console.log(`Chào mừng ${result.name}!`);

                    // Chuyển hướng về trang chủ
                    window.location.href = "index.html";
                } else {
                    alert(result.message); // Hiển thị lỗi từ server
                }
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Đã xảy ra lỗi khi kết nối đến server!");
            }
        });
    }

    // Hiển thị tên người dùng nếu đã đăng nhập
    const userDisplay = document.getElementById("user-info");
    const logoutButton = document.getElementById("logout-btn");

    if (userDisplay) {
        const username = localStorage.getItem("username");
        if (username) {
            userDisplay.innerHTML = `${username} | <a href="#" id="logout-btn">Đăng xuất</a>`;
        } else {
            userDisplay.innerHTML = '<a href="dangnhap.html">Đăng nhập</a> | <a href="dangki.html">Đăng ký</a>';
        }
    }

    // Xử lý đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "index.html"; // Quay về trang chủ
        });
    }
});

