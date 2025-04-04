document.addEventListener("DOMContentLoaded", function () {
  const navbarRight = document.querySelector(".navbar_right");
  const loginLink = navbarRight.querySelector(
    'a[href="./pages/auth/logIn.html"]'
  );
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    if (loginLink) loginLink.style.display = "none";

    const welcomeText = document.createElement("span");
    welcomeText.textContent = `Xin chào, ${currentUser.fullname}`;
    welcomeText.style.color = "yellow";
    welcomeText.style.marginRight = "10px";
    navbarRight.appendChild(welcomeText);

    const logoutLink = document.createElement("a");
    logoutLink.textContent = "Đăng xuất";
    logoutLink.href = "#";
    logoutLink.classList.add("right");
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      alert("Đăng xuất thành công!");
      window.location.href = "./index.html";
    });
    navbarRight.appendChild(logoutLink);

    if (currentUser.role === "admin") {
      const adminLink = document.createElement("a");
      adminLink.href = "./pages/admin/dashboard.html";
      adminLink.textContent = "Quản lý";
      adminLink.classList.add("right");
      navbarRight.appendChild(adminLink);
    }
  }

  const startBtn = document.querySelector(".on_img_button");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      window.location.href = "./pages/booking/schedule.html";
    });
  }
});
