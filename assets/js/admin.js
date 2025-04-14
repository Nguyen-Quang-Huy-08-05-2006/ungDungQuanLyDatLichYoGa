document.addEventListener("DOMContentLoaded", () => {
  const scheduleBody = document.getElementById("scheduleBody");
  const gymCount = document.getElementById("gymCount");
  const yogaCount = document.getElementById("yogaCount");
  const zumbaCount = document.getElementById("zumbaCount");
  const classSelect = document.getElementById("classSelect");
  const dateInput = document.getElementById("dateInput");
  const timeSelect = document.getElementById("timeSelect");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const filterClass = document.getElementById("filterClass");
  const filterEmail = document.getElementById("filterEmail");
  const filterDate = document.getElementById("filterDate");

  let scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
  let editIndex = null;

  function renderTable(list) {
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
    gymCount.textContent = scheduleList.filter(
      (item) => item.classId === "Gym"
    ).length;
    yogaCount.textContent = scheduleList.filter(
      (item) => item.classId === "Yoga"
    ).length;
    zumbaCount.textContent = scheduleList.filter(
      (item) => item.classId === "Zumba"
    ).length;
  }

  function applyFilter() {
    let filteredList = scheduleList;

    if (filterClass.value !== "all") {
      filteredList = filteredList.filter(
        (item) => item.classId === filterClass.value
      );
    }

    if (filterEmail.value) {
      filteredList = filteredList.filter((item) =>
        item.email.toLowerCase().includes(filterEmail.value.toLowerCase())
      );
    }

    if (filterDate.value) {
      filteredList = filteredList.filter(
        (item) => item.date === filterDate.value
      );
    }

    renderTable(filteredList);
  }

  document.getElementById("addBtn").addEventListener("click", () => {
    editIndex = null;
    classSelect.value = "";
    dateInput.value = "";
    timeSelect.value = "";
    openModal();
  });

  saveBtn.onclick = function () {
    const newSchedule = {
      classId: classSelect.value,
      date: dateInput.value,
      time: timeSelect.value,
      name: "Admin",
      email: "admin@example.com",
    };

    if (editIndex !== null) {
      scheduleList[editIndex] = newSchedule;
    } else {
      scheduleList.push(newSchedule);
    }

    localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
    renderTable(scheduleList);
    updateStats();
    closeModal();
  };

  cancelBtn.onclick = closeModal;

  function attachEventListeners() {
    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", function () {
        editIndex = this.dataset.index;
        const item = scheduleList[editIndex];
        classSelect.value = item.classId;
        dateInput.value = item.date;
        timeSelect.value = item.time;
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

  filterClass.addEventListener("change", applyFilter);
  filterEmail.addEventListener("input", applyFilter);
  filterDate.addEventListener("change", applyFilter);

  renderTable(scheduleList);
  updateStats();

  const classList = document.getElementById("classList");
  const classNameInput = document.getElementById("className");
  const classDescriptionInput = document.getElementById("classDescription");
  const classImageInput = document.getElementById("classImage");
  const saveClassBtn = document.getElementById("saveClassBtn");
  const classModal = document.getElementById("classModal");

  let classes = JSON.parse(localStorage.getItem("classes")) || [];
  let editingClassIndex = null;

  function renderClassCards() {
    classList.innerHTML = "";
    classes.forEach((cls, index) => {
      const card = document.createElement("div");
      card.className = "class-card";
      card.innerHTML = `
        <img src="${cls.image}" alt="${cls.name}" />
        <div class="card-body">
          <p class="card-title">${cls.name}</p>
          <p class="card-desc">${cls.description}</p>
          <button onclick="editClass(${index})" class="btn-edit">Sửa</button>
          <button onclick="deleteClass(${index})" class="btn-delete">Xoá</button>
        </div>
      `;
      classList.appendChild(card);
    });
  }

  saveClassBtn.onclick = function () {
    const newClass = {
      name: classNameInput.value,
      description: classDescriptionInput.value,
      image: classImageInput.value,
    };

    if (editingClassIndex !== null) {
      classes[editingClassIndex] = newClass;
    } else {
      classes.push(newClass);
    }

    localStorage.setItem("classes", JSON.stringify(classes));
    renderClassCards();
    closeClassModal();
  };

  window.editClass = (index) => {
    editingClassIndex = index;
    const cls = classes[index];
    classNameInput.value = cls.name;
    classDescriptionInput.value = cls.description;
    classImageInput.value = cls.image;
    openClassModal();
  };

  window.deleteClass = (index) => {
    classes.splice(index, 1);
    localStorage.setItem("classes", JSON.stringify(classes));
    renderClassCards();
  };

  renderClassCards();
});
