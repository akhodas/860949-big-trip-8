export default (count = 0) => {
  const iconBase = [`🚕`, `✈️`, `🚗`, `🏨`];
  const tripPoints = [];

  for (let i = 0; i < count; i++) {
    const tripPoint = {};

    tripPoint.date = createObjectDate();
    tripPoint.options = createObjectOptions();

    tripPoints.push(tripPoint);
  }

  function createObjectDate() {
    const date = {
      day: Math.round(Math.random() * 4) + 1,
      month: `April`,
      year: 2018
    };
    return date;
  }

  function createObjectOptions() {
    const options = {};

    const timeStart = Math.round(Math.random() * 18);
    const timeFinish = timeStart + Math.round(Math.random() * 5);

    options.icon = iconBase[Math.round(Math.random() * 3)];
    options.title = `Taxi to point #${[Math.round(Math.random() * 100)]}`;
    options.timeStart = `${timeStart}:00`;
    options.timeFinish = `${timeFinish}:30`;
    options.timeEvent = `${timeFinish - timeStart}h 30m`;
    options.price = Math.round(Math.random() * 10) * 10;
    options.offers = [
      {
        title: `Upgrade to business`,
        price: Math.round(Math.random() * 30)
      },
      {
        title: `Select meal`,
        price: Math.round(Math.random() * 30)
      }
    ];

    return options;
  }

  return tripPoints;

};
