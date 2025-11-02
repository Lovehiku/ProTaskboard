// js/app.js

// loadTasks / saveTasks are in storage.js
// sampleTasks is in js/data/tasks.js
// renderBoard / renderTask are in js/views/boardView.js
// setupDragAndDrop is in js/dnd/dragDrop.js
// setupModal is in js/ui/modal.js

// make tasks global (so other scripts can read/write it)
let tasks = loadTasks();

// If no saved tasks, use sample ones
if (!tasks || tasks.length === 0) {
  tasks = sampleTasks.slice(); // copy
  saveTasks(tasks);
}

// Initial render + behavior wiring
renderBoard(tasks);
setupDragAndDrop();   // uses global `tasks`
setupModal(tasks);    // modal uses tasks reference when adding

// Search functionality (filters board visually but keeps tasks global)
document.getElementById("searchInput").addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const filtered = tasks.filter(t => t.title.toLowerCase().includes(query));
  renderBoard(filtered);
  setupDragAndDrop(); // reattach drag handlers to currently rendered items
});

// Weekly / Monthly buttons
document.getElementById("weeklyView").addEventListener("click", () => {
  document.getElementById("weeklyView").classList.add("active");
  document.getElementById("monthlyView").classList.remove("active");
  showWeekly();
});

document.getElementById("monthlyView").addEventListener("click", () => {
  document.getElementById("monthlyView").classList.add("active");
  document.getElementById("weeklyView").classList.remove("active");
  showMonthly();
});

function showWeekly() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const weekly = tasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= startOfDay(now) && d <= endOfDay(nextWeek);
  });

  renderBoard(weekly);
  setupDragAndDrop();
}

function showMonthly() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthly = tasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  renderBoard(monthly);
  setupDragAndDrop();
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23,59,59,999);
  return x;
}

// Helper for other code to re-render full board after changes:
function refreshFullBoard() {
  renderBoard(tasks);
  setupDragAndDrop();
}
