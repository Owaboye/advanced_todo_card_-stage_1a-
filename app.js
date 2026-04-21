import {getTimeRemaining} from './helpers.js';

let todoState = {
  id: "todo-1",
  title: "Implement Stage 1a Advanced Todo Card",
  description: "This is a very long description that should trigger collapse on mobile and desktop. It demonstrates the full expand/collapse behavior required by the spec and includes enough text to exceed the threshold so the toggle appears by default.",
  priority: "High",        // "Low" | "Medium" | "High"
  dueDate: "2026-04-16T14:30", // ISO format for datetime-local
  status: "Pending"        // "Pending" | "In Progress" | "Done"
};

let editCache = null;

const dueDate = new Date(todoState.dueDate);

const completeCheckboxEl = document.getElementById('complete');
const todoTitleEl = document.getElementById('todoTitle');
const descriptionEl = document.getElementById('description');
const taskPriorityEl = document.getElementById('taskPriority');
const timeRemainingEl = document.getElementById('timeRemaining');
const taskStatusEl = document.getElementById('taskStatus');
const dueDateEl = document.querySelector('.due-date');

const deleteBtnEl = document.getElementById('deleteBtn');
const editBtnEl = document.getElementById('editBtn');
const expandToggleElBtn = document.getElementById('expand-toggle')
const editFormContainerEl = document.getElementById('editFormContainer')

const statusControl = document.querySelector('[data-testid="test-todo-status-control"]')

const form = document.querySelector('[data-testid="test-todo-edit-form"]');

const max_length = 100;
let isExpanded = false;

let isEditing = false;

function isLongText(text){
    return text.length > max_length;
}

function truncateText(text){
    return `${text.slice(0, max_length)}...`;
}

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 16);
}


function render() {
  todoTitleEl.textContent = todoState.title;
  descriptionEl.textContent = isExpanded
    ? todoState.description
    : truncateText(todoState.description);

  // taskPriorityEl.firstChild.textContent = todoState.priority;
  taskPriorityEl.innerHTML = `
  ${todoState.priority}
  <strong data-testid="test-todo-priority-indicator"
          class="priority-indicator"
          data-priority="${todoState.priority.toLowerCase()}"></strong>
`;

  // Priority indicator
  const indicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
  indicator.setAttribute("data-priority", todoState.priority.toLowerCase());

  // Status
  taskStatusEl.textContent = todoState.status;
  statusControl.value = todoState.status;
  taskStatusEl.className = `status-badge status-${todoState.status.toLowerCase().replace(" ", "-")}`;

  // Checkbox sync
  completeCheckboxEl.checked = todoState.status === "Done";

  // Completed style
  todoTitleEl.classList.toggle("completed", todoState.status === "Done");

  // Due date
  dueDateEl.textContent = `Due Date: ${new Date(todoState.dueDate).toDateString()}`;

  // Expand button visibility
  expandToggleElBtn.hidden = !isLongText(todoState.description);
  expandToggleElBtn.textContent = isExpanded ? "Collapse ▲" : "Expand ▼";

  const card = document.querySelector('[data-testid="test-todo-card"]');

  card.classList.toggle("overdue", new Date() > new Date(todoState.dueDate));
  card.classList.toggle("in-progress", todoState.status === "In Progress");

  const section = document.querySelector('[data-testid="test-todo-collapsible-section"]');

  section.classList.toggle("expanded", isExpanded);
  section.classList.toggle("collapsed", !isExpanded);

  expandToggleElBtn.hidden = !isLongText(todoState.description);

  updateTime();
}

let timeInterval = setInterval(updateTime, 60000);


function updateTime() {
  const timeEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const overdueIndicatorEl = document.getElementById('overdue-indicator');

  const dueDate = new Date(todoState.dueDate);

  if (todoState.status === "Done") {
    timeEl.textContent = "Completed";
    overdueIndicatorEl.textContent = "";
    overdueIndicatorEl.classList.remove("overdue-indicator");
    return;
  }

  const timeText = getTimeRemaining(dueDate);
  timeEl.textContent = timeText;

  const isOverdue = new Date() > dueDate;

  if (isOverdue) {
    overdueIndicatorEl.textContent = "";
    overdueIndicatorEl.classList.add("overdue-indicator");
  } else {
    overdueIndicatorEl.textContent = "";
    overdueIndicatorEl.classList.remove("overdue-indicator");
  }
}


function restartTimeInterval() {
  clearInterval(timeInterval);
  timeInterval = setInterval(updateTime, 60000);
}


completeCheckboxEl.addEventListener('change', function(){
    const isDone = this.checked;

    todoState.status = isDone ? "Done" : "Pending";

    if (isDone) {
        clearInterval(timeInterval);
    } else {
        restartTimeInterval();
    }

    render();
});


