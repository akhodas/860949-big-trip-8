import AbstractComponentRender from './abstract-component-render';

export default class TypeSorting extends AbstractComponentRender {
  constructor(options) {
    super();
    this._title = options.title;
    this._tagInput = options.tagInput;
    this._checked = options.checked;
    this._onSorting = null;
    this._onSortingButtonClick = this._onSortingButtonClick.bind(this);
  }

  get template() {
    return this._tagInput ? `
          <input type="radio" name="trip-sorting" 
            id="sorting-${this._title}" 
            value="${this._title}" 
            ${this._checked ? `checked` : ``}
            >
          <label class="trip-sorting__item trip-sorting__item--${this._title}" 
            for="sorting-${this._title}">
            ${this._title}
          </label>
        ` : `
          <span class="trip-sorting__item trip-sorting__item--${this._title}">
            ${this._title}
          </span>
        `;
  }

  set onSorting(fn) {
    this._onSorting = fn;
  }

  createListeners() {
    if (this._tagInput) {
      this._element.querySelector(`.trip-sorting__item`)
        .addEventListener(`click`, this._onSortingButtonClick);
    }
  }

  removeListeners() {
    if (this._tagInput) {
      this._element.querySelector(`.trip-sorting__item`)
        .removeEventListener(`click`, this._onSortingButtonClick);
    }
  }

  _onSortingButtonClick(evt) {
    if (typeof this._onSorting === `function`) {
      this._onSorting(evt);
    }
  }

}
