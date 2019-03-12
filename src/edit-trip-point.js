import createElement from './create-element';

export default class EditTripPoint {
  constructor(options) {
    this._date = options.date;
    this._duration = options.duration;
    this._city = options.city;
    this._typeParameters = options.typeParameters;
    this._price = options.price;
    this._offers = options.offers;
    this._picture = options.picture;
    this._description = options.description;
    this._element = null;
    this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onSave = null;
    this._onDelete = null;
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
        <h3 class="trip-point__title">${this._typeParameters.title + this.city}</h3>
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

  get template1() {
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

  get template() {
    return `
        <article class="point">
        <form action="" method="get">
        <header class="point__header">
            <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day">
            </label>
    
            <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">✈️</label>
    
            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
    
            <div class="travel-way__select">
                <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
                <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
    
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
    
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
    
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" checked>
                <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                </div>
    
                <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
                <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
    
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
                <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                </div>
            </div>
            </div>
    
            <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">Flight to</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="Chamonix" name="destination">
            <datalist id="destination-select">
                <option value="airport"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
                <option value="hotel"></option>
            </datalist>
            </div>
    
            <label class="point__time">
            choose time
            <input class="point__input" type="text" value="00:00 — 00:00" name="time" placeholder="00:00 — 00:00">
            </label>
    
            <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="160" name="price">
            </label>
    
            <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button point__button--delete" type="reset">Delete</button>
            </div>
    
            <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
            <label class="point__favorite" for="favorite">favorite</label>
            </div>
        </header>
    
        <section class="point__details">
            <section class="point__offers">
            <h3 class="point__details-title">offers</h3>
    
            <div class="point__offers-wrap">
                <input class="point__offers-input visually-hidden" type="checkbox" id="add-luggage" name="offer" value="add-luggage">
                <label for="add-luggage" class="point__offers-label">
                <span class="point__offer-service">Add luggage</span> + €<span class="point__offer-price">30</span>
                </label>
    
                <input class="point__offers-input visually-hidden" type="checkbox" id="switch-to-comfort-class" name="offer" value="switch-to-comfort-class">
                <label for="switch-to-comfort-class" class="point__offers-label">
                <span class="point__offer-service">Switch to comfort class</span> + €<span class="point__offer-price">100</span>
                </label>
    
                <input class="point__offers-input visually-hidden" type="checkbox" id="add-meal" name="offer" value="add-meal">
                <label for="add-meal" class="point__offers-label">
                <span class="point__offer-service">Add meal </span> + €<span class="point__offer-price">15</span>
                </label>
    
                <input class="point__offers-input visually-hidden" type="checkbox" id="choose-seats" name="offer" value="choose-seats">
                <label for="choose-seats" class="point__offers-label">
                <span class="point__offer-service">Choose seats</span> + €<span class="point__offer-price">5</span>
                </label>
            </div>
    
            </section>
            <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>
            <div class="point__destination-images">
                <img src="http://picsum.photos/330/140?r=123" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/300/200?r=1234" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/300/100?r=12345" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/200/300?r=123456" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/100/300?r=1234567" alt="picture from place" class="point__destination-image">
            </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
        </form>
    </article>  
    `;
  }

  get element() {
    return this._element;
  }

  set onSave(fn) {
    this._onSave = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _onSaveButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSave === `function`) {
      this._onSave();
    }
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  bind() {
    this._element.querySelector(`.point__button--save`)
        .addEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__button--delete`)
        .addEventListener(`click`, this._onDeleteButtonClick);
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
        .removeEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__button--delete`)
        .removeEventListener(`click`, this._onDeleteButtonClick);
  }

}
