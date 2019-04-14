export default class ModelTypeOffer {

  constructor(data) {
    this.type = data[`type`] || ``;
    this.offers = (data[`offers`]).map((item) => ({
      title: item.name,
      price: item.price,
      isSelect: false,
    })) || [{
      price: 0,
      title: ``,
    }];
  }


  static parseOffer(data) {
    return new ModelTypeOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelTypeOffer.parseOffer);
  }

  static toRawForToSend(obj) {
    return {
      'type': obj.type,
      'offers': obj.offers.map((offer) => ({
        title: offer.title,
        price: offer.price,
      })),
    };
  }

}

