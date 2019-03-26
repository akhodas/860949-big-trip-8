import AbstractComponentRender from './abstract-component-render';

export default class Filter extends AbstractComponentRender {
  constructor(options) {
    super();
    this._id = options.id;
    this._title = options.title;
    this._count = options.count;
    this._checked = options.checked;
    this._onFilter = null;
    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  get template() {
    return `
      <input
        type="radio"
        id="filter__${this._title}"
        class="filter__input visually-hidden"
        name="filter"
        ${this._checked ? `checked` : ``}
        ${this._count ? `` : `disabled`}
      />
      <label for="filter__${this._title}" class="filter__label">
        ${this._title} 
        <span class="filter__${this._title}-count">
          ${this._count}
        </span>
      </label>
    `;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterButtonClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  createListeners() {
    this._element.querySelector(`.filter__label`)
      .addEventListener(`click`, this._onFilterButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.filter__label`)
      .removeEventListener(`click`, this._onFilterButtonClick);
  }

}
