document.addEventListener("DOMContentLoaded", function () {
    function getErrorElement(input) {
      let errorEl = input.parentElement.querySelector(".error-message");
      if (!errorEl) {
        errorEl = document.createElement("small");
        errorEl.classList.add("error-message");
        input.parentElement.appendChild(errorEl);
      }
      return errorEl;
    }
  
    function showError(input, message) {
      const errorEl = getErrorElement(input);
      errorEl.innerText = message;
      errorEl.style.color = "red";
      input.classList.add("input-error");
    }
    function clearError(input) {
      const errorEl = input.parentElement.querySelector(".error-message");
      if (errorEl) {
        errorEl.innerText = "";
      }
      input.classList.remove("input-error");
    }
  
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  
    if (document.body.classList.contains("signUpBody")) {
      const registerForm = document.querySelector(".form");
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const repeatPasswordInput = document.getElementById("repeatPassword");
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
  
        if (passwordInput.value === "") {
          showError(passwordInput, "Mật khẩu không được để trống");
          isValid = false;
        } else if (passwordInput.value.length < 8) {
          showError(passwordInput, "Mật khẩu tối thiểu 8 ký tự");
          isValid = false;
        }
  
        if (repeatPasswordInput.value === "") {
          showError(repeatPasswordInput, "Mật khẩu xác nhận không được để trống");
          isValid = false;
        } else if (passwordInput.value !== repeatPasswordInput.value) {
          showError(repeatPasswordInput, "Mật khẩu không trùng khớp");
          isValid = false;
        }
  
        if (!isValid) return;
  
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some((user) => user.email === emailInput.value.trim());
        if (userExists) {
          showError(emailInput, "Email đã được đăng ký!");
          return;
        }
  
        const newUser = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value
        };
  
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
  
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        window.location.href = "./logIn.html";
      });
    }   
    if (document.body.classList.contains("signInBody")) {
      const loginForm = document.querySelector(".form");
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const emailInput = document.getElementById("email"),
          passwordInput = document.getElementById("password");
    
        [emailInput, passwordInput].forEach(clearError);
        let valid = true;
        if (emailInput.value.trim() === "") {
          showError(emailInput, "Email không được để trống");
          valid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
          showError(emailInput, "Email không đúng định dạng");
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
          alert("Đăng nhập admin thành công!");
          localStorage.setItem("currentUser", JSON.stringify({ email: "admin123@gmail.com", role: "admin" }));
          window.location.href = "../../assets/html/dashborad.html";
          return;
        }
    
        let user = users.find(
          (u) => u.email === emailInput.value.trim() && u.password === passwordInput.value
        );
    
        if (user) {
          alert("Đăng nhập thành công!");
          localStorage.setItem("currentUser", JSON.stringify(user));
          window.location.href = "./home.html";
        } else {
          showError(emailInput, "Email hoặc mật khẩu không chính xác!");
          showError(passwordInput, "Email hoặc mật khẩu không chính xác!");
        }
      });
    }
    
  });