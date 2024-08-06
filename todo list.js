
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const resetButton = document.getElementById('reset-button');
    const editContainer = document.getElementById('edit-container');
    const colorPicker = document.getElementById('color-picker');
    const saveEditedTaskButton = document.getElementById('save-edited-task');
    const cancelEditButton = document.getElementById('cancel-edit');
    const searchInput = document.getElementById('search-input');

    let editingTaskElement = null;

    // Load tasks from local storage
    loadTasks();

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;

        if (taskText === '' || taskDate === '') {
            alert('Please enter both task and date.');
            return;
        }

        const taskItem = document.createElement('li');
        taskItem.innerHTML = 
            `<input type="checkbox">
            <span>${taskText} (Due: ${taskDate})</span>
            <button class="edit"><i class="fa fa-pencil"></i></button>
            <button class="delete">Delete</button>`;

        taskList.appendChild(taskItem);

        taskInput.value = '';
        dateInput.value = '';

        saveTasks();
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const taskItem = e.target.parentElement;
            taskItem.classList.add('completed'); // Mark as completed
            e.target.style.display = 'none'; // Hide the delete button
            saveTasks();
        } else if (e.target.classList.contains('edit') || e.target.classList.contains('fa-pencil')) {
            const taskItem = e.target.closest('li');
            const span = taskItem.querySelector('span');
            const [taskText, taskDate] = span.textContent.split(' (Due: ');
            const color = window.getComputedStyle(span).color;

            taskInput.value = taskText.trim();
            dateInput.value = taskDate.replace(')', '').trim();
            colorPicker.value = rgbToHex(color);

            editingTaskElement = taskItem;
            editContainer.style.display = 'flex';
        }
    });

    saveEditedTaskButton.addEventListener('click', () => {
        if (editingTaskElement) {
            const taskText = taskInput.value.trim();
            const taskDate = dateInput.value;

            if (taskText === '' || taskDate === '') {
                alert('Please enter both task and date.');
                return;
            }

            const span = editingTaskElement.querySelector('span');
            span.textContent = `${taskText} (Due: ${taskDate})`;
            span.style.color = colorPicker.value;

            editingTaskElement = null;
            editContainer.style.display = 'none';
            saveTasks();
        }
    });

    cancelEditButton.addEventListener('click', () => {
        editingTaskElement = null;
        editContainer.style.display = 'none';
    });

    resetButton.addEventListener('click', () => {
        taskList.innerHTML = '';
        saveTasks();
    });

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(taskItem => {
            const taskText = taskItem.querySelector('span').textContent.toLowerCase();
            taskItem.style.display = taskText.includes(searchText) ? '' : 'none';
        });
    });

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                completed: taskItem.classList.contains('completed'),
                color: window.getComputedStyle(taskItem.querySelector('span')).color
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = 
                `<input type="checkbox"${task.completed ? ' checked' : ''}>
                <span style="color: ${task.color};">${task.text}</span>
                <button class="edit"><i class="fa fa-pencil"></i></button>
                <button class="delete">Delete</button>`;
            if (task.completed) {
                taskItem.classList.add('completed');
                taskItem.querySelector('.delete').style.display = 'none'; // Hide the delete button for completed tasks
            }
            taskList.appendChild(taskItem);
        });
    }

    function rgbToHex(rgb) {
        const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(rgb);
        return result ? `#${Number(result[1]).toString(16).padStart(2, '0')}${Number(result[2]).toString(16).padStart(2, '0')}${Number(result[3]).toString(16).padStart(2, '0')}` : '#000000';
    }
});
