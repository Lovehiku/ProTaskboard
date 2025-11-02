// js/views/boardView.js

// Renders a single task and wires edit/delete
function renderTask(task) {
  // create element
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.id = `task-${task.id}`;         // give a DOM id
  li.dataset.id = task.id;           // data-id
  li.draggable = true;

  li.innerHTML = `
    <div class="task-content">
      <h4>${escapeHtml(task.title)}</h4>
      <p>${escapeHtml(task.description || "")}</p>
      <small>Priority: ${escapeHtml(task.priority || "none")}</small><br/>
      <small>Due: ${escapeHtml(task.dueDate || "")}</small>
    </div>
    <div class="task-actions">
      <button class="edit-btn" title="Edit">✏️</button>
      <button class="delete-btn" title="Delete">🗑️</button>
    </div>
  `;

  // Delete: mutate global tasks, save, re-render full board
  li.querySelector(".delete-btn").addEventListener("click", () => {
    // tasks is global (defined in app.js)
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks(tasks);
    renderBoard(tasks);
    setupDragAndDrop();
  });

  // Edit: open prompt (simple). This mutates the task in place and saves.
  li.querySelector(".edit-btn").addEventListener("click", () => {
    // Better UX: replace prompts with modal later
    const newTitle = prompt("Edit Title:", task.title);
    if (newTitle === null) return; // cancelled
    const newDescription = prompt("Edit Description:", task.description || "");
    if (newDescription === null) return;
    const newDueDate = prompt("Edit Due Date (YYYY-MM-DD):", task.dueDate || "");
    if (newDueDate === null) return;
    const newPriority = prompt("Edit Priority (low/medium/high):", task.priority || "low");
    if (newPriority === null) return;

    // mutate the task in the global tasks array
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      tasks[idx].title = newTitle;
      tasks[idx].description = newDescription;
      tasks[idx].dueDate = newDueDate;
      tasks[idx].priority = newPriority;
      saveTasks(tasks);
      renderBoard(tasks);
      setupDragAndDrop();
    }
  });

  // Append to proper column (use data-status from section)
  const targetList = document.getElementById(
    task.status === "todo" ? "todoList" :
    task.status === "in-progress" ? "inProgressList" :
    "doneList"
  );

  if (targetList) targetList.appendChild(li);
}

// Render board given a task array (usually pass global tasks or filtered array)
function renderBoard(listOfTasks) {
  // clear lists
  document.getElementById("todoList").innerHTML = "";
  document.getElementById("inProgressList").innerHTML = "";
  document.getElementById("doneList").innerHTML = "";

  // when rendering a filtered list, we still want edit/delete to affect global tasks;
  // renderTask uses global tasks when mutating.
  listOfTasks.forEach(renderTask);
}

/* small helper to avoid HTML injection in content */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
