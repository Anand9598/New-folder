const form = document.getElementById("task-form");
const input = document.getElementById("task-input");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;

    if (value.length < 6) {
        alert("Task must contain at least 6 letters");
        return;
    }

    createTask(value, "todo");
    addTaskToLocalStorage(value, "todo");
    input.value = "";
});
``
function addTaskToLocalStorage(task, status) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (!tasks[status]) {
        tasks[status] = [];
    }
    tasks[status].push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    for (let status in tasks) {
        tasks[status].forEach(task => createTask(task, status));
    }
}

function createTask(task, status) {
    const taskElement = document.createElement("p");
    taskElement.classList.add("task");
    taskElement.setAttribute("draggable", "true");
    taskElement.innerText = task;
    document.getElementById(status).appendChild(taskElement);
    addDragAndDrop(taskElement);
}

function addDragAndDrop(taskElement) {
    taskElement.addEventListener('dragstart', dragStart);
    taskElement.addEventListener('dragend', dragEnd);
}

let dragItem = null;

function dragStart() {
    dragItem = this;
    setTimeout(() => this.style.display = "none", 0);
}

function dragEnd() {
    setTimeout(() => this.style.display = "block", 0);
    dragItem = null;
}

const taskBoxes = document.querySelectorAll('.task-box');

taskBoxes.forEach(box => {
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragenter', dragEnter);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function drop() {
    this.append(dragItem);
    updateTaskStatus(dragItem.innerText, this.id);
}

function updateTaskStatus(task, newStatus) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    for (let status in tasks) {
        const taskIndex = tasks[status].indexOf(task);
        if (taskIndex > -1) {
            tasks[status].splice(taskIndex, 1);
            if (!tasks[newStatus]) {
                tasks[newStatus] = [];
            }
            tasks[newStatus].push(task);
            break;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

loadTasksFromLocalStorage();

