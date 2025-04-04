document.addEventListener("DOMContentLoaded", function () {
    const navbarRight = document.querySelector(".navbar_right");
    const loginLink = navbarRight.querySelector('a[href="./pages/auth/logIn.html"]');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const start = document.querySelectorAll(".on_img_buttton");
    if (currentUser) {
        if (loginLink) loginLink.style.display = "none";
        const welcomeText = document.createElement("span");
        welcomeText.textContent = `Xin chào, ${currentUser.fullname}`;
        welcomeText.style.color = "yellow";
        welcomeText.style.marginRight = "10px";
        navbarRight.appendChild(welcomeText);   
        if (currentUser.role === "admin") {
            const adminLink = document.createElement("a");
            adminLink.href = "./pages/admin/dashboard.html";
            adminLink.textContent = "Quản lý";
            adminLink.classList.add("right");
            navbarRight.appendChild(adminLink);
        }
    }
});
