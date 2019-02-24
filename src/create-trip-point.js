export default (config) => {
  const tripPoint = `<h1>Trip Point #${config.id} TESTING</h1>
    <section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">1</p>
        <h2 class="trip-day__title">Mar 18</h2>
      </article>

      <div class="trip-day__items">
        <article class="trip-point">
          <i class="trip-icon">🚕</i>
          <h3 class="trip-point__title">Taxi to Airport</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
            <span class="trip-point__duration">1h 30m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;20</p>
          <ul class="trip-point__offers">
            <li>
              <button class="trip-point__offer">Order UBER +&euro;&nbsp;20</button>
            </li>
            <li>
              <button class="trip-point__offer">Upgrade to business +&euro;&nbsp;20</button>
            </li>
          </ul>
        </article>
        <article class="trip-point">
          <i class="trip-icon">✈️</i>
          <h3 class="trip-point__title">Flight to Geneva</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
            <span class="trip-point__duration">1h 30m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;20</p>
          <ul class="trip-point__offers">
            <li>
              <button class="trip-point__offer">Upgrade to business +&euro;&nbsp;20</button>
            </li>
            <li>
              <button class="trip-point__offer">Select meal +&euro;&nbsp;20</button>
            </li>
          </ul>
        </article>
        <article class="trip-point">
          <i class="trip-icon">🚗</i>
          <h3 class="trip-point__title">Drive to Chamonix</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
            <span class="trip-point__duration">1h 30m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;20</p>
          <ul class="trip-point__offers">
            <li>
                <button class="trip-point__offer">Rent a car +&euro;&nbsp;200</button>
              </li>
          </ul>
        </article>
        <article class="trip-point">
          <i class="trip-icon">🏨</i>
          <h3 class="trip-point__title">Check into a hotel</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
            <span class="trip-point__duration">1h 30m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;20</p>
          <ul class="trip-point__offers">
            <li>
              <button class="trip-point__offer">Add breakfast +&euro;&nbsp;20</button>
            </li>
          </ul>
        </article>
      </div>
    </section>
  `;

  return tripPoint;
};
