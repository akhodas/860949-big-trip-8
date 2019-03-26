import AbstractComponentRender from './abstract-component-render';

export default class ButtonMenu extends AbstractComponentRender {
  constructor(options) {
    super();
    this._id = options.id;
    this._title = options.title;
    this._checked = options.checked;
    this._onButtonMenu = null;
    this._onButtonMenuClick = this._onButtonMenuClick.bind(this);
  }

  get template() {
    return `
        <input
            type="radio"
            name="control"
            id="${this._id}"
            class="control__input visually-hidden"
            ${this._checked ? `checked` : ``}
        />
        <label for="${this._id}" class="control__label">${this._title}</label>
    `;
  }

  set onButtonMenu(fn) {
    this._onButtonMenu = fn;
  }

  _onButtonMenuClick(evt) {
    if (typeof this._onButtonMenu === `function`) {
      this._onButtonMenu(evt);
    }
  }

  createListeners() {
    this._element.querySelector(`.control__label`)
      .addEventListener(`click`, this._onButtonMenuClick);
  }

  removeListeners() {
    this._element.querySelector(`.control__label`)
      .removeEventListener(`click`, this._onButtonMenuClick);
  }

}
