import AbstractComponentRender from './abstract-component-render';

export default class Day extends AbstractComponentRender {
  constructor(dateStart) {
    super();
    this._dateStart = dateStart;
  }

  get date() {
    return this._dateStart;
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

}
