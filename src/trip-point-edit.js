import {Icons} from './icons';
import AbstractComponentRender from './abstract-component-render';
import flatpickr from 'flatpickr';
import {TypesOffer} from './const-from-server';
import {TypesDestination} from './const-from-server';

export default class TripPointEdit extends AbstractComponentRender {

  constructor(options) {
    super();
    this._id = options.id;
    this._isDeleted = false;
    this._isFavorite = options.isFavorite;
    this._dateStart = options.dateStart;
    this._dateFinish = options.dateFinish;
    this._duration = this._dateFinish - this._dateStart;
    this._typeParameters = options.typeParameters;
    this._typeParametersOld = options.typeParameters;
    this._price = +options.price;
    this._offers = options.offers.map((offer) => offer);
    this._offersOld = options.offers.map((offer) => offer);
    this._totalPriceTripPoint = this._price + this._offers.reduce(
        (sum, offer) => (offer.isSelect ? sum + +offer.price : sum
        ), 0);
    this._destination = options.destination;
    this._destinationOld = options.destination;
    this._cityOld = options.destination.name;
    this._flatpickrDateStart = null;
    this._flatpickrDateFinish = null;
    this._flatpickrTimeout = null;
    this._flagNewPoint = options.flagNewPoint;
    this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onExitKeydownPress = this._onExitKeydownPress.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onSave = null;
    this._onDelete = null;
    this._onExit = null;
  }


  get template() {
    return `
        <article class="point">
        <form action="" method="get">
        <header class="point__header">
            <label class="point__date">
            choose day
            <input class="point__input point__date-flatpickr-${this._id}" 
            type="text" 
            value="${new Date(this._dateStart).toDateString().slice(4, 10).toUpperCase()}" 
            placeholder="MAR 10" 
            name="day">
            </label>
    
            <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle-${this._id}">
                ${this._typeParameters.icon || `---`}
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
                ${this._typeParameters.title || `---`}
            </label>
            <input class="point__destination-input" list="destination-select" id="destination" 
                value="${this._destination.name}" 
                name="destination">
            <datalist id="destination-select">
              ${this._optionsDatalist()}
            </datalist>
            </div>
            
            <div class="point__time">
              choose time
              <input class="point__input point__date-start-${this._id}" type="text" 
                value="${new Date(this._dateStart).toDateString().slice(4)}" 
                name="date-start">
              <input class="point__input point__date-finish-${this._id}" type="text" 
                value="${new Date(this._dateFinish).toDateString().slice(4)}"
                name="date-end" placeholder="21:00">
            </div>

            <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
            </label>
    
            <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
            </div>
    
            <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" 
            id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
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
            <h3 class="point__details-title">destination</h3>
            <p class="point__destination-text">${this._destination.description}</p>
            <div class="point__destination-images">
              ${this._createImages()}
            </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
        </form>
    </article>  
    `;
  }


  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onExit(fn) {
    this._onExit = fn;
  }

  set onSave(fn) {
    this._onSave = fn;
  }


  update(data) {
    this._dateStart = data.dateStart;
    this._dateFinish = data.dateFinish;
    this._duration = this._dateFinish - this._dateStart;
    this._destination = data.destination;
    this._destinationOld = data.destination;
    this._cityOld = data.destination.name;
    this._typeParameters = data.typeParameters;
    this._typeParametersOld = data.typeParameters;
    this._price = +data.price;
    this._offers = data.offers;
    this._offersOld = data.offers;
    this._totalPriceTripPoint = this._price + this._offers.reduce(
        (sum, offer) => (offer.isSelect ? sum + +offer.price : sum
        ), 0);
    this._isFavorite = data.isFavorite;
  }


