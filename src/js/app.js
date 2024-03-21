import Card from './Card';
import Column from './Column';

document.addEventListener('DOMContentLoaded', () => {
  window.draggingCard = null;
  window.sourceColumn = null;

  const board = document.querySelector('.board');
  let savedState = JSON.parse(localStorage.getItem('boardState')) || {};

  // Инициализация начального состояния, если LocalStorage пуст
  if (Object.keys(savedState).length === 0) {
    savedState = {
      TODO: [
        { id: 'todo-1', text: 'Задача 1' },
        { id: 'todo-2', text: 'Задача 2' },
        { id: 'todo-3', text: 'Задача 3' },
      ],
      'IN PROGRESS': [
        { id: 'in-progress-1', text: 'Задача 10' },
        { id: 'in-progress-2', text: 'Задача 20' },
        { id: 'in-progress-3', text: 'Задача 30' },
      ],
      DONE: [
        { id: 'done-1', text: 'Задача 100' },
        { id: 'done-2', text: 'Задача 200' },
        { id: 'done-3', text: 'Задача 300' },
      ],
    };
    localStorage.setItem('boardState', JSON.stringify(savedState));
  }

  const columnTitles = ['TODO', 'IN PROGRESS', 'DONE'];

  columnTitles.forEach((title) => {
    const column = new Column(title);
    column.render(board);
    const cards = savedState[title] || [];
    cards.forEach(({ id, text }) => {
      const card = new Card(id, text, () => column.removeCard(id));
      column.cards.push({ id, text, element: card.element });
      column.element.querySelector('.cards-container').appendChild(card.element);
    });
  });
});
