document.addEventListener("DOMContentLoaded", () => {
    // ✅ Xử lý đăng nhập bằng Google từ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const role = params.get("role");

    if (token && name) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", name);
        localStorage.setItem("role", role);
        console.log(`✅ Đăng nhập Google: ${name} (${role})`);
        window.location.href = "index.html";
        return; // Dừng xử lý các phần còn lại vì đã redirect
    }

    // Xử lý đăng ký
    const signUpForm = document.querySelector(".sign-up-container form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async (event) => {
            console.log("Đăng ký được kích hoạt");
            event.preventDefault();

            const userData = {
                name: signUpForm.querySelector("input[placeholder='Name']").value,
                email: signUpForm.querySelector("input[placeholder='Email']").value,
                password: signUpForm.querySelector("input[placeholder='Password']").value,
                phone: signUpForm.querySelector("input[placeholder='Phone']").value,
                address: signUpForm.querySelector("input[placeholder='Address']").value,
            };

            try {
                const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();
                console.log(result);
                alert(result.message);
                if (response.ok) {
                    document.getElementById("container").classList.remove("right-panel-active");
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
            console.log("Đăng nhập được kích hoạt");
            event.preventDefault();

            const loginData = {
                email: signInForm.querySelector("input[placeholder='Email']").value,
                password: signInForm.querySelector("input[placeholder='Password']").value,
            };

            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                const result = await response.json();
                console.log(result);

                if (response.ok) {
                    localStorage.setItem("username", result.name);
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("role", result.role);

                    console.log(`Chào mừng ${result.name}!`);
                    console.log(`Role của người dùng: ${result.role}`);

                    window.location.href = "index.html";
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Đã xảy ra lỗi khi kết nối đến server!");
            }
        });
    }

    // Hiển thị tên người dùng nếu đã đăng nhập
    const userDisplay = document.getElementById("user-info");
    if (userDisplay) {
        const username = localStorage.getItem("username");
        if (username) {
            userDisplay.innerHTML = `${username} | <a href="#" id="logout-btn">Đăng xuất</a>`;
        } else {
            userDisplay.innerHTML = '<a href="dangnhap.html">Đăng nhập</a> | <a href="dangki.html">Đăng ký</a>';
        }
    }

    // Xử lý đăng xuất
    setTimeout(() => {
        const logoutButton = document.getElementById("logout-btn");
        if (logoutButton) {
            logoutButton.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("cart");
                localStorage.removeItem("role");
                const adminLink = document.getElementById("adminLink");
                if (adminLink) adminLink.style.display = "none";
                window.location.href = "index.html";
                location.reload();
            });
        }
    }, 0);
});
