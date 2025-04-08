const classSelect = document.getElementById("classSelect");
const dateInput = document.getElementById("dateInput");
const timeSelect = document.getElementById("timeSelect");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const scheduleTable = document.querySelector("table");
const newScheduleBtn = document.querySelector(".new_schedule");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");

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
      <td>${item.class}</td>
      <td>${item.date}</td>
      <td>${item.time}</td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>
        <a href="#" class="editBtn" data-index="${index}">Sửa</a> |
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
  nameInput.value = "";
  emailInput.value = "";
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

function validate(schedule, ignoreIndex = -1) {
  if (
    !schedule.class ||
    !schedule.date ||
    !schedule.time ||
    !schedule.name ||
    !schedule.email
  ) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return false;
  }

  const isDuplicate = scheduleList.some(
    (item, i) =>
      i !== ignoreIndex &&
      item.class === schedule.class &&
      item.date === schedule.date &&
      item.time === schedule.time
  );

  if (isDuplicate) {
    alert("Lịch đã tồn tại.");
    return false;
  }

  return true;
}

function attachEventListeners() {
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.onclick = function () {
      const index = this.dataset.index;
      const item = scheduleList[index];

      classSelect.value = item.class;
      dateInput.value = item.date;
      timeSelect.value = item.time;
      nameInput.value = item.name;
      emailInput.value = item.email;

      isEdit = true;
      editIndex = index;
      openModal();
    };
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onclick = function () {
      const index = this.dataset.index;
      if (confirm("Bạn có chắc chắn muốn xoá lịch này?")) {
        scheduleList.splice(index, 1);
        localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
        renderTable();
      }
    };
  });
}

saveBtn.onclick = function () {
  const newSchedule = {
    class: classSelect.value,
    date: dateInput.value,
    time: timeSelect.value,
    name: nameInput.value,
    email: emailInput.value,
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
