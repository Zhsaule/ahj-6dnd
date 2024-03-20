export default class Card {
  constructor(text) {
    this.text = text;
    this.element = this.createCardElement(text);
    this.addDragEvents();
  }

  createCardElement() {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = this.text;

    const deleteIcon = document.createElement('button');
    deleteIcon.innerHTML = '&times;';
    deleteIcon.className = 'delete-icon';
    deleteIcon.onclick = () => this.element.remove();

    cardElement.appendChild(deleteIcon);
    return cardElement;
  }

  addDragEvents() {
    this.element.setAttribute('draggable', true);

    this.element.addEventListener('dragstart', () => {
      this.element.classList.add('dragging');
    });

    this.element.addEventListener('dragend', () => {
      this.element.classList.remove('dragging');
    });
  }
}
