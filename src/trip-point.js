import AbstractComponentRender from './abstract-component-render';

export default class TripPoint extends AbstractComponentRender {
  constructor(options) {
    super();
    this._id = options.id;
    this._isDeleted = false;
    this._isFavorite = options.isFavorite;
    this._dateStart = options.dateStart;
    this._dateFinish = options.dateFinish;
    this._duration = this._dateFinish - this._dateStart;
    this._typeParameters = options.typeParameters;
    this._price = +options.price;
    this._offers = options.offers.map((offer) => offer);
    this._totalPriceTripPoint = this._price + this._offers.reduce(
        (sum, offer) => (offer.isSelect ? sum + +offer.price : sum
        ), 0);
    this._destination = options.destination;
    this._flagFirstInDay = true;
    this._containerElement = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onEdit = null;
  }

  _createOffers() {
    const listOffers = [];
    let counter = 0;

    for (let i = 0; i < this._offers.length; i++) {
      const element = this._offers[i];
      if (!element.isSelect && counter < 3) {
        counter++;
        listOffers.push(`
                  <li>
                    <button class="trip-point__offer">
                      ${element.title} 
                      +&euro;&nbsp;
                      ${element.price}
                    </button>
                  </li>
                `);
      }
    }

    return listOffers.join(``);
  }

  _durationInHourDay() {
    const durationMin = Math.floor(this._duration / (60 * 1000));
    if (durationMin < 60) {
      return `${durationMin % 60}m`;
    } else if (durationMin > 1440) {
      const durationHour = Math.floor(durationMin / 60);
      return `${Math.floor(durationHour / 24)}d ${durationHour % 24}h ${durationMin % 60}m`;
    }
    return `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._typeParameters.icon}</i>
        <h3 class="trip-point__title">${this._typeParameters.title + this._destination.name}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">
            ${new Date(this._dateStart).toTimeString().slice(0, 5)}
            &nbsp;&mdash; 
            ${new Date(this._dateFinish).toTimeString().slice(0, 5)}
          </span>
          <span class="trip-point__duration">${this._durationInHourDay()}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._totalPriceTripPoint}</p>
        <ul class="trip-point__offers">
          ${this._createOffers()}
        </ul>
      </article>
    `;
  }

  get date() {
    return this._dateStart;
  }

  get isDeleted() {
    return this._isDeleted;
  }

  get typeParameters() {
    return this._typeParameters;
  }

  get price() {
    return this._price;
  }

  get duration() {
    return this._duration;
  }

  get dateStart() {
    return this._dateStart;
  }

  get flagFirstInDay() {
    return this._flagFirstInDay;
  }

  set flagFirstInDay(flag) {
    this._flagFirstInDay = flag;
  }

  get containerElement() {
    return this._containerElement;
  }

  set containerElement(container) {
    this._containerElement = container;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  delete() {
    this._isDeleted = true;
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  createListeners() {
    this._element.querySelector(`.trip-point`)
        .addEventListener(`click`, this._onEditButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.trip-point`)
        .removeEventListener(`click`, this._onEditButtonClick);
  }

  update(data) {
    this._dateStart = data.dateStart;
    this._dateFinish = data.dateFinish;
    this._duration = this._dateFinish - this._dateStart;
    this._destination = data.destination;
    this._typeParameters = data.typeParameters;
    this._price = +data.price;
    this._offers = data.offers;
    this._totalPriceTripPoint = this._price + this._offers.reduce(
        (sum, offer) => (offer.isSelect ? sum + +offer.price : sum
        ), 0);
    this._isFavorite = data.isFavorite;
  }

}
