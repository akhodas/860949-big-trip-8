import AbstractComponentRender from './abstract-component-render';

export default class Filter extends AbstractComponentRender {
  constructor(options) {
    super();
    this._title = options.title;
    this._checked = options.checked;
    this._countPoints = 0;
    this._disabledState = false;
    this._onFilter = null;
    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);
  }

  get countPoints() {
    return this._countPoints;
  }

  set countPoints(value) {
    this._countPoints = value;
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

  checkFilterOnCountPoints() {
    if (this._countPoints === 10) {
      document.getElementById(`filter-${this._title}`).disabled = true;
      this.removeListeners();
      this._disabledState = true;
    } else {
      if (this._disabledState) {
        document.getElementById(`filter-${this._title}`).disabled = false;
        this._disabledState = false;
        this.createListeners();
      }
    }
  }

  createListeners() {
    this._element.querySelector(`.trip-filter__item`)
      .addEventListener(`click`, this._onFilterButtonClick);
  }

  removeListeners() {
    if (!this._disabledState) {
      this._element.querySelector(`.trip-filter__item`)
        .removeEventListener(`click`, this._onFilterButtonClick);
    }
  }

  _onFilterButtonClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

}
