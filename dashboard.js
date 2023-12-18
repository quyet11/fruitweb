// Lấy thông tin người dùng từ localStorage (đã đăng nhập thành công)
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Hiển thị thông tin người dùng
function displayUserInfo() {
    const userInfoElement = document.getElementById("userInfo");

    if (loggedInUser) {
        userInfoElement.innerHTML = `
            <p>Họ và Tên: ${loggedInUser.namee}</p>
            <p>Điện thoại: ${loggedInUser.phone}</p>
            <p>Tên đăng nhập: ${loggedInUser.username}</p>
            <p>Mật khẩu: ${loggedInUser.password}</p>
        `;
    } else {
        userInfoElement.textContent = "Không có người dùng đăng nhập.";
    }
}

// Gọi hàm hiển thị thông tin người dùng khi trang tải lên
displayUserInfo();