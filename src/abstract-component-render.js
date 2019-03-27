import createElement from './create-element';

export default class AbstractComponentRender {
  constructor() {
    if (new.target === AbstractComponentRender) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render(style) {
    this._element = createElement(this.template, style);
    this.createListeners();
    return this._element;
  }

  unrender() {
    this.removeListeners();
    this._element.remove();
    this._element = null;
  }

  createListeners() {}

  removeListeners() {}

  update() {}

}
