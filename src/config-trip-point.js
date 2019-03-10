const TAXI = `Taxi`;
const BUS = `Bus`;
const TRAIN = `Train`;
const SHIP = `Ship`;
const TRANSPORT = `Transport`;
const DRIVE = `Drive`;
const FLIGHT = `Flight`;
const CHECK_IN = `Check-in`;
const SIGHTSEEING = `Sightseeing`;
const RESTAURANT = `Restaurant`;

const BaseIcon = {
  [TAXI]: `🚕`,
  [BUS]: `🚌`,
  [TRAIN]: `🚂`,
  [SHIP]: `🛳️`,
  [TRANSPORT]: `🚊`,
  [DRIVE]: `🚗`,
  [FLIGHT]: `✈️`,
  [CHECK_IN]: `🏨`,
  [SIGHTSEEING]: `🏛️`,
  [RESTAURANT]: `🍴`,
};
const CitiesList = [`Minsk`, `Moscow`, `London`, `Berlin`, `Rome`];
const TypesList = [TAXI, BUS, TRAIN, SHIP, TRANSPORT, DRIVE, FLIGHT, CHECK_IN, SIGHTSEEING, RESTAURANT];
const DescriptionList = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Cras aliquet varius magna, non porta ligula feugiat eget. 
  Fusce tristique felis at fermentum pharetra. 
  Aliquam id orci ut lectus varius viverra. 
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. 
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. 
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. 
  Sed sed nisi sed augue convallis suscipit in sed felis. 
  Aliquam erat volutpat. 
  Nunc fermentum tortor ac porta dapibus. 
  In rutrum ac purus sit amet tempus.`;
const OffersList = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];


export default class ConfigTripPoint {
  constructor() {
    this.date = Date.now()
    + Math.floor(Math.random() * 24 * 60) * 60 * 1000
    + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000;
    this.duration = Math.floor((Math.random() + 0.1) * 2 * 60) * 60 * 1000;
    this.city = CitiesList[Math.round(Math.random() * 4)];
    this.typeParameters = this._createTypeParameters();
    this.price = Math.round(Math.random() * 10) * 10;
    this.offers = this._createOffers();
    this.picture = `http://picsum.photos/300/150?r=${Math.random()}`;
    this.description = DescriptionList.split(`.`).
      splice(
          Math.round(Math.random() * 10),
          Math.round(Math.random() * 2 + 1)
      ).join(`. `);
  }

  _createTypeParameters() {
    const typeRandom = TypesList[Math.floor(Math.random() * 10)];
    return {
      type: typeRandom,
      title: `${typeRandom} to `,
      icon: BaseIcon[typeRandom],
    };
  }

  _createOffers() {
    let countTag = 0;
    let listOffers = [];
    OffersList.forEach((item) => {
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