statusControl.addEventListener("change", () => {
  todoState.status = statusControl.value;

  if (todoState.status === "Done") {
    clearInterval(timeInterval);
    completeCheckboxEl.checked = true
    todoTitleEl.classList.add('completed')
    taskStatusEl.setAttribute("aria-label", "Task completed")
  } else {
    restartTimeInterval();
    completeCheckboxEl.checked = false
    todoTitleEl.classList.remove('completed')
    taskStatusEl.setAttribute("aria-label", "Task pending")
  }

  render(todoState);
  updateTime();
});

expandToggleElBtn.addEventListener('click', ()=> {
    isExpanded = !isExpanded
    expandToggleElBtn.setAttribute("aria-expanded", isExpanded);
    if(isExpanded){
        expandToggleElBtn.textContent = 'Collapse'
        
    }else{
        expandToggleElBtn.textContent = 'Expand'
    }
    // expandToggleElBtn.textContent = isExpanded ? "Collapse" : "Expand";
    render();
})

editBtnEl.addEventListener('click', () => {
    if (editFormContainerEl.classList.contains('hidden')){
        editFormContainerEl.classList.add('show')
        editFormContainerEl.classList.remove('hidden')
        editBtnEl.textContent = 'close'

          // Store original values
        editCache = { ...todoState };

        // Pre-fill inputs
        document.querySelector('[data-testid="test-todo-edit-title-input"]').value = todoState.title;
        document.querySelector('[data-testid="test-todo-edit-description-input"]').value = todoState.description;
        document.querySelector('[data-testid="test-todo-edit-priority-select"]').value = todoState.priority;
        document.querySelector('[data-testid="test-todo-edit-due-date-input"]').value = formatDate(todoState.dueDate);

        form.hidden = false;

        // Focus first input
        document.querySelector('[data-testid="test-todo-edit-title-input"]').focus();

    }else{
        editFormContainerEl.classList.add('hidden')
        editFormContainerEl.classList.remove('show')
        editBtnEl.textContent = 'Edit'

        form.hidden = true;
    }
})

deleteBtnEl.addEventListener('click', () => {
    alert("Delete clicked")
})

document.querySelector('[data-testid="test-todo-save-button"]').onclick = () => {

  if (editFormContainerEl.classList.contains('show')){
        editFormContainerEl.classList.add('hidden')
        editFormContainerEl.classList.remove('show')
        editBtnEl.textContent = 'Edit'

        todoState.title = document.querySelector('[data-testid="test-todo-edit-title-input"]').value;
        todoState.description = document.querySelector('[data-testid="test-todo-edit-description-input"]').value;
        todoState.priority = document.querySelector('[data-testid="test-todo-edit-priority-select"]').value;
        todoState.dueDate = new Date(
            document.querySelector('[data-testid="test-todo-edit-due-date-input"]').value
        );

        form.hidden = true;
        isEditing = false;

        render(todoState);

        // Return focus to Edit button
        restartTimeInterval();
         editBtnEl.focus();
         // Clear form input
        document.querySelector('[data-testid="test-todo-edit-title-input"]').value = ''
        document.querySelector('[data-testid="test-todo-edit-description-input"]').value = ''
        document.querySelector('[data-testid="test-todo-edit-priority-select"]').value = ''
        document.querySelector('[data-testid="test-todo-edit-due-date-input"]').value = ''

    }else{
        editFormContainerEl.classList.add('show')
        editFormContainerEl.classList.remove('hidden')
    }
};

document.querySelector('[data-testid="test-todo-cancel-button"]').onclick = () => {
  // Restore original task
  
   if (editFormContainerEl.classList.contains('show')){
        editFormContainerEl.classList.add('hidden')
        editFormContainerEl.classList.remove('show')
        // editBtnEl.textContent = 'close'

        todoState.title = editCache.title;
        todoState.description = editCache.description;
        todoState.priority = editCache.priority;
        todoState.dueDate = editCache.dueDate;

        isEditing = false;

        render();

        // Return focus to Edit button
        editBtnEl.focus();

         // Clear form input
        document.querySelector('[data-testid="test-todo-edit-title-input"]').value = ''
        document.querySelector('[data-testid="test-todo-edit-description-input"]').value = ''
        document.querySelector('[data-testid="test-todo-edit-priority-select"]').value = ''
        document.querySelector('[data-testid="test-todo-edit-due-date-input"]').value = ''

    }else{
        editFormContainerEl.classList.add('show')
        editFormContainerEl.classList.remove('hidden')
    }
};

form.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;

  const focusable = form.querySelectorAll("input, textarea, select, button");
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  }

  if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});


render(todoState)


