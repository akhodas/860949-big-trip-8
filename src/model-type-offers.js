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

  // _createOffers(arr) {
  //   return arr.map((item) => ({
  //     title: item.title,
  //     price: item.price,
  //     isSelect: item.accepted,
  //   }));
  // }

  static parseOffer(data) {
    return new ModelTypeOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelTypeOffer.parseOffer);
  }

}

