// js/models/taskModel.js
class Task {
  constructor(id, title, description, status, priority, dueDate) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;       // "todo", "in-progress", "done"
    this.priority = priority;   // "low", "medium", "high"
    this.dueDate = dueDate;
  }
}
