export default class ConfigTripPoint {
  constructor() {
    this.date = Date.now()
    + Math.floor(Math.random() * 24 * 60) * 60 * 1000
    + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000;
    this.duration = Math.floor((Math.random() + 0.1) * 2 * 60) * 60 * 1000;
    this.icon = [`🚕`, `✈️`, `🚗`, `🏨`][Math.round(Math.random() * 3)];
    this.title = `Taxi to point #${[Math.round(Math.random() * 100)]}`;
    this.price = Math.round(Math.random() * 10) * 10;
    this.offers = [
      {
        title: `Upgrade to business`,
        price: Math.round(Math.random() * 30)
      },
      {
        title: `Select meal`,
        price: Math.round(Math.random() * 30)
      }
    ];
  }

}
