import {Icons} from './icons';
import Component from './component';

export default class TripPointEdit extends Component {
  constructor(options) {
    super();
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
            <input class="point__offers-input 
                visually-hidden" 
                type="checkbox" 
                id="${element.title.split(` `).join(`-`)}" 
                name="offer" 
                value="${element.title.split(` `).join(`-`)}">
            <label for="${element.title.split(` `).join(`-`)}" 
                class="point__offers-label">
                <span class="point__offer-service">${element.title}</span> 
                    + €<span class="point__offer-price">
                    ${element.price}
                </span>
            </label>
                `);
    }

    return listOffers.join(``);
  }

  _createTravelWaySelect() {
    const listTravelWaySelect = [];
    for (const key in Icons) {
      if (Icons.hasOwnProperty(key)) {
        listTravelWaySelect.push(`
            <input class="travel-way__select-input visually-hidden" 
                type="radio" 
                id="travel-way-${key.toLowerCase()}" 
                name="travel-way" 
                value="${key.toLowerCase()}" 
                ${(this._typeParameters.type === key) ? `checked` : ``}>
            <label class="travel-way__select-label" 
                for="travel-way-${key.toLowerCase()}">
                ${Icons[key] + ` ` + key.toLowerCase()}
            </label>
        `);
      }
    }
    return listTravelWaySelect.join(``);
  }

  get template() {
    const dateTrip = new Date(this._date);
    return `
        <article class="point">
        <form action="" method="get">
        <header class="point__header">
            <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="
                ${dateTrip.toDateString().slice(4, 10).toUpperCase()}
            " name="day">
            </label>
    
            <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">
                ${this._typeParameters.icon}
            </label>
    
            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
    
            <div class="travel-way__select">
                <div class="travel-way__select-group">
                    ${this._createTravelWaySelect()}
                </div>
            </div>
            </div>
    
            <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">
                ${this._typeParameters.title}
            </label>
            <input class="point__destination-input" list="destination-select" id="destination" 
                value="${this._city}" 
                name="destination">
            <datalist id="destination-select">
                <option value="airport"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
                <option value="hotel"></option>
            </datalist>
            </div>
    
            <label class="point__time">
            choose time
            <input class="point__input" type="text" 
                value=
                "${new Date(this._date).toTimeString().slice(0, 5)
                     + ` — `
                     + new Date(+this._date + this._duration).toTimeString().slice(0, 5)}" 
                name="time" placeholder="00:00 — 00:00">
            </label>
    
            <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
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
                ${this._createOffers()}
            </div>
    
            </section>
            <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._description}</p>
            <div class="point__destination-images">
                <img src="${this._picture}" alt="picture from place" class="point__destination-image">
            </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
        </form>
    </article>  
    `;
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

  createListeners() {
    this._element.querySelector(`.point__button--save`)
        .addEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__button--delete`)
        .addEventListener(`click`, this._onDeleteButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.point__button--save`)
        .removeEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__button--delete`)
        .removeEventListener(`click`, this._onDeleteButtonClick);
  }

}
