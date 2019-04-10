import AbstractComponentRender from './abstract-component-render';

export default class Filter extends AbstractComponentRender {
  constructor(options) {
    super();
    this._title = options.title;
    this._checked = options.checked;
    this._onFilter = null;
    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  get template() {
    return `
        <input 
          type="radio" 
          id="filter-${this._title}" 
          name="filter" 
          value="${this._title}" 
          ${this._checked ? `checked` : ``}>
        <label class="trip-filter__item" for="filter-${this._title}">${this._title}</label>
      `;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  createListeners() {
    this._element.querySelector(`.trip-filter__item`)
      .addEventListener(`click`, this._onFilterButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.trip-filter__item`)
      .removeEventListener(`click`, this._onFilterButtonClick);
  }

  _onFilterButtonClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

}
