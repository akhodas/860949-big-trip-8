import {Icons} from './icons';

export default class ModelTripPoint {

  constructor(data) {
    this.id = data[`id`];
    this.dateStart = data[`date_from`] || 0;
    this.dateFinish = data[`date_to`] || 0;
    this.typeParameters = this._createTypeParameters(data[`type`]) || ``;
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.price = data[`base_price`] || 0;
    this.offers = data[`offers`].map((item) => ({
      title: item.title,
      price: item.price,
      isSelect: item.accepted,
    })) || [{
      isSelect: false,
      price: 0,
      title: ``,
    }];
    this.destination = data[`destination`] || {
      description: ``,
      name: ``,
      pictures: [{
        description: ``,
        src: ``,
      }],
    };
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
