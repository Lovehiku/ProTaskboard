// js/ui/modal.js
function setupModal(tasks) {
  const addBtn = document.getElementById("addTaskBtn");
  const modal = document.getElementById("taskModal");
  const cancelBtn = document.getElementById("cancelTaskBtn");
  const form = document.getElementById("taskForm");

  addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));

  form.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.getElementById("taskPriority").value;

    const newTask = new Task(Date.now(), title, description, "todo", priority, dueDate);
    tasks.push(newTask);

    saveTasks(tasks);
    renderBoard(tasks);
    setupDragAndDrop(tasks);

    modal.classList.add("hidden");
    form.reset();
  });
}
