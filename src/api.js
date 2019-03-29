import ModelTripPoint from './model-trip-point';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._timeBlockForError = 1000;
  }

  getTasks(additionalUrl) {
    document.querySelector(`.trip-points`).classList.add(`visually-hidden`);
    document.querySelector(`.no-trip-points`).classList.remove(`visually-hidden`);
    document.querySelector(`.no-trip-points`).textContent = `Loading route...`;

    return this._load({url: additionalUrl})
      .then((response) => {
        document.querySelector(`.no-trip-points`).classList.add(`visually-hidden`);
        document.querySelector(`.trip-points`).classList.remove(`visually-hidden`);
        document.querySelector(`.no-trip-points`).
          textContent = `You have no events! To create a new click 
            on «+ New Event» button. `;

        // console.log(toJSON(response));
        console.log(`toJSON(response)`);
        return toJSON(response);
      })
      .then(ModelTripPoint.parseTripPoints)
      .catch((err) => {
        document.querySelector(`.no-trip-points`).
          textContent = `Something went wrong while loading your route info. 
            Check your connection or try again later`;

        throw err;
      });
  }

  createTask({task}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoint);
  }

  updateTask({id, data}, element) {
    this._blok(element);
    element.querySelector(`.point__button--save`).textContent = `Saving...`;
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoint)
      .catch((err) => {
        setTimeout(() => {
          this._shake(element);
          element.querySelector(`.point__button--save`).textContent = `Save`;
          this._unblok(element);
        }, this._timeBlockForError);
        throw err;
      });
  }

  deleteTask({id}, element) {
    this._blok(element);
    element.querySelector(`[type='reset']`).textContent = `Deleting...`;
    return this._load({url: `points/${id}`, method: Method.DELETE})
      .then((response) => {
        return response;
      })
    .catch((err) => {
      this._shake(element);
      element.querySelector(`[type='reset']`).textContent = `Delete`;
      this._unblok(element);
      throw err;
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {

    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  _blok(element) {
    element.querySelector(`.point`).style = ``;
    element.querySelector(`.point__button--save`).disabled = true;
    element.querySelector(`[type='reset']`).disabled = true;
    element.querySelector(`.point__destination-input`).disabled = true;
  }

  _unblok(element) {
    element.querySelector(`.point__button--save`).disabled = false;
    element.querySelector(`[type='reset']`).disabled = false;
    element.querySelector(`.point__destination-input`).disabled = false;
    element.querySelector(`.point`).style = `border: 2px solid red;`;
  }

  _shake(element) {
    const ANIMATION_TIMEOUT = 600;
    element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }
}

