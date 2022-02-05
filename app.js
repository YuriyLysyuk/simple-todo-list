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
  },
  {
    _id: '2f143318-4193-4a4c-29b3-40fe381c31e0',
    title: 'Семантика',
    description: 'Сбор, чистка, кластеризация.',
  },
  {
    _id: '34f5471f-4852-272c-3064-339e2e133a38',
    title: 'Проект страницы составить',
    description: 'Продумать архитектуру и перелинковку.',
  },
  {
    _id: '4d0c3a02-3486-274a-3c0f-2cce44cc46f8',
    title: 'Составление стратегий',
    description:
      'seo, ссылочная, контентная на основе анализа конкурентов и семантики.',
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

  // Print all initial tasks
  printAllTasks(tasks);

  // Add new task form submit handler
  addNewTaskForm.addEventListener('submit', addNewTaskHandler);

  // Print all tasks
  function printAllTasks(tasks) {
    // Return undefined if tasks data not received
    if (!tasks) {
      console.error('You need add object with tasks data');
      return;
    }

    const allTasksHtml = getAllTasksHtml(tasks);

    tasksContainer.innerHTML = '';
    tasksContainer.appendChild(allTasksHtml);
  }

  // Print one task
  function printTask(task) {
    // Return undefined if task data not received
    if (!task) {
      console.error('You need add object with task data');
      return;
    }

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
  function getTaskHtml({ title, description } = {}) {
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

    // Create delete button, add classes and text
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-danger', 'btn-sm', 'align-self-center');
    btn.setAttribute('type', 'button');
    btn.insertAdjacentHTML('afterbegin', 'Delete&nbsp;task');

    // Add markup to li
    li.appendChild(taskBody);
    li.appendChild(btn);

    return li;
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

    // Save new task object to all tasks object
    saveTask(task);

    // Print task to tasks container
    printTask(task);

    // Clear form inputs
    addNewTaskForm.reset();
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
})(tasksData);
