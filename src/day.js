import AbstractComponentRender from './abstract-component-render';

export default class Day extends AbstractComponentRender {
  constructor(dateStart) {
    super();
    this._dateStart = dateStart;
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
        
        </div>
      </section>
    `;
  }

  get date() {
    return this._dateStart;
  }


}
