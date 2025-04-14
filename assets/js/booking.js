document.addEventListener("DOMContentLoaded", () => {
  // ======================= PHẦN 1: QUẢN LÝ LỊCH HỌC =======================
  let scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
  let editIndex = null;

  function renderTable(list) {
    const scheduleBody = document.getElementById("scheduleBody");
    scheduleBody.innerHTML = "";

    list.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.classId}</td>
        <td>${item.date}</td>
        <td>${item.time}</td>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>
          <a href="#" class="editBtn" data-index="${index}" style="color:blue">Sửa</a> |
          <a href="#" class="deleteBtn" data-index="${index}" style="color:red">Xoá</a>
        </td>
      `;
      scheduleBody.appendChild(row);
    });

    attachEventListeners();
  }

  function updateStats() {
    const gymCount = scheduleList.filter(
      (item) => item.classId === "Gym"
    ).length;
    const yogaCount = scheduleList.filter(
      (item) => item.classId === "Yoga"
    ).length;
    const zumbaCount = scheduleList.filter(
      (item) => item.classId === "Zumba"
    ).length;

    document.getElementById("gymCount").innerText = gymCount;
    document.getElementById("yogaCount").innerText = yogaCount;
    document.getElementById("zumbaCount").innerText = zumbaCount;
  }

  function openModal() {
    document.getElementById("editModal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("editModal").style.display = "none";
    document.getElementById("classSelect").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("timeSelect").value = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    editIndex = null;
  }

  document.getElementById("saveBtn").addEventListener("click", (e) => {
    e.preventDefault();

    const newItem = {
      classId: document.getElementById("classSelect").value,
      date: document.getElementById("dateInput").value,
      time: document.getElementById("timeSelect").value,
      name: document.getElementById("nameInput").value,
      email: document.getElementById("emailInput").value,
    };

    if (editIndex !== null) {
      scheduleList[editIndex] = newItem;
    } else {
      scheduleList.push(newItem);
    }

    localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
    renderTable(scheduleList);
    updateStats();
    closeModal();
  });

  document.getElementById("addBtn").addEventListener("click", () => {
    openModal();
  });

  function attachEventListeners() {
    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", function () {
        editIndex = this.dataset.index;
        const item = scheduleList[editIndex];

        document.getElementById("classSelect").value = item.classId;
        document.getElementById("dateInput").value = item.date;
        document.getElementById("timeSelect").value = item.time;
        document.getElementById("nameInput").value = item.name;
        document.getElementById("emailInput").value = item.email;

        openModal();
      });
    });

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = this.dataset.index;
        scheduleList.splice(index, 1);
        localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
        renderTable(scheduleList);
        updateStats();
      });
    });
  }

  // Hiển thị dữ liệu từ Local Storage khi tải trang
  renderTable(scheduleList);
  updateStats();

  // ======================= PHẦN 2: QUẢN LÝ LỚP HỌC =======================
  let classes = JSON.parse(localStorage.getItem("classes")) || [];

  function renderClassCards() {
    const list = document.getElementById("classList");
    list.innerHTML = "";
    classes.forEach((cls, index) => {
      const card = document.createElement("div");
      card.className = "class-card";
      card.innerHTML = `
        <img src="${cls.image}" alt="${cls.name}">
        <div class="card-body">
          <p class="card-title">${cls.name}</p>
          <p class="card-desc">${cls.description}</p>
          <div class="card-actions">
            <button class="btn-edit" onclick="editClass(${index})">Sửa</button>
            <button class="btn-delete" onclick="deleteClass(${index})">Xoá</button>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  function saveClassesToLocalStorage() {
    localStorage.setItem("classes", JSON.stringify(classes));
  }

  document.getElementById("saveClassBtn").onclick = () => {
    const name = document.getElementById("className").value;
    const desc = document.getElementById("classDescription").value;
    const img = document.getElementById("classImage").value;

    if (editIndex !== null) {
      classes[editIndex] = {
        ...classes[editIndex],
        name,
        description: desc,
        image: img,
      };
    } else {
      classes.push({ id: Date.now(), name, description: desc, image: img });
    }

    saveClassesToLocalStorage();
    renderClassCards();
  };

  window.editClass = (index) => {
    const cls = classes[index];
    document.getElementById("className").value = cls.name;
    document.getElementById("classDescription").value = cls.description;
    document.getElementById("classImage").value = cls.image;
    editIndex = index;
  };

  window.deleteClass = (index) => {
    classes.splice(index, 1);
    saveClassesToLocalStorage();
    renderClassCards();
  };

  renderClassCards();
});
