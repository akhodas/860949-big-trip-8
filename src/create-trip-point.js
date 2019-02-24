export default (config) => {
  const feildTripPoint = createTripDay(config.date, config.eventsDate);

  function createTripDay(date, tripDay) {
    const feildTripDay = `
      <section class="trip-day">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${date.day}</p>
          <h2 class="trip-day__title">${date.month} ${date.year}</h2>
        </article>

        <div class="trip-day__items">
        
          ${createTripDayItems(tripDay)}
          
        </div>
      </section>
    `;

    return feildTripDay;
  }

  function createTripDayItems(dayItems) {
    let tripDayItems = ``;


    for (let i = 0; i < dayItems.length; i++) {
      tripDayItems += createEventTripPoint(dayItems[i]);
    }

    return tripDayItems;
  }

  function createEventTripPoint(eventTripPoint) {
    const event = `
      <article class="trip-point">
        <i class="trip-icon">${eventTripPoint.icon}</i>
        <h3 class="trip-point__title">${eventTripPoint.title}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">
          ${eventTripPoint.timeStart}&nbsp;&mdash; ${eventTripPoint.timeFinish}</span>
          <span class="trip-point__duration">${eventTripPoint.timeEvent}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${eventTripPoint.price}</p>
        <ul class="trip-point__offers">
          ${createOffers(eventTripPoint.offers)}
        </ul>
      </article>
    `;

    return event;
  }

  function createOffers(offers) {
    let feildOffers = ``;

    for (let i = 0; i < offers.length; i++) {
      const element = offers[i];
      feildOffers += `
                  <li>
                    <button class="trip-point__offer">
                      ${element.title} 
                      +&euro;&nbsp;
                      ${element.price}
                    </button>
                  </li>
                `;
    }

    return feildOffers;
  }

  return feildTripPoint;
};
