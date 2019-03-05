export default (config) => {
  const createOffers = (offers) => {
    const listOffers = [];

    for (let i = 0; i < offers.length; i++) {
      const element = offers[i];
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
  };

  const createEventTripPoint = (eventTripPoint) => {
    return `
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
  };

  const createTripDayItems = (dayItems) => {
    let tripDayItems = [];

    for (let i = 0; i < dayItems.length; i++) {
      tripDayItems.push(createEventTripPoint(dayItems[i]));
    }

    return tripDayItems.join(``);
  };

  const createTripDay = (date, tripDay) => {
    return `
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
  };

  return createTripDay(config.date, config.eventsDate);
};
