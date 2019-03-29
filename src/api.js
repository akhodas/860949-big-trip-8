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

  getTasks() {
    // document.querySelector(`.board__tasks`).classList.add(`visually-hidden`);
    // document.querySelector(`.board__no-tasks`).classList.remove(`visually-hidden`);
    // document.querySelector(`.board__no-tasks`).textContent = `Loading tasks...`;

    return this._load({url: `points`})
      .then((response) => {
        // document.querySelector(`.board__no-tasks`).classList.add(`visually-hidden`);
        // document.querySelector(`.board__tasks`).classList.remove(`visually-hidden`);
        // document.querySelector(`.board__no-tasks`).
        //   textContent = `Congratulations, all tasks were completed!
        //     To create a new click on «add new task» button.`;

        // console.log(toJSON(response));
        return toJSON(response);
      })
      .then(ModelTripPoint.parseTripPoints)
      .catch((err) => {
        // document.querySelector(`.board__no-tasks`).
        //   textContent = `Something went wrong while loading your tasks.
        //     Check your connection or try again later`;

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
    // this._blok(element);
    // element.querySelector(`.card__save`).textContent = `Saving...`;
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoint)
      .catch((err) => {
        // setTimeout(() => {
        //   this._shake(element);
        //   element.querySelector(`.card__save`).textContent = `Save`;
        //   this._unblok(element);
        // }, this._timeBlockForError);
        throw err;
      });
  }

  deleteTask({id}, element) {
    // this._blok(element);
    // element.querySelector(`.card__delete`).textContent = `Deleting...`;
    return this._load({url: `tasks/${id}`, method: Method.DELETE})
      .then((response) => {
        return response;
      });
    // .catch((err) => {
    //   this._shake(element);
    //   element.querySelector(`.card__delete`).textContent = `Delete`;
    //   this._unblok(element);
    //   throw err;
    // });
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
    element.querySelector(`.card__inner`).style = ``;
    element.querySelector(`.card__save`).disabled = true;
    element.querySelector(`.card__delete`).disabled = true;
    element.querySelector(`.card__text`).disabled = true;
  }

  _unblok(element) {
    element.querySelector(`.card__save`).disabled = false;
    element.querySelector(`.card__delete`).disabled = false;
    element.querySelector(`.card__text`).disabled = false;
    element.querySelector(`.card__inner`).style = `border: 2px solid red;`;
  }

  _shake(element) {
    const ANIMATION_TIMEOUT = 600;
    element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }
}

