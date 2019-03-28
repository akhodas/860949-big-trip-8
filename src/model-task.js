import {Icons} from './icons';

export default class ModelTask {
  // constructor(data) {
  //   this.id = data[`id`];
  //   this.title = data[`title`] || ``;
  //   this.dueDate = data[`due_date`];
  //   this.tags = new Set(data[`tags`] || []);
  //   this.picture = data[`picture`] || ``;
  //   this.repeatingDays = objectToMap(data[`repeating_days`]);
  //   this.color = data[`color`];
  //   this.isFavorite = Boolean(data[`is_favorite`]);
  //   this.isDone = Boolean(data[`is_done`]);
  // }

  constructor(data) {
    this.id = data[`id`];
    this.dateStart = data[`date_from`] || 0;
    this.dateFinish = data[`date_to`] || 0;
    this.typeParameters = this._createTypeParameters(data[`type`]) || ``;
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.price = data[`base_price`] || 0;
    this.offers = this._createOffers(data[`offers`]) || [];
    this.city = data[`destination`].name || ``;
    this.picture = data[`destination`].pictures || [];
    this.description = data[`destination`].description || ``;
  }

  _createTypeParameters(type) {
    const typeRandom = type;
    return {
      type: typeRandom,
      title: `${typeRandom.slice(0, 1).toUpperCase() + typeRandom.slice(1)} to `,
      icon: Icons[typeRandom],
    };
  }

  _createOffers(arr) {
    let countTag = 0;
    let listOffers = [];
    arr.forEach((item) => {
      listOffers.push(
            {
              title: item.title,
              price: item.price,
              isSelect: item.accepted,
            });
    });
    return listOffers;
  }

  static toRawForToSend(obj) {
    return {
      'id': obj.id,
      'title': obj.title,
      'due_date': obj.dueDate,
      'tags': [...obj.tags.values()],
      'picture': obj.picture,
      'repeating_days': mapToObject(obj.repeatingDays),
      'color': obj.color,
      'is_favorite': obj.isFavorite,
      'is_done': obj.isDone,
    };
  }

  static parseTask(data) {
    return new ModelTask(data);
  }

  static parseTasks(data) {
    return data.map(ModelTask.parseTask);
  }

}

const objectToMap = (obj) => {
  const map = new Map();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      map.set(key, obj[key]);
    }
  }
  return map;
};

const mapToObject = (map) => {
  const obj = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};


