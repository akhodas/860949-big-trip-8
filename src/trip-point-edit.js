import {Icons} from './icons';
import AbstractComponentRender from './abstract-component-render';
import flatpickr from 'flatpickr';

export default class TripPointEdit extends AbstractComponentRender {
  constructor(options) {
    super();
    this._id = options.id;
    this._date = options.date;
    this._duration = options.duration;
    this._city = options.city;
    this._typeParameters = options.typeParameters;
    this._price = options.price;
    this._offers = options.offers.map((offer) => offer);
    this._picture = options.picture;
    this._description = options.description;
    this._element = null;
    this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
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
                id="${element.title.split(` `).join(`-`)}-${this._id}" 
                name="offer" 
                value="${element.title.split(` `).join(`-`)}" 
                ${element.isSelect ? `checked` : ``}>
            <label for="${element.title.split(` `).join(`-`)}-${this._id}" 
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
                id="travel-way-${key.toLowerCase()}-${this._id}" 
                name="travel-way" 
                value="${key.toLowerCase()}" 
                ${(this._typeParameters.type === key) ? `checked` : ``}>
            <label class="travel-way__select-label" 
                for="travel-way-${key.toLowerCase()}-${this._id}">${Icons[key] + ` ` + key.toLowerCase()}</label>
        `);
      }
    }
    return listTravelWaySelect.join(``);
  }

  get template() {
    const dateTrip = new Date(this._date);
    return `
        <article class="point">
        <form class="point-form-my" action="" method="get">
        <header class="point__header">
            <label class="point__date">
            choose day
            <input class="point__input point__date-flatpickr-${this._id}" 
            type="text" 
            value="${dateTrip.toDateString().slice(4, 10).toUpperCase()}" 
            placeholder="MAR 10" 
            name="day">
            </label>
    
            <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle-${this._id}">
                ${this._typeParameters.icon}
            </label>
    
            <input type="checkbox" 
              class="travel-way__toggle visually-hidden" 
              id="travel-way__toggle-${this._id}">
    
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
            <input class="point__input point__time-flatpickr-${this._id}" type="text" 
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

  _onSaveButtonClick(event) {
    event.preventDefault();
    const formData = new FormData(this._element.querySelector(`.point-form-my`));
    const newData = this._processForm(formData);
    // console.log(newData);
    if (typeof this._onSave === `function`) {
      this._onSave(newData);
    }
    this.update(newData);
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _onChangeType(event) {
    const selectType = event.srcElement.textContent.split(` `)[1];
    this._typeParameters = {
      type: selectType,
      title: `${selectType.slice(0, 1).toUpperCase() + selectType.slice(1)} to `,
      icon: Icons[selectType],
    };
    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _processForm(formData) {
    const entry = {
      date: new Date(),
      duration: 0,
      city: ``,
      typeParameters: {},
      price: 0,
      offers: this._offers.map((offer) => {
        return {
          title: offer.title,
          price: offer.price,
          isSelect: false,
        };
      }),
    };

    const tripPointMapper = TripPointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      console.log(pair);
      const [property, value] = pair;
      if (tripPointMapper[property]) {
        tripPointMapper[property](value);
      }
    }

    return entry;
  }

  static createMapper(target) {
    return {
      day: (value) => {
        // console.log(value);
        // console.log(new Date(`${value} 2019`));
        // console.log(new Date(`${value} 2019`).getTime());
        
        target.date = new Date(`${value} 2019`).getTime();
      },
      time: (value) => {
        target.duration = 3600000;
        target.date = new Date(
            +target.date
            + (value.slice(0, 2) * 60 + +value.slice(3)) * 60 * 1000
        );
      },
      destination: (value) => {
        target.city = value;
      },
      [`travel-way`]: (value) => {
        target.typeParameters.type = value;
        target.typeParameters.title = `${value.slice(0, 1).toUpperCase() + value.slice(1)} to `;
        target.typeParameters.icon = Icons[value];
      },
      price: (value) => {
        target.price = value;
      },
      offer: (value) => {
        for (let i = 0; i < target.offers.length; i++) {
          if (target.offers[i].title === value.split(`-`).join(` `)) {
            target.offers[i].isSelect = true;
          }
        }
      },
    };
  }

  createListeners() {
    console.log(this._date);
    this._element.querySelector(`.point__button--save`)
      .addEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__button--delete`)
      .addEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.travel-way__select-group`)
      .addEventListener(`click`, this._onChangeType);
    setTimeout(() => {
      flatpickr(`.point__date-flatpickr-${this._id}`,
          {altInput: true,
            defaultDate: [this._date],
            altFormat: `M j`,
            dateFormat: `M j`
          });
      flatpickr(`.point__time-flatpickr-${this._id}`,
          {enableTime: true,
            noCalendar: true,
            altInput: true,
            altFormat: `H:i`,
            dateFormat: `H:i`,
          });
    }, 0);

  }

  removeListeners() {
    this._element.querySelector(`.point__button--save`)
      .removeEventListener(`click`, this._onSaveButtonClick);
    this._element.querySelector(`.point__button--delete`)
      .removeEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.travel-way__select-group`)
      .removeEventListener(`click`, this._onChangeType);
  }

  update(data) {
    console.log(new Date(data.date));
    console.log(new Date(this._date));
    this._date = data.date;
    console.log(new Date(data.date));
    console.log(new Date(this._date));
    this._duration = data.duration;
    this._city = data.city;
    this._typeParameters = data.typeParameters;
    this._price = data.price;
    this._offers = data.offers;
  }

}
