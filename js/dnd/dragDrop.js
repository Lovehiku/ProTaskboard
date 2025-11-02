// js/dnd/dragDrop.js

// This file uses the global `tasks` variable (defined in app.js).
// Make sure setupDragAndDrop() is called after renderBoard(...).

function setupDragAndDrop() {
  // Attach dragstart to current items
  const items = document.querySelectorAll(".task-item");
  items.forEach(item => {
    // remove previous listener if any to avoid duplicates
    item.ondragstart = null;
    item.addEventListener("dragstart", e => {
      // set id as plain text
      e.dataTransfer.setData("text/plain", item.dataset.id);
      // add visual cue
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", e => {
      item.classList.remove("dragging");
    });
  });

  // Attach drop handlers to the lists (UL elements)
  const lists = document.querySelectorAll(".task-list");
  lists.forEach(list => {
    // ensure handlers are added only once: remove and re-add
    list.ondragover = null;
    list.ondrop = null;

    list.addEventListener("dragover", e => {
      e.preventDefault(); // necessary to allow drop
    });

    list.addEventListener("drop", e => {
      e.preventDefault();
      const idStr = e.dataTransfer.getData("text/plain");
      if (!idStr) return;
      const id = Number(idStr);
      // find the task in the global tasks array
      const t = tasks.find(x => x.id === id);
      if (!t) return;

      // determine new status from nearest .board-column[data-status]
      const column = list.closest(".board-column");
      const newStatus = column ? column.dataset.status : null;
      if (!newStatus) return;

      // only act if status changed
      if (t.status !== newStatus) {
        t.status = newStatus;
        saveTasks(tasks);      // persist
        renderBoard(tasks);    // re-render full board
        setupDragAndDrop();    // reattach handlers to newly created elements
      } else {
        // still re-render to ensure DOM order may reflect drop position
        renderBoard(tasks);
        setupDragAndDrop();
      }
    });
  });
}
