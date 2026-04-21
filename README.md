# Advanced Todo Card (Stage 1a)

An interactive, stateful Todo Card built with **HTML, CSS, and Vanilla JavaScript** as part of the Frontend Wizards Stage 1a task.

---

## Live Demo

👉 *(Add your deployed link here)*
👉 *(https://github.com/Owaboye/advanced_todo_card_-stage_1a-.git)*

---

## Overview

This project extends the Stage 0 Todo Card into a more dynamic and interactive component with:

* Editable content
* Status management
* Priority indicators
* Expand/collapse behavior
* Real-time time tracking
* Improved accessibility

---

## What Changed from Stage 0

### 1. Edit Mode

* Users can edit:

  * Title
  * Description
  * Priority
  * Due date
* Save updates the UI
* Cancel restores previous values
* Focus returns to Edit button after closing

---

### 2. Status Control System

* Added dropdown:

  * `Pending`
  * `In Progress`
  * `Done`
* Synced with:

  * Checkbox
  * Status text
* Logic:

  * Checkbox → Done
  * Uncheck → Pending

---

### 3. Priority Indicator

* Visual indicator added:

  * 🔴 High
  * 🟡 Medium
  * 🟢 Low
* Uses dynamic `data-priority` attribute

---

### 4. Expand / Collapse Description

* Long descriptions are truncated
* Toggle button:

  * Expand → show full text
  * Collapse → shorten text
* Fully keyboard accessible

---

### 5. Time Management System

* Updates every 60 seconds
* Displays:

  * "Due in X minutes/hours/days"
  * "Overdue by X time"
  * "Due now"
* Stops updating when:

  * Status = `Done`
  * Displays `"Completed"`

---

### 6. Overdue Indicator

* Shows "Overdue" label
* Applies visual styling (red)

---

## Core Logic Explained

### Time Update Logic

```js
function updateTime() {
  if (todoState.status === "Done") {
    timeRemainingEl.textContent = "Completed";
    return;
  }

  timeRemainingEl.textContent = getTimeRemaining(new Date(todoState.dueDate));
}
```

* Runs every **60 seconds**
* Stops when task is completed

---

### Expand / Collapse Logic

```js
const section = document.querySelector('[data-testid="test-todo-collapsible-section"]');

section.classList.toggle("expanded", isExpanded);
section.classList.toggle("collapsed", !isExpanded);
```

* Controlled by `isExpanded` state
* CSS handles visibility

---

### Overdue Indicator Logic

```js
const isOverdue = new Date() > dueDate;

overdueIndicatorEl.classList.toggle("overdue-indicator", isOverdue);
overdueIndicatorEl.textContent = isOverdue ? "Overdue" : "";
```

---

### Edit Mode Logic

```js
editCache = { ...todoState }; // store original

// Save
todoState.title = input.value;

// Cancel
todoState = { ...editCache };
```

---

## UI & Design Decisions

* Card-based layout with soft shadows
* Priority badge positioned top-right
* Responsive design:

  * Mobile (320px)
  * Tablet (768px)
  * Desktop (1024px+)
* Smooth transitions for expand/collapse
* Clean spacing and typography

---

## Accessibility Features

* Proper `<label for="">` usage
* `aria-live="polite"` for time updates
* Expand toggle:

  * `aria-expanded`
  * `aria-controls`
* Keyboard navigation supported:

  * Tab flow maintained
* Focus trap inside edit form (bonus)

---

## Responsiveness

* Fully responsive layout
* Form stacks vertically on mobile
* No overflow issues with:

  * Long titles
  * Long descriptions
  * Multiple tags

---

## Test Coverage

All required test IDs implemented:

### Stage 0

* Todo card
* Title
* Description
* Priority
* Status
* Tags
* Buttons

### Stage 1a

* Edit form
* Status control
* Priority indicator
* Expand toggle
* Collapsible section
* Overdue indicator

---

## Known Limitations

* No persistent storage (state resets on refresh)
* No animations for edit form transitions
* Focus trap is basic (can be improved)

---

## Tech Stack

* HTML5
* CSS3 (Flexbox, responsive design)
* Vanilla JavaScript (ES6)

---

## Project Structure

```
/project-root
  ├── index.html
  ├── style.css
  ├── app.js
  ├── helpers.js
  └── README.md
```

---

## Key Lessons Learned

* State synchronization across UI elements
* Accessibility-first development
* Managing UI state without frameworks
* Handling real-time updates efficiently
* Clean separation of logic and UI

---

## Final Note

This project demonstrates how to build a **production-level UI component** using only **Vanilla JavaScript**, with strong focus on:

* Clean state management
* Accessibility
* UI/UX best practices

