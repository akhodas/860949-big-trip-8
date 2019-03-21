import AbstractComponentRender from './abstract-component-render';

export default class TripPoint extends AbstractComponentRender {
  constructor(options) {
    super();
    this._id = options.id;
    this._date = options.date;
    this._duration = options.duration;
    this._city = options.city;
    this._typeParameters = options.typeParameters;
    this._price = options.price;
    this._offers = options.offers;
    this._picture = options.picture;
    this._description = options.description;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onEdit = null;
  }

  _createOffers() {
    const listOffers = [];

    for (let i = 0; i < this._offers.length; i++) {
      const element = this._offers[i];
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

    return listOffers.join(``);
  }

  _durationInHour() {
    const durationMin = this._duration / (60 * 1000);
    return `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;
  }

  _createEventTripPoint() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._typeParameters.icon}</i>
        <h3 class="trip-point__title">${this._typeParameters.title + this._city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">
            ${new Date(this._date).toTimeString().slice(0, 5)}
            &nbsp;&mdash; 
            ${new Date(+this._date + this._duration).toTimeString().slice(0, 5)}
          </span>
          <span class="trip-point__duration">${this._durationInHour()}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._createOffers()}
        </ul>
      </article>
    `;
  }

  get template() {
    const dateTrip = new Date(this._date);
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

  set onEdit(fn) {
    this._onEdit = fn;
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

}
