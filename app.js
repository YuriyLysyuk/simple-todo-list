'use strict';

/**
 * Simple ToDo List app
 */

// Initial tasks data
const tasksData = [
  {
    _id: 'f17ec3c0b9ad',
    title: 'Анализ конкурентов',
    description: 'Проанализировать функционал и структуру сайтов, семантику.',
  },
  {
    _id: 'f17ec3c331ed',
    title: 'Семантика',
    description: 'Сбор, чистка, кластеризация.',
  },
  {
    _id: 'f17ec3c388bb',
    title: 'Проект страницы составить',
    description: 'Продумать архитектуру и перелинковку.',
  },
  {
    _id: 'f17ec3c39fe6',
    title: 'Составление стратегий',
    description:
      'seo, ссылочная, контентная на основе анализа конкурентов и семантики.',
  },
];

// Added self-calling function to protect app variables and functions
(function (tasksData) {
  // Tasks container
  const tasksContainer = document.querySelector('.task-list .list-group');

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
