export default class ConfigTripPoint {
  constructor() {
    this.date = Date.now()
    + Math.floor(Math.random() * 24 * 60) * 60 * 1000
    + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000;
    this.duration = Math.floor((Math.random() + 0.1) * 2 * 60) * 60 * 1000;
    this.city = [`Minsk`, `Moscow`, `London`, `Berlin`, `Rome`][Math.round(Math.random() * 4)];
    this.type = [
      `Taxi`,
      `Bus`,
      `Train`,
      `Ship`,
      `Transport`,
      `Drive`,
      `Flight`,
      `Check-in`,
      `Sightseeing`,
      `Restaurant`][Math.round(Math.random() * 9)];
    this.icon = baseIcon[this.type];
    this.price = Math.round(Math.random() * 10) * 10;
    this.offers = this._createOffers();
    this.picture = `http://picsum.photos/300/150?r=${Math.random()}`;
    this.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Cras aliquet varius magna, non porta ligula feugiat eget. 
      Fusce tristique felis at fermentum pharetra. 
      Aliquam id orci ut lectus varius viverra. 
      Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. 
      Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. 
      Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. 
      Sed sed nisi sed augue convallis suscipit in sed felis. 
      Aliquam erat volutpat. 
      Nunc fermentum tortor ac porta dapibus. 
      In rutrum ac purus sit amet tempus.`.split(`.`).
      splice(
          Math.round(Math.random() * 10),
          Math.round(Math.random() * 2 + 1)
      ).join(`. `);
  }

  _createOffers() {
    let countTag = 0;
    let listOffers = [];
    [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`].forEach((item) => {
      if ((Math.random() - 0.7) > 0 && countTag < 2) {
        listOffers.push(
            {
              title: item,
              price: Math.round(Math.random() * 30),
            });
        countTag++;
      }
    });
    return listOffers;
  }

}

const baseIcon = {
  'Taxi': `🚕`,
  'Bus': `🚌`,
  'Train': `🚂`,
  'Ship': `🛳️`,
  'Transport': `🚊`,
  'Drive': `🚗`,
  'Flight': `✈️`,
  'Check-in': `🏨`,
  'Sightseeing': `🏛️`,
  'Restaurant': `🍴`,
};
