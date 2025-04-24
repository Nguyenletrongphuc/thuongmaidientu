document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    try {
        // Fetch thông tin người dùng
        const response = await fetch("http://localhost:5000/api/users/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Không thể lấy thông tin người dùng!");
        }

        const user = await response.json();

        // Render thông tin người dùng
        document.getElementById("name").value = user.name;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone || "";
        document.getElementById("address").value = user.address || "";

        // Xử lý sự kiện lưu thay đổi
        document.getElementById("saveChangesButton").addEventListener("click", async () => {
            const updatedUser = {
                name: document.getElementById("name").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
            };

            try {
                const saveResponse = await fetch("http://localhost:5000/api/users/profile", {
                    method: "PUT", // Sử dụng phương thức PUT để cập nhật
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (!saveResponse.ok) {
                    throw new Error("Không thể lưu thay đổi!");
                }

                alert("Lưu thay đổi thành công!");
            } catch (error) {
                console.error("Lỗi khi lưu thay đổi:", error);
                alert("Có lỗi xảy ra khi lưu thay đổi!");
            }
        });
    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra khi tải thông tin người dùng!");
    }
});