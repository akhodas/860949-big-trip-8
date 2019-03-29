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
    this._price = options.price;
    this._offers = options.offers.map((offer) => offer);
    this._destination = options.destination;
    // this._city = options.city;
    // this._picture = options.picture;
    // this._description = options.description;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onEdit = null;
  }

  _createOffers() {
    const listOffers = [];

    for (let i = 0; i < this._offers.length; i++) {
      const element = this._offers[i];
      if (element.isSelect) {
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
      return `${Math.floor(durationHour / 24)}d ${durationHour % 24}h ${durationMin % 60}m`
    }
    return `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;
  }

  _createEventTripPoint() {
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
        <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._createOffers()}
        </ul>
      </article>
    `;
  }

  get template() {
    const dateTrip = new Date(this._dateStart);

    return `
      <section class="trip-day">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${dateTrip.getDate()}</p>
          <h2 class="trip-day__title">
            ${dateTrip.toDateString().slice(4, 7)}
             
            ${dateTrip.toDateString().slice(13, 15)}</h2>
        </article>
        <div class="trip-day__items">        
          ${this._createEventTripPoint()}          
        </div>
      </section>
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
    this._price = data.price;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite;
  }

}
