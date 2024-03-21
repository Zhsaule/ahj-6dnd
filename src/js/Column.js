import Card from './Card';

export default class Column {
  constructor(title) {
    this.title = title;
    this.cards = [];
    this.element = this.createColumnElement();
    this.addDropEvents();
    document.addEventListener('cardDeleted', this.handleRemoveCard.bind(this));
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

  // Begin LocalStorage
  updateLocalStorage() {
    const boardState = JSON.parse(localStorage.getItem('boardState')) || {};
    boardState[this.title] = this.cards.map(({ id, text }) => ({ id, text }));
    localStorage.setItem('boardState', JSON.stringify(boardState));
  }

  addCard(text) {
    const cardId = Date.now().toString(); // Генерируем ID здесь
    // const card = new Card(cardId, text, () => this.removeCard(cardId));
    const card = new Card(cardId, text);
    this.cards.push({ id: cardId, text, element: card.element });
    this.element.querySelector('.cards-container').appendChild(card.element);
    this.updateLocalStorage();
  }

  removeCard(cardId) {
    this.cards = this.cards.filter((card) => card.id !== cardId);
    this.updateLocalStorage();
  }

  handleRemoveCard(event) {
    const { cardId } = event.detail;
    const cardIndex = this.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      this.cards.splice(cardIndex, 1);
      this.updateLocalStorage(); // Обновляем LocalStorage после удаления
    }
  }
  // End LocalStorage

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

    // Добавляем обработчик событий для нажатия клавиши Enter
    inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && inputField.value.trim() !== '') {
        addButton.click(); // Программно нажимаем кнопку "Add"
      }
    });

    // Добавляем элементы на страницу
    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(cancelButton);
    this.element.appendChild(inputField);
    this.element.appendChild(buttonContainer);
    inputField.focus();
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
      const newCardsOrder = Array.from(cardsContainer.querySelectorAll('.card'));
      this.cards = newCardsOrder.map((cardElement) => {
        const cardId = cardElement.getAttribute('data-id');
        const cardText = cardElement.textContent.replace('×', '').trim(); // Удаляем символ закрытия из текста
        return { id: cardId, text: cardText };
      });

      // Также обновляем LocalStorage для исходной колонки, если карточка была перенесена
      if (window.sourceColumn && window.sourceColumn !== this.title) {
        const boardState = JSON.parse(localStorage.getItem('boardState')) || {};
        const sourceCards = boardState[window.sourceColumn].filter(
          (card) => card.id !== window.draggingCard.id,
        );
        boardState[window.sourceColumn] = sourceCards;
        localStorage.setItem('boardState', JSON.stringify(boardState));
      }
      this.updateLocalStorage();

      // Сброс глобального состояния
      window.draggingCard = null;
      window.sourceColumn = null;
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
