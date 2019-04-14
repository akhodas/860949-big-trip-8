export default class Store {

  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }


  setItem({key, item}) {
    const items = this._getAll();
    items[key] = item;

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({key}) {
    const items = this._getAll();
    return items[key];
  }

  removeItem({key}) {
    const items = this._getAll();
    delete items[key];

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getAllItems() {
    const object = this._getAll();
    return Object.keys(object).map((id) => object[id]);
  }

  removeSectionItems(type) {
    const items = this._getAll();

    for (const key in items) {
      if (items.hasOwnProperty(key) && this._getNeededData(type, items[key])) {
        delete items[key];

      }
    }

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  _getNeededData(type, element) {
    switch (type) {
      case `points`:
        return element.id;

      case `destinations`:
        return element.name;

      case `offers`:
        return element.type && !element.id;

      default :
        return false;
    }
  }

  _getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      return emptyItems;
    }
  }

}
