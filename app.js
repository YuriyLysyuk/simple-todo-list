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
  const tasksManagementToolbar = document.querySelector(
    '.tasks-management-toolbar'
  );
  const msgContainer = document.querySelector('.task-list .msg');
  const tasksContainer = document.querySelector('.task-list .list-group');
  const addNewTaskForm = document.forms['addNewTask'];
  const addNewTaskTitle = addNewTaskForm.elements['title'];
  const addNewTaskDescription = addNewTaskForm.elements['description'];

  // Class list
  const completeTaskClasses = [
    'text-decoration-line-through',
    'text-muted',
    'bg-success',
    'bg-opacity-10',
  ];

  // Alert messages. Format: ['Alert message', 'Bootstrap alert class']
  const msgEmptyList = ['Task list is empty. Add new one.', 'warning'];
  const msgTimeToDo = [`Time to do something. Let's go!`, 'warning'];
  const msgWellDone = ['Well done! You completed all tasks :)', 'success'];

  // Render tasks management toolbar
  renderTasksManagementToolbar();

  // Tasks management toolbar UI
  const allTasksButton = tasksManagementToolbar.querySelector(
    'button[data-action="showAllTasks"]'
  );
  const uncompletedTasksButton = tasksManagementToolbar.querySelector(
    'button[data-action="showUncompletedTasks"]'
  );
  const completedTasksButton = tasksManagementToolbar.querySelector(
    'button[data-action="showCompletedTasks"]'
  );
  const tasksManagementButtons = [
    allTasksButton,
    uncompletedTasksButton,
    completedTasksButton,
  ];

  // Render all initial tasks
  renderAllTasks(tasks);

  // Add new task form submit handler
  addNewTaskForm.addEventListener('submit', addNewTaskHandler);

  // Add task management handler
  tasksContainer.addEventListener('click', taskManagementHandler);

  // Add tasks management toolbar handler
  tasksManagementToolbar.addEventListener(
    'click',
    tasksManagementToolbarHandler
  );

  // Render tasks management toolbar
  function renderTasksManagementToolbar() {
    const toolbar = document.createDocumentFragment();

    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('btn-group', 'mb-3');
    buttonGroup.setAttribute('role', 'toolbar');
    buttonGroup.setAttribute('aria-label', 'Tasks management toolbar');

    // Create all tasks button
    const allTasksButton = document.createElement('button');
    allTasksButton.classList.add('btn', 'btn-outline-primary', 'active');
    allTasksButton.setAttribute('type', 'button');
    allTasksButton.setAttribute('data-action', 'showAllTasks');
    allTasksButton.textContent = 'All tasks';

    // Create uncompleted tasks buton
    const uncompletedTasksButton = document.createElement('button');
    uncompletedTasksButton.classList.add('btn', 'btn-outline-primary');
    uncompletedTasksButton.setAttribute('type', 'button');
    uncompletedTasksButton.setAttribute('data-action', 'showUncompletedTasks');
    uncompletedTasksButton.textContent = 'Uncompleted';

    // Create completed tasks buton
    const completedTasksButton = document.createElement('button');
    completedTasksButton.classList.add('btn', 'btn-outline-primary');
    completedTasksButton.setAttribute('type', 'button');
    completedTasksButton.setAttribute('data-action', 'showCompletedTasks');
    completedTasksButton.textContent = 'Completed';

    // Append all parts
    buttonGroup.appendChild(allTasksButton);
    buttonGroup.appendChild(uncompletedTasksButton);
    buttonGroup.appendChild(completedTasksButton);
    toolbar.appendChild(buttonGroup);

    // Append to DOM
    tasksManagementToolbar.appendChild(toolbar);
  }

  // Render all tasks
  function renderAllTasks(tasks, show = 'showAllTasks') {
    // Return undefined if tasks data not received
    if (!tasks) {
      console.error('You need add object with tasks data');
      return;
    }

    // if task list is empty, show alert and break render
    if (isEmptyTaskList(tasks)) {
      renderAlert(...msgEmptyList);
      return;
    }

    // Clear tasks container
    tasksContainer.innerHTML = '';

    // Get all tasks html
    const allTasksHtml = getAllTasksHtml(tasks, show);

      tasksContainer.appendChild(allTasksHtml);

    // We haven't something to show

    // If uncompleted task button on tasks management toolbar is active
    if (isActiveTasksManagementButton('showUncompletedTasks')) {
      renderAlert(...msgWellDone);
      return;
    }

    // If completed task button on tasks management toolbar is active
    if (isActiveTasksManagementButton('showCompletedTasks')) {
      renderAlert(...msgTimeToDo);
      return;
    }
  }

  // Render one task
  function renderTask(task) {
    // Return undefined if task data not received
    if (!task) {
      console.error('You need add object with task data');
      return;
    }

    // Render alert if task list is empty or clear it and return
    if (alertIfEmptyTaskList(tasks)) return;

    const taskHtml = getTaskHtml(task);
    tasksContainer.insertAdjacentElement('afterbegin', taskHtml);
  }

  // Get html for all tasks
  function getAllTasksHtml(tasks, show = 'showAllTasks') {
    // Return undefined if tasks data not received
    if (!tasks) {
      console.error('You need add object with tasks data');
      return;
    }

    // Create document fragment for future tasks list
    const fragment = document.createDocumentFragment();

    // Flag for filter tasks
    let isCompletedFlag = null;

    // Switch which task should be shown
    switch (show) {
      case 'showAllTasks':
        isCompletedFlag = null;
        break;
      case 'showUncompletedTasks':
        isCompletedFlag = false;
        break;
      case 'showCompletedTasks':
        isCompletedFlag = true;
        break;
    }

    // Get html markup for all tasks which filtered
    Object.values(tasks)
      .filter(
        (task) =>
          task.isCompleted === isCompletedFlag || isCompletedFlag === null
      )
      // Sorting by isCompleted. Completed tasks are placed at the end of the list
      .sort(byIsCompletedAsc)
      .forEach((task) => {
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

    // Create restore button
    const btnRestore = document.createElement('button');
    btnRestore.classList.add('btn', 'btn-warning');
    btnRestore.setAttribute('type', 'button');
    // Hide the button if the task is not completed
    if (!isCompleted) {
      btnRestore.classList.add('d-none');
    }
    btnRestore.dataset['action'] = 'restore';
    btnRestore.insertAdjacentHTML(
      'afterbegin',
      '<i class="fas fa-undo-alt"></i>'
    );

    // Create delete button, add classes and text
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn', 'btn-danger', 'align-self-center');
    btnDelete.setAttribute('type', 'button');
    btnDelete.dataset['action'] = 'delete';
    btnDelete.insertAdjacentHTML('afterbegin', '<i class="fas fa-times"></i>');

    // Add buttons to btn group
    btnGroup.appendChild(btnComplete);
    btnGroup.appendChild(btnRestore);
    btnGroup.appendChild(btnDelete);

    // Add markup to li
    li.appendChild(taskBody);
    li.appendChild(btnGroup);

    return li;
  }

  // Render alert
  function renderAlert(message = '', type = 'primary') {
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

    // Render alert if task list is empty or clear it
    alertIfEmptyTaskList(tasks);
  }

  // Complete task element from DOM
  function completeTaskHtml(id) {
    // Return undefined if id not received
    if (!id) {
      console.error('The id parameter is expected');
      return;
    }

    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const btnComplete = taskElement.querySelector('[data-action="complete"]');
    const btnRestore = taskElement.querySelector('[data-action="restore"]');
    const uncompletedTaskRadio = document.querySelector(
      `input#uncompletedTasks`
    );

    // Add complete task classes to task li element
    taskElement.classList.add(...completeTaskClasses);
    // Disable the complete button
    btnComplete.setAttribute('disabled', 'disabled');
    // Show the restore button
    btnRestore.classList.remove('d-none');

    // If uncompleted task radio on tasks management toolbar is checked
    if (uncompletedTaskRadio && uncompletedTaskRadio.checked) {
      // Render all uncompleted tasks
      renderAllTasks(tasks, 'showUncompletedTasks');
    } else {
      // Move task element to the end of the task list
      tasksContainer.appendChild(taskElement);
    }
  }

  // Restore a task element in DOM
  function restoreTaskHtml(id) {
    // Return undefined if id not received
    if (!id) {
      console.error('The id parameter is expected');
      return;
    }

    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const btnComplete = taskElement.querySelector('[data-action="complete"]');
    const btnRestore = taskElement.querySelector('[data-action="restore"]');
    const completedTaskRadio = document.querySelector(`input#сompletedTasks`);

    // Delete complete task classes to task li element
    taskElement.classList.remove(...completeTaskClasses);
    // Undisable the complete button
    btnComplete.removeAttribute('disabled');
    // Hide the restore button
    btnRestore.classList.add('d-none');

    // If completed task radio on tasks management toolbar is checked
    if (completedTaskRadio && completedTaskRadio.checked) {
      // Render all completed tasks
      renderAllTasks(tasks, 'showСompletedTasks');
    } else {
      // Render all tasks
      renderAllTasks(tasks);
    }
  }

  // Tasks management toolbar handler
  function tasksManagementToolbarHandler(e) {
    // Find the nearest button that was clicked
    const button = e.target.closest('.btn');

    // If button finded check it has property 'action
    if (button && button.dataset.hasOwnProperty('action')) {
      // Switch action
      switch (button.dataset.action) {
        case 'showAllTasks':
        case 'showUncompletedTasks':
        case 'showСompletedTasks':
          // Render all filtered tasks
          renderAllTasks(tasks, button.dataset.action);
          console.log();
          break;
      }
    }
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

    // Render task to tasks container
    renderTask(task);

    // Clear form inputs
    addNewTaskForm.reset();
  }

  // Task management handler
  function taskManagementHandler(e) {
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
          // Complete a task in an object and DOM
          completeTask(id);
          break;

        case 'restore':
          // Restore a task in an object and DOM
          restoreTask(id);
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
      isCompleted: false,
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
      // Cross out the task if it is completed
      completeTaskHtml(id);
    }
  }

  // Restore task in object
  function restoreTask(id) {
    // Return undefined if id not received
    if (!id) {
      console.error('The id parameter is expected');
      return;
    }

    // if task exist
    if (tasks.hasOwnProperty(id)) {
      // Restore task
      tasks[id].isCompleted = false;
      // Uncross out the task if it is not completed
      restoreTaskHtml(id);
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

  // Is empty task list
  function isEmptyTaskList(tasks) {
    return tasks && Object.keys(tasks).length === 0;
  }

  // Is active tasks management button
  function isActiveTasksManagementButton(button) {
    // Return undefined if button not received
    if (!button) {
      console.error('The button parameter is expected');
      return;
    }

    let currentButton;

    // Switch radio
    switch (button) {
      case 'showAllTasks':
        currentButton = allTasksButton;
        break;

      case 'showUncompletedTasks':
        currentButton = uncompletedTasksButton;
        break;

      case 'showCompletedTasks':
        currentButton = completedTasksButton;
        break;
    }

    return currentButton && currentButton.classList.contains('active');
  }

  // Sort by isCompleted tasks ascending
  function byIsCompletedAsc(taskA, taskB) {
    if (taskA.isCompleted > taskB.isCompleted) {
      return 1;
    }
    if (taskA.isCompleted < taskB.isCompleted) {
      return -1;
    }

    return 0;
  }
})(tasksData);
// renderAlert('Well done! You completed all tasks :)', 'success');
