document.addEventListener("DOMContentLoaded", () => {
    // Xử lý đăng ký
    const signUpForm = document.querySelector(".sign-up-container form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async (event) => {
            console.log("Đăng ký được kích hoạt"); // Log kiểm tra
            event.preventDefault(); // Ngăn form gửi dữ liệu theo cách mặc định

            // Thu thập dữ liệu từ form
            const userData = {
                name: signUpForm.querySelector("input[placeholder='Name']").value,
                email: signUpForm.querySelector("input[placeholder='Email']").value,
                password: signUpForm.querySelector("input[placeholder='Password']").value,
                phone: signUpForm.querySelector("input[placeholder='Phone']").value,
                address: signUpForm.querySelector("input[placeholder='Address']").value,
            };

            try {
                // Gửi dữ liệu đến API
                const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();
                console.log(result); // Log phản hồi từ server
                alert(result.message); // Hiển thị thông báo từ server
                if (response.ok) {
                    document.getElementById("container").classList.remove("right-panel-active"); // Chuyển sang giao diện đăng nhập
                }
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Đã xảy ra lỗi khi kết nối đến server!");
            }
        });
    }

    // Xử lý đăng nhập
    const signInForm = document.querySelector(".sign-in-container form");
    if (signInForm) {
        signInForm.addEventListener("submit", async (event) => {
            console.log("Đăng nhập được kích hoạt"); // Log kiểm tra
            event.preventDefault(); // Ngăn form gửi dữ liệu theo cách mặc định

            // Thu thập dữ liệu từ form
            const loginData = {
                email: signInForm.querySelector("input[placeholder='Email']").value,
                password: signInForm.querySelector("input[placeholder='Password']").value,
            };

            try {
                // Gửi yêu cầu đăng nhập đến API
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                const result = await response.json();
                console.log(result); // Log phản hồi từ server

                if (response.ok) {
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem("username", result.name);
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("role", result.role);

                    // Hiển thị thông báo trên console
                    console.log(`Chào mừng ${result.name}!`);
                    console.log(`Role của người dùng: ${result.role}`);

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

    if (userDisplay) {
        const username = localStorage.getItem("username");
        if (username) {
            userDisplay.innerHTML = `${username} | <a href="#" id="logout-btn">Đăng xuất</a>`;

            // Gắn sự kiện sau khi gán innerHTML
            setTimeout(() => {
                const logoutButton = document.getElementById("logout-btn");
                if (logoutButton) {
                    logoutButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        localStorage.removeItem("token");
                        localStorage.removeItem("username");
                        localStorage.removeItem("cart");
                        adminLink.style.display = "none";
                        window.location.href = "index.html";
                    });
                }
            }, 0); // Đảm bảo DOM đã cập nhật
        } else {
            userDisplay.innerHTML = '<a href="dangnhap.html">Đăng nhập</a> | <a href="dangki.html">Đăng ký</a>';
        }
    }
});


