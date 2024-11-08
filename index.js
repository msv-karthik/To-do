let tasks = [];

const taskCount = document.querySelector('.task-count');
const categoryButtons = document.querySelectorAll('.category-btn');
const taskModal = document.getElementById('taskModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');
const sortSelect = document.getElementById('sortSelect');
let currentCategory = 'all';


addTaskBtn.addEventListener('click', () => {
    taskModal.style.display = 'flex';
});


cancelBtn.addEventListener('click', () => {
    taskModal.style.display = 'none';
});


taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const category = document.getElementById('taskCategory').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;

    const newTask = {
        id: Date.now(),
        title,
        category,
        priority,
        completed: false,
        deleted: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskModal.style.display = 'none';
});


categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.getAttribute('data-category');
        renderTasks();
    });
});


function renderTasks() {
    const filteredTasks = filterTasks();

    taskCount.textContent = `${filteredTasks.length} tasks`;

    const taskLists = {
        'urgent-important': document.getElementById('urgent-important'),
        'not-urgent-important': document.getElementById('not-urgent-important'),
        'urgent-not-important': document.getElementById('urgent-not-important'),
        'not-urgent-not-important': document.getElementById('not-urgent-not-important'),
    };


    Object.values(taskLists).forEach(list => list.innerHTML = '');

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.innerHTML = `
            <span class="task-title">${task.title}</span>
            <span class="task-category">${task.category}</span>
            <div class="task-actions">
                ${task.completed || task.deleted ? '' : '<button class="complete-btn" data-id="' + task.id + '"><i class="fas fa-check"></i></button>'}
                ${task.completed || task.deleted ? '' : '<button class="delete-btn" data-id="' + task.id + '"><i class="fas fa-trash-alt"></i></button>'}
            </div>
        `;

        if (!task.completed && !task.deleted) {
            taskLists[task.priority].appendChild(taskElement);
        }
    });


    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', completeTask);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}


function completeTask(e) {
    const taskId = e.target.closest('button').getAttribute('data-id');
    const task = tasks.find(t => t.id === parseInt(taskId));
    task.completed = true;
    saveTasks();
    renderTasks();
}


function deleteTask(e) {
    const taskId = e.target.closest('button').getAttribute('data-id');
    const task = tasks.find(t => t.id === parseInt(taskId));
    task.deleted = true;
    saveTasks();
    renderTasks();
}


function filterTasks() {
    let filteredTasks = tasks;

    if (currentCategory !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.category === currentCategory);
    }


    const sortType = sortSelect.value;
    switch (sortType) {
        case 'dateAsc':
            filteredTasks.sort((a, b) => a.id - b.id);
            break;
        case 'dateDesc':
            filteredTasks.sort((a, b) => b.id - a.id);
            break;
        case 'priority':
            filteredTasks.sort((a, b) => a.priority.localeCompare(b.priority));
            break;
        case 'name':
            filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    return filteredTasks;
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}


loadTasks();
