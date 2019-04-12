import AbstractComponentRender from './abstract-component-render';

const MILLISECOND_IN_MINUTE = 60 * 1000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

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
    this._onAddOfferClick = this._onAddOfferClick.bind(this);
    this._onAddOffer = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onEdit = null;
  }


  get containerElement() {
    return this._containerElement;
  }

  get dateStart() {
    return this._dateStart;
  }

  get dateFinish() {
    return this._dateFinish;
  }

  get duration() {
    return this._duration;
  }

  get flagFirstInDay() {
    return this._flagFirstInDay;
  }

  get isDeleted() {
    return this._isDeleted;
  }

  get price() {
    return this._price;
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
          <span class="trip-point__duration">${this._convertMillisecond()}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._totalPriceTripPoint}</p>
        <ul class="trip-point__offers">
          ${this._createOffers()}
        </ul>
      </article>
    `;
  }

  get totalPriceTripPoint() {
    return this._totalPriceTripPoint;
  }

  get typeParameters() {
    return this._typeParameters;
  }


  set containerElement(container) {
    this._containerElement = container;
  }

  set flagFirstInDay(flag) {
    this._flagFirstInDay = flag;
  }

  set onAddOffer(fn) {
    this._onAddOffer = fn;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }


  delete() {
    this._isDeleted = true;
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

  _convertMillisecond() {
    const durationInMin = Math.floor(this._duration / MILLISECOND_IN_MINUTE);
    if (durationInMin < MINUTES_IN_HOUR) {
      return durationInMin < 10 ? `0${durationInMin}m` : `${durationInMin}m`;
    } else if (durationInMin >= MINUTES_IN_HOUR * HOURS_IN_DAY) {
      const durationInHour = Math.floor(durationInMin / MINUTES_IN_HOUR);
      return (Math.floor(durationInHour / HOURS_IN_DAY) < 10
        ? `0${Math.floor(durationInHour / HOURS_IN_DAY)}d `
        : `${Math.floor(durationInHour / HOURS_IN_DAY)}d `)
      + (durationInHour % HOURS_IN_DAY < 10
        ? `0${durationInHour % HOURS_IN_DAY}h `
        : `${durationInHour % HOURS_IN_DAY}h `)
      + (durationInMin % MINUTES_IN_HOUR < 10
        ? `0${durationInMin % MINUTES_IN_HOUR}m`
        : `${durationInMin % MINUTES_IN_HOUR}m`);
    }
    return (Math.floor(durationInMin / MINUTES_IN_HOUR) < 10
      ? `0${Math.floor(durationInMin / MINUTES_IN_HOUR)}h `
      : `${Math.floor(durationInMin / MINUTES_IN_HOUR)}h `)
    + (durationInMin % MINUTES_IN_HOUR < 10
      ? `0${durationInMin % MINUTES_IN_HOUR}m`
      : `${durationInMin % MINUTES_IN_HOUR}m`);
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
                    <button class="trip-point__offer"
                    >${element.title} +&euro;&nbsp;${element.price}
                    </button>
                  </li>
                `);
      }
    }

    return listOffers.join(``);
  }

  _onAddOfferClick(evt) {
    const offerSelect = evt.target.innerHTML
      .split(` `)
      .filter((item) => (item.length !== 0 && item[0] !== `+`))
      .join(` `);

    const newOffers = this._offers.map((offer) => {
      const newOffer = {
        title: offer.title,
        price: offer.price,
        isSelect: offer.isSelect,
      };

      if (offer.title === offerSelect) {
        newOffer.isSelect = true;
      }

      return newOffer;
    });

    const newData = this._processForm(newOffers);

    if (typeof this._onAddOffer === `function`) {
      this._onAddOffer(newData, this.element);
    }
  }

  _onEditButtonClick(evt) {
    if (evt.target.className !== `trip-point__offer`
        && typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  _processForm(newOffers) {
    const entry = {
      id: this._id,
      dateStart: this._dateStart,
      dateFinish: this._dateFinish,
      isFavorite: this._isFavorite,
      destination: this._destination,
      typeParameters: this._typeParameters,
      price: this._price,
      offers: newOffers,
      flagNewPoint: this._flagNewPoint,
    };

    return entry;
  }


  createListeners() {
    this._element.querySelector(`.trip-point`)
        .addEventListener(`click`, this._onEditButtonClick);
    this._element.querySelector(`.trip-point__offers`)
        .addEventListener(`click`, this._onAddOfferClick);
  }

  removeListeners() {
    this._element.querySelector(`.trip-point`)
        .removeEventListener(`click`, this._onEditButtonClick);
    this._element.querySelector(`.trip-point__offers`)
        .removeEventListener(`click`, this._onAddOfferClick);
  }

}
