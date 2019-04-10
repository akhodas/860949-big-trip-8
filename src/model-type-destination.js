export default class ModelTypeDestination {

  constructor(data) {
    this.description = data[`description`] || ``;
    this.name = data[`name`] || ``;
    this.pictures = data[`pictures`] || [{
      description: ``,
      src: ``,
    }];
  }

  static parseTypeDestination(data) {
    return new ModelTypeDestination(data);
  }

  static parseTypesDestinations(data) {
    return data.map(ModelTypeDestination.parseTypeDestination);
  }

}

