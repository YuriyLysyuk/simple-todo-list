'use strict';

/**
 * Simple ToDo List app
 */

// Initial tasks data
const tasksData = [
  {
    _id: '40df2e1a-3b88-3a4b-4847-2b7b3eb0446f',
    title: 'Анализ конкурентов',
    description: 'Проанализировать функционал и структуру сайтов, семантику.',
    isCompleted: true,
  },
  {
    _id: '2f143318-4193-4a4c-29b3-40fe381c31e0',
    title: 'Семантика',
    description: 'Сбор, чистка, кластеризация.',
    isCompleted: false,
  },
  {
    _id: '34f5471f-4852-272c-3064-339e2e133a38',
    title: 'Проект страницы составить',
    description: 'Продумать архитектуру и перелинковку.',
    isCompleted: false,
  },
  {
    _id: '4d0c3a02-3486-274a-3c0f-2cce44cc46f8',
    title: 'Составление стратегий',
    description:
      'seo, ссылочная, контентная на основе анализа конкурентов и семантики.',
    isCompleted: false,
  },
];

// Added self-calling function to protect app variables and functions
(function (tasksData) {
  // Generate object of tasks objects
  const tasks = tasksData.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // UI elements
  const tasksContainer = document.querySelector('.task-list .list-group');
  const addNewTaskForm = document.forms['addNewTask'];
  const addNewTaskTitle = addNewTaskForm.elements['title'];
  const addNewTaskDescription = addNewTaskForm.elements['description'];
  const msgContainer = document.querySelector('.task-list .msg');

  // Class list
  const completeTaskClasses = [
    'text-decoration-line-through',
    'text-muted',
    'bg-success',
    'bg-opacity-10',
  ];

  // Print all initial tasks
  printAllTasks(tasks);

  // Add new task form submit handler
  addNewTaskForm.addEventListener('submit', addNewTaskHandler);

  // Add task management handler
  tasksContainer.addEventListener('click', taskManagementHandler);

  // Print all tasks
  function printAllTasks(tasks) {
    // Return undefined if tasks data not received
    if (!tasks) {
      console.error('You need add object with tasks data');
      return;
    }

    // Print all tasks if task list is not empty, else show alert
    if (!alertIfEmptyTaskList(tasks)) {
      const allTasksHtml = getAllTasksHtml(tasks);
      tasksContainer.innerHTML = '';
      tasksContainer.appendChild(allTasksHtml);
    }
  }

  // Print one task
  function printTask(task) {
    // Return undefined if task data not received
    if (!task) {
      console.error('You need add object with task data');
      return;
    }

    // Print alert if task list is empty or clear it and return
    if (alertIfEmptyTaskList(tasks)) return;

    const taskHtml = getTaskHtml(task);
    tasksContainer.insertAdjacentElement('afterbegin', taskHtml);
  }

  // Get html for all tasks
  function getAllTasksHtml(tasks) {
    // Return undefined if tasks data not received
    if (!tasks) {
      console.error('You need add object with tasks data');
      return;
    }

    // Create document fragment for future tasks list
    const fragment = document.createDocumentFragment();

    // Get html markup for all tasks
    Object.values(tasks).forEach((task) => {
      // Create html for one task
      const li = getTaskHtml(task);
      // Append one task to fragment
      fragment.appendChild(li);
    });

    return fragment;
  }

  // Get html for one task
  function getTaskHtml({ _id, title, description, isCompleted } = {}) {
    // Create li element
    const li = document.createElement('li');
    // Add li classes
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'gap-2'
    );

    // Cross out the task if it is completed
    if (isCompleted) {
      li.classList.add(...completeTaskClasses);
    }

    // Add id to task li dataset
    li.dataset['id'] = _id;

    // Create task body div, add class and text
    const taskBody = document.createElement('div');
    taskBody.classList.add('task-body', 'me-auto');
    taskBody.textContent = description;

    // Create task title div, add classes and text
    const taskTitle = document.createElement('div');
    taskTitle.classList.add('task-title', 'fw-bold');
    taskTitle.textContent = title;

    // Insert title to task body
    taskBody.insertAdjacentElement('afterbegin', taskTitle);

    // Create button group
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('btn-group', 'btn-group-sm', 'align-self-center');
    btnGroup.setAttribute('role', 'group');
    btnGroup.setAttribute('aria-label', 'Task management');

    // Create complete button
    const btnComplete = document.createElement('button');
    btnComplete.classList.add('btn', 'btn-success');
    btnComplete.setAttribute('type', 'button');
    // Disable the button if the task is completed
    if (isCompleted) {
      btnComplete.setAttribute('disabled', 'disabled');
    }
    btnComplete.dataset['action'] = 'complete';
    btnComplete.insertAdjacentHTML(
      'afterbegin',
      '<i class="fas fa-check"></i>'
    );

    // Create delete button, add classes and text
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn', 'btn-danger', 'align-self-center');
    btnDelete.setAttribute('type', 'button');
    btnDelete.dataset['action'] = 'delete';
    btnDelete.insertAdjacentHTML('afterbegin', '<i class="fas fa-times"></i>');

    // Add buttons to btn group
    btnGroup.appendChild(btnComplete);
    btnGroup.appendChild(btnDelete);

    // Add markup to li
    li.appendChild(taskBody);
    li.appendChild(btnGroup);

    return li;
  }

  // Print alert
  function printAlert(message = '', type = 'primary') {
    // Return undefined if message is empty
    if (!message) return;

    const alert = document.createDocumentFragment();
    const div = document.createElement('div');

    div.classList.add('alert', `alert-${type}`);
    div.setAttribute('role', 'alert');
    div.textContent = message;

    alert.appendChild(div);

    msgContainer.appendChild(alert);
  }

  // Clear alert msg
  function clearAlert() {
    msgContainer.innerHTML = '';
  }

  // Delete task element from DOM
  function deleteTaskHtml(id) {
    // Return undefined if id not received
    if (!id) {
      console.error('The id parameter is expected');
      return;
    }

    const taskElement = document.querySelector(`[data-id="${id}"]`);
    taskElement.remove();

    // Print alert if task list is empty or clear it
    alertIfEmptyTaskList(tasks);
  }

  // Add new task function
  function addNewTaskHandler(e) {
    e.preventDefault();

    // Get title value
    const title = addNewTaskTitle.value || '';

    // Check title is not empty
    if (title === '') {
      alert('Enter task title');
      return;
    }

    // Get description value
    const description = addNewTaskDescription.value || '';

    const task = createNewTask(title, description);

    // Print task to tasks container
    printTask(task);

    // Clear form inputs
    addNewTaskForm.reset();
  }

  // Task management handler
  function taskManagementHandler(e) {
    e.preventDefault();
    // Find the nearest button that was clicked
    const button = e.target.closest('button');
    // If button finded check it has property 'action'
    if (button && button.dataset.hasOwnProperty('action')) {
      // Find the nearest task li element
      const taskElement = e.target.closest('li.list-group-item');
      // Get task id
      const id = getTaskIdFromElement(taskElement);

      // Switch action
      switch (button.dataset.action) {
        case 'complete':
          completeTask(id);
          break;

        case 'delete':
          // Delete task from object and DOM
          deleteTask(id);
          break;
      }
    }
  }

  // Create new task
  function createNewTask(title, description) {
    if (!title) {
      console.error('Set task title');
      return;
    }

    const task = {
      _id: getNewId(),
      title,
      description,
    };

    // Save new task object to all tasks object
    saveTask(task);

    return task;
  }

  // Generate new unique task id
  function getNewId() {
    // Function for generate four chars
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 10000).toString(16);
    };
    let newId = '';

    // Generate id...
    do {
      // ...of format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      newId = `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
      // ...while it already exist
    } while (tasks.hasOwnProperty(newId));

    return newId;
  }

  // Save new task object to all tasks object
  function saveTask(task) {
    if (!task) {
      console.error('Call function with task object');
      return;
    }

    tasks[task._id] = task;
  }

  // Delete task from object
  function deleteTask(id) {
    // Return undefined if id not received
    if (!id) {
      console.error('The id parameter is expected');
      return;
    }

    const title = tasks[id].title;

    // Confirm to delete task
    if (confirm(`Do you want to delete this task: ${title}?`)) {
      // If delete task from tasks object
      if (delete tasks[id]) {
        // Delete task from DOM
        deleteTaskHtml(id);
      }
    }
  }

  // Complete task in object
  function completeTask(id) {
    // Return undefined if id not received
    if (!id) {
      console.error('The id parameter is expected');
      return;
    }

    // if task exist
    if (tasks.hasOwnProperty(id)) {
      // Complete task
      tasks[id].isCompleted = true;
    }
  }

  // Get task id from element
  function getTaskIdFromElement(taskElement) {
    // Check el is Element
    if (!(taskElement instanceof HTMLElement)) {
      console.error('El must be a HTMLElement');
      return;
    }

    return taskElement.dataset.id || '';
  }

  // Print alert if task list is empty or clear it
  function alertIfEmptyTaskList(tasks) {
    // Check if tasks is empty
    if (tasks && Object.keys(tasks).length === 0) {
      // Show alert message
      printAlert('Well done! You completed all tasks :)', 'success');
      return true;
    }

    // Clear alert msg
    clearAlert();

    return false;
  }
})(tasksData);
