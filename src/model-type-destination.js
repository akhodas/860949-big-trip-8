export default class ModelTypeDestination {

  constructor(data) {
    this.destination = data || {
      description: ``,
      name: ``,
      pictures: [{
        description: ``,
        src: ``,
      }],
    };
  }

  static parseDestination(data) {
    return new ModelTypeDestination(data);
  }

  static parseTypesDestinations(data) {
    return data.map(ModelTypeDestination.parseTypeDestination);
  }

}

