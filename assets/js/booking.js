const classSelect = document.getElementById("classSelect");
const dateInput = document.getElementById("dateInput");
const timeSelect = document.getElementById("timeSelect");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const scheduleTable = document.querySelector("table");
const newScheduleBtn = document.querySelector(".new_schedule");
const modal = document.querySelector(".modal");

let scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
let isEdit = false;
let editIndex = -1;

function renderTable() {
  document
    .querySelectorAll("table tr:not(:first-child)")
    .forEach((row) => row.remove());

  scheduleList.forEach((item, index) => {
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
    scheduleTable.appendChild(row);
  });

  attachEventListeners();
}

function clearForm() {
  classSelect.value = "";
  dateInput.value = "";
  timeSelect.value = "";
}

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
  clearForm();
  isEdit = false;
  editIndex = -1;
}

function showWarning(message) {
  const warning = document.getElementById("warningMsg");
  warning.innerText = message;
  warning.style.display = "block";
}

function hideWarning() {
  const warning = document.getElementById("warningMsg");
  warning.innerText = "";
  warning.style.display = "none";
}

function validate(schedule, ignoreIndex = -1) {
  hideWarning();

  if (
    !schedule.classId ||
    !schedule.date ||
    !schedule.time ||
    !schedule.name ||
    !schedule.email
  ) {
    showWarning("Vui lòng điền đầy đủ thông tin.");
    return false;
  }

  const isDuplicate = scheduleList.some(
    (item, i) =>
      i !== ignoreIndex &&
      item.classId === schedule.classId &&
      item.date === schedule.date &&
      item.time === schedule.time
  );

  if (isDuplicate) {
    showWarning("Lịch đã tồn tại.");
    return false;
  }

  return true;
}
let deleteIndex = -1;
const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

function openConfirmModal(index) {
  deleteIndex = index;
  confirmModal.style.display = "block";
}

function closeConfirmModal() {
  deleteIndex = -1;
  confirmModal.style.display = "none";
}

confirmDeleteBtn.onclick = function () {
  if (deleteIndex !== -1) {
    scheduleList.splice(deleteIndex, 1);
    localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
    renderTable();
  }
  closeConfirmModal();
};

cancelDeleteBtn.onclick = closeConfirmModal;

confirmModal.onclick = function (e) {
  if (e.target === confirmModal) {
    closeConfirmModal();
  }
};

function openModal() {
  hideWarning();
  modal.style.display = "block";
}

function attachEventListeners() {
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.onclick = function () {
      const index = this.dataset.index;
      const item = scheduleList[index];
      classSelect.value = item.classId;
      dateInput.value = item.date;
      timeSelect.value = item.time;
      isEdit = true;
      editIndex = index;
      openModal();
    };
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onclick = function () {
      const index = this.dataset.index;
      openConfirmModal(index);
    };
  });
}

saveBtn.onclick = function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const newSchedule = {
    id: "SCH_" + Math.random().toString(36).substr(2, 9),
    userId: currentUser.id || currentUser.email || "guest",
    classId: classSelect.value,
    date: dateInput.value,
    time: timeSelect.value,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: currentUser.fullname,
    email: currentUser.email,
  };

  if (!validate(newSchedule, isEdit ? editIndex : -1)) return;

  if (isEdit) {
    scheduleList[editIndex] = newSchedule;
  } else {
    scheduleList.push(newSchedule);
  }

  localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
  renderTable();
  closeModal();
  hideWarning();
};

cancelBtn.onclick = closeModal;

newScheduleBtn.onclick = () => {
  clearForm();
  openModal();
};

modal.onclick = function (e) {
  if (e.target === modal) {
    closeModal();
  }
};

window.onload = renderTable;
