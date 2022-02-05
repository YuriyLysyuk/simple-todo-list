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
  printAllTasks(tasksData);

  // Get all tasks html
  function printAllTasks(tasksData) {
    // Return undefined if tasks data not received
    if (!tasksData) {
      console.error('You need add array with tasks data');
      return;
    }

    // Create document fragment for future tasks list
    const fragment = document.createDocumentFragment();

    // Get html markup for all tasks
    tasksData.forEach((task) => {
      // Create html for one task
      const li = getOneTaskHtml(task);
      // Append one task to fragment
      fragment.appendChild(li);
    });

    tasksContainer.appendChild(fragment);
  }

  // Get html for one task
  function getOneTaskHtml({ title, description } = {}) {
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
})(tasksData);
