let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function startApp() {
  document.getElementById("introScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

if (!localStorage.getItem("username")) {
  const userName = prompt("Hi there! What's your name?");
  if (userName && userName.trim() !== "") {
    localStorage.setItem("username", userName.trim());
  } else {
    localStorage.setItem("username", "Friend");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("username") || "Friend";
  const greetingDiv = document.getElementById("greetingText");
  if (greetingDiv) {
    greetingDiv.textContent = `👋 Hello, ${name}! Ready to conquer your day?`;
  }
});

const quotes = [
  "✨ Explore,discover,learn!",
  "💪 You've got this!",
  "⏰ One task at a time.",
  "🧘‍♀️ Focus brings clarity."
];
setInterval(() => {
  const bot = document.getElementById("emojiBot");
  bot.textContent = `📋 “${quotes[Math.floor(Math.random() * quotes.length)]}”`;
}, 4000);

function addTask() {
  const name = document.getElementById("taskName").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.querySelector('input[name="priority"]:checked').value;

  if (!name) {
    alert("Task name cannot be empty.");
    return;
  }

  tasks.push({
    id: Date.now(),
    name,
    dueDate,
    priority,
    completed: false
  });

  document.getElementById("taskName").value = "";
  document.getElementById("dueDate").value = "";
  saveTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newName = prompt("Edit task name:", task.name);
  if (newName && newName.trim()) {
    task.name = newName.trim();
    saveTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const search = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (currentFilter === "completed" && !task.completed) return false;
    if (currentFilter === "pending" && task.completed) return false;
    if (!task.name.toLowerCase().includes(search)) return false;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = `task priority-${task.priority} ${task.completed ? "complete" : ""}`;

    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})" />
        <strong>${task.name}</strong><br>
        <small>Due: ${task.dueDate || "N/A"} | Priority: ${task.priority}</small>
      </div>
      <div class="actions">
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    list.appendChild(li);
  });
}

renderTasks();
