export default class TripPoint {
  constructor(options) {
    this.date = options.date;
    this.duration = options.duration;
    this.city = options.city;
    this.icon = options.icon;
    this.type = options.type;
    this.price = options.price;
    this.offers = options.offers;
    this.picture = options.picture;
    this.description = options.description;
  }

  _createOffers() {
    const listOffers = [];

    for (let i = 0; i < this.offers.length; i++) {
      const element = this.offers[i];
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
    const durationMin = this.duration / (60 * 1000);
    return `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;
  }

  _createEventTripPoint() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this.icon}</i>
        <h3 class="trip-point__title">${this.type} to ${this.city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">
            ${new Date(this.date).toTimeString().slice(0, 5)}
            &nbsp;&mdash; 
            ${new Date(+this.date + this.duration).toTimeString().slice(0, 5)}
          </span>
          <span class="trip-point__duration">${this._durationInHour()}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this.price}</p>
        <ul class="trip-point__offers">
          ${this._createOffers()}
        </ul>
      </article>
    `;
  }

  prepareForDrow() {
    const dateTrip = new Date(this.date);
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

}
