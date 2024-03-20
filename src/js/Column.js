import Card from './Card';

export default class Column {
  constructor(title) {
    this.title = title;
    this.cards = [];
    this.element = this.createColumnElement();
    this.addDropEvents();
  }

  createColumnElement() {
    const columnElement = document.createElement('div');
    columnElement.className = 'column';

    const columnTitle = document.createElement('h2');
    columnTitle.textContent = this.title;
    columnElement.appendChild(columnTitle);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';

    const addCardButton = document.createElement('button');
    addCardButton.className = 'add-card-btn';
    addCardButton.textContent = '+ Add another card';
    addCardButton.onclick = () => this.showInputField(addCardButton, cardsContainer);

    columnElement.appendChild(cardsContainer);
    columnElement.appendChild(addCardButton);

    return columnElement;
  }

  showInputField(addCardButton) {
    addCardButton.classList.add('hidden');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter a title for this card...';
    inputField.className = 'input-card';

    // Контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Кнопка 'Add'
    const addButton = document.createElement('button');
    addButton.className = 'add-btn';
    addButton.textContent = 'Add';

    // Кнопка 'Cancel'
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-btn';
    cancelButton.innerHTML = '&times;';

    // Обработчик клика для кнопки 'Cancel'
    cancelButton.onclick = () => {
      inputField.remove();
      buttonContainer.remove(); // Удаляем контейнер с кнопками
      addCardButton.classList.remove('hidden');
    };

    // Обработчик клика для кнопки 'Add'
    addButton.onclick = () => {
      if (inputField.value.trim() !== '') {
        this.addCard(inputField.value);
        inputField.remove();
        buttonContainer.remove(); // Удаляем контейнер с кнопками
        addCardButton.classList.remove('hidden');
      }
    };

    // Добавляем элементы на страницу
    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(cancelButton);
    this.element.appendChild(inputField);
    this.element.appendChild(buttonContainer);
  }

  addCard(text) {
    const card = new Card(text);
    card.addDragEvents(); // Добавляем события drag к карточке
    this.cards.push(card);
    this.element.querySelector('.cards-container').appendChild(card.element);
  }

  addDropEvents() {
    const cardsContainer = this.element.querySelector('.cards-container');

    cardsContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = this.getDragAfterElement(cardsContainer, e.clientY);
      const draggable = document.querySelector('.dragging');
      if (afterElement == null) {
        cardsContainer.appendChild(draggable);
      } else {
        cardsContainer.insertBefore(draggable, afterElement);
      }
    });

    cardsContainer.addEventListener('drop', (e) => {
      e.preventDefault();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  render(parentElement) {
    parentElement.appendChild(this.element);
  }
}
