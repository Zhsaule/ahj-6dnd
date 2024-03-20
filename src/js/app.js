import Column from './Column';

document.addEventListener('DOMContentLoaded', () => {
  const board = document.querySelector('.board');

  // Названия колонок для типового состояния
  const columnTitles = ['TODO', 'IN PROGRESS', 'DONE'];

  columnTitles.forEach((title) => {
    new Column(title).render(board);
  });
});