  _createImages() {
    return this._destination.pictures.map((image) => {
      return `
        <img 
          src="${image.src}" 
          alt="${image.description}" 
          class="point__destination-image">
        `;
    }).join(``);
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
                for="travel-way-${key.toLowerCase()}-
                  ${this._id}">${Icons[key]} ${key.toLowerCase()}</label>
        `);
      }
    }

    return listTravelWaySelect.join(``);
  }

  _onChangeDestination(evt) {
    const selectDestination = evt.target.value;

    if (!evt.inputType) {
      this._destination = (TypesDestination.some((obj) => (obj.name === selectDestination))) ?
        TypesDestination.filter((obj) => (obj.name === selectDestination))[0]
        : {
          description: ``,
          name: ``,
          pictures: [{
            description: ``,
            src: ``,
          }],
        };

      this.removeListeners();
      this._partialUpdate();
      this.createListeners();
    }
  }

  _onChangeType(evt) {
    if (evt.target.tagName === `LABEL`) {
      const selectType = evt.target.textContent.split(` `)[1];

      this._typeParameters = {
        type: selectType,
        title: `${selectType.slice(0, 1).toUpperCase() + selectType.slice(1)} to `,
        icon: Icons[selectType],
      };
      this._offers = (TypesOffer.some((obj) => (obj.type === selectType))) ?
        TypesOffer.filter((obj) => (obj.type === selectType))[0]
      .offers.map((offer) => offer)
        : [];

      this.removeListeners();
      this._partialUpdate();
      this.createListeners();
    }

  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();

    if (typeof this._onDelete === `function`) {
      this._onDelete(this._id, this.element);

      this._isDeleted = true;
    }
  }

  _onExitKeydownPress(evt) {
    if (evt.key === `Escape` && typeof this._onExit === `function`) {
      this._typeParameters = this._typeParametersOld;
      this._offers = this._offersOld;
      this._destinationOld.name = this._cityOld;
      this._destination = this._destinationOld;

      this._onExit();

      if (this._flagNewPoint) {
        this._isDeleted = true;
      }
    }
  }

  _onSaveButtonClick(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`.point form`));

    const newData = this._processForm(formData);

    try {
      this._validationData(newData);

      if (typeof this._onSave === `function`) {
        this._onSave(newData, this.element);
        this.update(newData);
      }
    } catch (error) {
      this._showMessageError(alert, error.message);
    }
  }

  _optionsDatalist() {
    return TypesDestination
            .map((obj) => `<option value="${obj.name}"></option>`)
            .join(``);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _processForm(formData) {
    const entry = {
      id: this._id,
      dateStart: new Date(),
      datefinish: new Date(),
      isFavorite: false,
      destination: this._destination,
      typeParameters: {},
      price: 0,
      offers: this._offers.map((offer) => {
        return {
          title: offer.title,
          price: offer.price,
          isSelect: false,
        };
      }),
      flagNewPoint: this._flagNewPoint,
    };

    const tripPointMapper = TripPointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (tripPointMapper[property]) {
        tripPointMapper[property](value);
      }
    }

    return entry;
  }

  _showMessageError(func, messageError) {
    func(messageError);
  }

  _validationData(data) {
    const err = new Error();

    if (!data.destination.name
        || !TypesDestination.some((type) => data.destination.name === type.name)) {
      err.message = `Не выбрана точка назначения. Укажите один из предложенных городов!`;
      throw err;
    }

    if (data.dateFinish - data.dateStart <= 0) {
      err.message = `Дата окончания события должна быть позже, чем дата начала события`;
      throw err;
    }

    if (!data.dateFinish || !data.dateStart) {
      err.message = `Ошибка при вводе даты`;
      throw err;
    }

    if (!data.typeParameters.type) {
      err.message = `Не выбран тип поездки`;
      throw err;
    }

    if (typeof +data.price !== `number` || isNaN(+data.price)) {
      err.message = `Не правильно указана цена`;
      throw err;
    }

  }


  createListeners() {
    this._element.querySelector(`.point__button--save`)
      .addEventListener(`click`, this._onSaveButtonClick);

    this._element.querySelector(`[type='reset']`)
      .addEventListener(`click`, this._onDeleteButtonClick);

    this._element.querySelector(`.travel-way__select-group`)
      .addEventListener(`click`, this._onChangeType);

    this._element.querySelectorAll(`.point__destination-input`)[0]
      .addEventListener(`input`, this._onChangeDestination);

    window.addEventListener(`keydown`, this._onExitKeydownPress);

    this._flatpickrTimeout = setTimeout(() => {
      this._flatpickrDateStart = flatpickr(`.point__date-start-${this._id}`,
          {altInput: true,
            enableTime: true,
            defaultDate: [this._dateStart],
            altFormat: `H:i`,
            [`time_24hr`]: true,
            dateFormat: `M j Y H:i`
          });
      this._flatpickrDateFinish = flatpickr(`.point__date-finish-${this._id}`,
          {altInput: true,
            enableTime: true,
            defaultDate: [this._dateFinish],
            altFormat: `H:i`,
            [`time_24hr`]: true,
            dateFormat: `M j Y H:i`
          });
    }, 0);

  }

  removeListeners() {
    this._element.querySelector(`.point__button--save`)
      .removeEventListener(`click`, this._onSaveButtonClick);

    this._element.querySelector(`[type='reset']`)
      .removeEventListener(`click`, this._onDeleteButtonClick);

    this._element.querySelector(`.travel-way__select-group`)
      .removeEventListener(`click`, this._onChangeType);

    this._element.querySelectorAll(`.point__destination-input`)[0]
      .removeEventListener(`input`, this._onChangeDestination);

    window.removeEventListener(`keydown`, this._onExitKeydownPress);

    clearTimeout(this._flatpickrTimeout);
    if (this._flatpickrDateStart) {
      this._flatpickrDateStart.destroy();
      this._flatpickrDateStart = null;
      this._flatpickrDateFinish.destroy();
      this._flatpickrDateFinish = null;
    }
  }


  static createMapper(target) {
    return {
      [`date-start`]: (value) => {
        target.dateStart = +new Date(value).getTime();
      },
      [`date-end`]: (value) => {
        target.dateFinish = +new Date(value).getTime();
      },
      favorite: (value) => {
        target.isFavorite = (value === `on`);
      },
      destination: (value) => {
        target.destination.name = value;
      },
      [`travel-way`]: (value) => {
        target.typeParameters.type = value;
        target.typeParameters.title = `${value.slice(0, 1).toUpperCase() + value.slice(1)} to `;
        target.typeParameters.icon = Icons[value];
      },
      price: (value) => {
        target.price = +value;
      },
      offer: (value) => {
        target.offers.forEach((offer) => {
          if (offer.title.split(`-`).join(` `) === value.split(`-`).join(` `)) {
            offer.isSelect = true;
          }
        });
      },
    };
  }

}
