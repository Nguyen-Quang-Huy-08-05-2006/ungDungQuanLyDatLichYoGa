document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    if (currentUser.role === "admin" && window.location.pathname !== "/pages/admin/dashboard.html") {
      window.location.href = "../admin/dashboard.html";
    } else if (currentUser.role === "user" && window.location.pathname !== "/pages/booking/schedule.html") {
      window.location.href = "../booking/schedule.html";
    }
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
  let errorEl = input.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains("error-message")) {
    errorEl = document.createElement("p");
    errorEl.classList.add("error-message");
    input.parentNode.appendChild(errorEl);
  }
  errorEl.innerText = message;
  errorEl.style.color = "red";
  input.classList.add("input-error");
}

function clearError(input) {
  let errorEl = input.nextElementSibling;
  if (errorEl && errorEl.classList.contains("error-message")) {
    errorEl.innerText = "";
  }
  input.classList.remove("input-error");
}

function registerUser(event) {
  event.preventDefault();
  const nameInput = document.getElementById("name"),
    emailInput = document.getElementById("email"),
    passwordInput = document.getElementById("password"),
    repeatPasswordInput = document.getElementById("repeatPassword");

  [nameInput, emailInput, passwordInput, repeatPasswordInput].forEach(clearError);
  
  let isValid = true;

  if (nameInput.value.trim() === "") {
    showError(nameInput, "Họ và tên không được để trống");
    isValid = false;
  }

  if (emailInput.value.trim() === "") {
    showError(emailInput, "Email không được để trống");
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    showError(emailInput, "Email không đúng định dạng");
    isValid = false;
  }

  if (passwordInput.value.length < 8) {
    showError(passwordInput, "Mật khẩu tối thiểu 8 ký tự");
    isValid = false;
  }

  if (repeatPasswordInput.value !== passwordInput.value) {
    showError(repeatPasswordInput, "Mật khẩu không trùng khớp");
    isValid = false;
  }

  if (!isValid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find((user) => user.email === emailInput.value.trim())) {
    showError(emailInput, "Email đã được sử dụng");
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    fullname: nameInput.value.trim(),
    phone: "",
    role: "user",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công!");
  window.location.href = "./logIn.html";
}

function loginUser(event) {
  event.preventDefault();
  const emailInput = document.getElementById("email"),
    passwordInput = document.getElementById("password");

  [emailInput, passwordInput].forEach(clearError);

  let valid = true;
  if (emailInput.value.trim() === "") {
    showError(emailInput, "Email không được để trống");
    valid = false;
  }
  if (passwordInput.value === "") {
    showError(passwordInput, "Mật khẩu không được để trống");
    valid = false;
  }
  if (!valid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (
    emailInput.value.trim().toLowerCase() === "admin123@gmail.com" &&
    passwordInput.value === "admin6668899"
  ) {
    const adminUser = {
      id: "admin",
      email: "admin123@gmail.com",
      role: "admin",
      fullname: "Admin",
      phone: "",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("currentUser", JSON.stringify(adminUser));
    alert("Đăng nhập admin thành công!");
    window.location.href = "../admin/dashboard.html";
    return;
  }

  let user = users.find(
    (u) => u.email === emailInput.value.trim() && u.password === passwordInput.value
  );

  if (user) {
    alert("Đăng nhập thành công!");
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "../../index.html";
  } else {
    showError(emailInput, "Email hoặc mật khẩu không chính xác");
    showError(passwordInput, "Email hoặc mật khẩu không chính xác");
  }
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  alert("Đăng xuất thành công!");
  window.location.href = "../auth/logIn.html";
}

const form = document.querySelector(".form");
if (form) {
  form.addEventListener("submit", function (event) {
    if (window.location.pathname.includes("register.html")) {
      registerUser(event);
    } else if (window.location.pathname.includes("logIn.html")) {
      loginUser(event);
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutUser);
}
