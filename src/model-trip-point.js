import {Icons} from './icons';

export default class ModelTripPoint {

  constructor(data) {
    this.id = data ? data[`id`] : undefined;
    this.dateStart = data ? data[`date_from`] : Date.now();
    this.dateFinish = data ? data[`date_to`] : Date.now();
    this.typeParameters = data ? this._createTypeParameters(data[`type`]) : ``;
    this.isFavorite = data ? data[`is_favorite`] : false;
    this.price = data ? data[`base_price`] : 0;
    this.offers = data ? data[`offers`].map((item) => ({
      title: item.title,
      price: item.price,
      isSelect: item.accepted,
    })) : [{
      isSelect: false,
      price: 0,
      title: ``,
    }];
    this.destination = data ? data[`destination`] : {
      description: ``,
      name: ``,
      pictures: [{
        description: ``,
        src: ``,
      }],
    };
    this.flagNewPoint = data ? false : true;
  }

  _createTypeParameters(typeTripPoint) {
    return {
      type: typeTripPoint,
      title: `${typeTripPoint.slice(0, 1).toUpperCase() + typeTripPoint.slice(1)} in `,
      icon: Icons[typeTripPoint],
    };
  }

  static toRawForToSend(obj) {
    return {
      'id': obj.id,
      'date_from': obj.dateStart,
      'date_to': obj.dateFinish,
      'type': obj.typeParameters.type,
      'is_favorite': obj.isFavorite,
      'base_price': obj.price,
      'offers': obj.offers.map((offer) => ({
        title: offer.title,
        price: offer.price,
        accepted: offer.isSelect,
      })),
      'destination': obj.destination,
    };
  }

  static parseTripPoint(data) {
    return new ModelTripPoint(data);
  }

  static parseTripPoints(data) {
    return data.filter((item) => !!item).map(ModelTripPoint.parseTripPoint);
  }

}

