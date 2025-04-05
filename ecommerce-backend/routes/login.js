document.querySelector(".sign-in-container form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.querySelector(".sign-in-container input[placeholder='Email']").value;
    const password = document.querySelector(".sign-in-container input[placeholder='Password']").value;

    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data.name);
        window.location.href = "/index.html"; // Chuyển về trang chủ
    } else {
        alert(data.message);
    }
});
