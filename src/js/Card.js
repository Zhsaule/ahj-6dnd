export default class Card {
  constructor(id, text, onDelete) {
    this.id = id;
    this.text = text;
    this.onDelete = onDelete;
    this.element = this.createCardElement();
    this.addDragEvents();
  }

  createCardElement() {
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-id', this.id); // Установка data-id
    cardElement.className = 'card';
    cardElement.textContent = this.text;

    const deleteIcon = document.createElement('button');
    deleteIcon.innerHTML = '&times;';
    deleteIcon.className = 'delete-icon';
    deleteIcon.onclick = () => {
      this.element.remove();
      if (typeof this.onDelete === 'function') {
        this.onDelete(); // Вызываем onDelete, если он функция
      }
    };

    cardElement.appendChild(deleteIcon);
    return cardElement;
  }

  addDragEvents() {
    this.element.setAttribute('draggable', true);

    this.element.addEventListener('dragstart', () => {
      this.element.classList.add('dragging');
      window.draggingCard = { id: this.id, text: this.text };
      window.sourceColumn = this.element.closest('.column').querySelector('h2').textContent;
    });

    this.element.addEventListener('dragend', () => {
      this.element.classList.remove('dragging');
    });
  }
}
