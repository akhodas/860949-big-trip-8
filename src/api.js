import ModelTripPoint from './model-trip-point';
import ModelTypeDestination from './model-type-destination';
import ModelTypeOffer from './model-type-offers';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export default class API {

  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._timeBlockForError = 1000;
  }


  getData(additionalUrl) {
    const elementNoTripPoints = document.querySelector(`.no-trip-points`);

    elementNoTripPoints.classList.remove(`visually-hidden`);
    elementNoTripPoints.textContent = `Loading route...`;

    return this._load({url: additionalUrl})
      .then((response) => {
        elementNoTripPoints.classList.add(`visually-hidden`);
        elementNoTripPoints.
          textContent = `You have no events! To create a new click 
            on «+ New Event» button. `;

        return this._toJSON(response);
      })
      .then(this._changeModelParse(additionalUrl))
      .catch((err) => {
        elementNoTripPoints.
          textContent = `Something went wrong while loading your route info. 
            Check your connection or try again later`;

        err.message = `Отсутствует связь с сервером. Попробуйте позже!`;
        throw err;
      });
  }

  createTripPoint({data}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(this._toJSON)
      .then(ModelTripPoint.parseTripPoint);
  }

  updateTripPoint({id, data}, element) {
    const elementPoint = document.querySelector(`.point`);

    this._toBlock(element);
    if (elementPoint) {
      element.querySelector(`.point__button--save`).textContent = `Saving...`;
    }
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(this._toJSON)
      .then(ModelTripPoint.parseTripPoint)
      .catch((err) => {
        setTimeout(() => {
          this._shake(element);
          if (elementPoint) {
            element.querySelector(`.point__button--save`).textContent = `Save`;
          }
          this._toUnblock(element);
        }, this._timeBlockForError);

        err.message = `Отсутствует связь с сервером. Попробуйте позже!`;
        throw err;
      });
  }

  deleteTripPoint({id}, element) {
    this._toBlock(element);
    element.querySelector(`[type='reset']`).textContent = `Deleting...`;
    return this._load({url: `points/${id}`, method: Method.DELETE})
      .then((response) => {
        return response;
      })
    .catch((err) => {
      this._shake(element);
      element.querySelector(`[type='reset']`).textContent = `Delete`;
      this._toUnblock(element);

      err.message = `Отсутствует связь с сервером. Попробуйте позже!`;
      throw err;
    });
  }


  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _changeModelParse(additionalUrl) {
    switch (additionalUrl) {
      case `points`:
        return ModelTripPoint.parseTripPoints;

      case `destinations`:
        return ModelTypeDestination.parseTypesDestinations;

      case `offers`:
        return ModelTypeOffer.parseOffers;

      default :
        return ``;
    }
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {

    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  _toJSON(response) {
    return response.json();
  }

  _toBlock(element) {
    const elementPoint = document.querySelector(`.point`);

    if (elementPoint) {
      elementPoint.style = ``;
      element.querySelector(`.point__button--save`).disabled = true;
      element.querySelector(`[type='reset']`).disabled = true;
      element.querySelector(`.point__destination-input`).disabled = true;
    }
  }

  _toUnblock(element) {
    const elementPoint = document.querySelector(`.point`);

    if (elementPoint) {
      element.querySelector(`.point__button--save`).disabled = false;
      element.querySelector(`[type='reset']`).disabled = false;
      element.querySelector(`.point__destination-input`).disabled = false;
      elementPoint.style = `border: 2px solid red;`;
    }
  }

  _shake(element) {
    const ANIMATION_TIMEOUT = 600;
    element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }
}

