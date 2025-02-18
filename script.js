// Evento para agregar tarea
document.getElementById("add-task-btn").addEventListener("click", function () {
    const taskName = document.getElementById("task-name").value;

    if (taskName.trim() === "") {
        alert("ERROR: Task name is empty");
        return;
    }

    // Mostrar las opciones de la tarea cuando se hace clic en "Add Task"
    document.querySelector(".task-options").style.display = "block";
    document.getElementById("task-name").disabled = true;
});

// Confirmar tarea y agregarla
document.getElementById("confirm-task-btn").addEventListener("click", function () {
    const name = document.getElementById("task-name").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    const newTask = new Task(name, priority, category, startDate, endDate);
    addTaskToUI(newTask);
    saveTasks();
    document.querySelector(".task-options").style.display = "none";

    document.getElementById("task-name").value = "";
    document.getElementById("confirm-task-btn").textContent = "Add Task";
    document.getElementById("task-name").disabled = false;
});

// Agregar tarea a la UI
function addTaskToUI(task) {
    const taskList = document.querySelector(".task-list");
    const li = document.createElement("li");
    li.classList.add("task");
    li.setAttribute("data-id", task.id);

    li.innerHTML = `
        <p style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.name}</p>
        <button class="complete-btn">
            <i class="fa-solid fa-check"></i>
        </button>
        <button class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
        <input type="hidden" class="priority" value="${task.priority}" />
        <input type="hidden" class="category" value="${task.category}" />
        <input type="hidden" class="start-date" value="${task.startDate}" />
        <input type="hidden" class="end-date" value="${task.endDate}" />
    `;

    li.querySelector(".complete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        task.toggleCompleted();
        li.querySelector("p").style.textDecoration = task.completed ? "line-through" : "none";
        saveTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTask(task, li);
    });

    li.addEventListener("click", () => {
        showTaskDetailsPanel(task);
    });

    taskList.appendChild(li);
    taskList.classList.add("has-tasks");
}

// Eliminar tarea
function deleteTask(task, taskElement) {
    taskElement.remove();

    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter(t => t.name !== task.name);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// LOCAL STORAGE
function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-list .task").forEach(taskElement => {
        const name = taskElement.querySelector("p").textContent;
        const priority = taskElement.querySelector(".priority").value;
        const category = taskElement.querySelector(".category").value;
        const startDate = taskElement.querySelector(".start-date").value;
        const endDate = taskElement.querySelector(".end-date").value;
        const completed = taskElement.querySelector("p").style.textDecoration === "line-through";

        tasks.push({ name, priority, category, startDate, endDate, completed });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
        storedTasks.forEach(taskData => {
            const task = new Task(taskData.name, taskData.priority, taskData.category, taskData.startDate, taskData.endDate);
            task.completed = taskData.completed;

            addTaskToUI(task);
        });
    }
}

// Mostrar panel de detalles
function showTaskDetailsPanel(task) {
    const panel = document.querySelector(".task-details-panel");
    panel.style.display = "block";

    panel.innerHTML = `
        <h2>${task.name}</h2>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Category:</strong> ${task.category}</p>
        <p><strong>Start Date:</strong> ${task.startDate}</p>
        <p><strong>End Date:</strong> ${task.endDate}</p>
        <button id="close-panel-btn">Close</button>
    `;

    document.getElementById("close-panel-btn").addEventListener("click", () => {
        panel.style.display = "none";
    });
}

// Cargar tareas cuando la página se cargue
window.onload = loadTasks;

// Ordenar tareas por prioridad
document.getElementById('sort-by-priority').addEventListener('click', () => {
    sortTasksByPriority();
});

function sortTasksByPriority() {
    const taskList = document.querySelector(".task-list");
    const tasks = Array.from(taskList.querySelectorAll(".task"));
    
    // Orden de prioridad
    const priorityOrder = { "high": 1, "medium": 2, "low": 3 };

    tasks.sort((a, b) => {
        const priorityA = a.querySelector(".priority").value;
        const priorityB = b.querySelector(".priority").value;
        return priorityOrder[priorityA] - priorityOrder[priorityB];
    });

    // Limpiar la lista actual
    taskList.innerHTML = '';

    // Añadir las tareas en el nuevo orden
    tasks.forEach(task => {
        taskList.appendChild(task); // Mueve las tareas ya ordenadas
    });
}

// Ordenar tareas por fecha
document.getElementById('sort-by-date').addEventListener('click', () => {
    sortTasksByDate();
});

function sortTasksByDate() {
    const taskList = document.querySelector(".task-list");
    const tasks = Array.from(taskList.querySelectorAll(".task"));
    
    tasks.sort((a, b) => {
        const dateA = new Date(a.querySelector(".start-date").value);
        const dateB = new Date(b.querySelector(".start-date").value);
        return dateA - dateB; // Aseguramos que las fechas estén en orden ascendente
    });

    // Limpiar la lista actual
    taskList.innerHTML = '';

    // Añadir las tareas en el nuevo orden
    tasks.forEach(task => {
        taskList.appendChild(task); // Mueve las tareas ya ordenadas
    });
}

// Ordenar tareas por categoría
document.getElementById('sort-by-category').addEventListener('click', () => {
    sortTasksByCategory();
});

function sortTasksByCategory() {
    const taskList = document.querySelector(".task-list");
    const tasks = Array.from(taskList.querySelectorAll(".task"));
    
    // Orden de categorías
    const categoryOrder = { "work": 1, "personal": 2, "other": 3 };

    tasks.sort((a, b) => {
        const categoryA = a.querySelector(".category").value;
        const categoryB = b.querySelector(".category").value;
        return categoryOrder[categoryA] - categoryOrder[categoryB];
    });

    // Limpiar la lista actual
    taskList.innerHTML = '';

    // Añadir las tareas en el nuevo orden
    tasks.forEach(task => {
        taskList.appendChild(task); // Mueve las tareas ya ordenadas
    });
}
