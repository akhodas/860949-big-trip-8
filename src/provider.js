import ModelTripPoint from './model-trip-point';
import ModelTypeDestination from './model-type-destination';
import ModelTypeOffer from './model-type-offers';

export default class Provider {

  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }


  updateTripPoint({id, data}, element) {
    if (this._isOnline()) {
      return this._api.updateTripPoint({id, data}, element)
      .then((tripPoint) => {
        this._store.setItem({
          key: tripPoint.id,
          item: ModelTripPoint.toRawForToSend(tripPoint),
        });
        return tripPoint;
      });
    } else {
      this._needSync = true;
      this._store.setItem({key: data.id, item: data});
      return Promise.resolve(ModelTripPoint.parseTripPoint(data));
    }
  }

  createTripPoint({data}) {
    if (this._isOnline()) {
      return this._api.createTripPoint({data})
      .then((tripPoint) => {
        this._store.setItem({
          key: tripPoint.id,
          item: ModelTripPoint.toRawForToSend(tripPoint),
        });
        return tripPoint;
      });
    } else {
      data.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: data.id, item: data});
      return Promise.resolve(ModelTripPoint.parseTripPoint(data));
    }
  }

  deleteTripPoint({id}, element) {
    if (this._isOnline()) {
      return this._api.deleteTripPoint({id}, element)
      .then(() => {
        this._store.removeItem({key: id});
      });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getData(additionalUrl) {
    if (this._isOnline()) {
      return this._api.getData(additionalUrl)
      .then((data) => {
        this._changeModelParse(additionalUrl, data);
        return data;
      });
    } else {
      const rawDataMap = this._store.getAll();
      const rawData = this._convertObjectToArray(rawDataMap);

      const data = this._getNeededData(additionalUrl, rawData);

      return Promise.resolve(data);
    }
  }

  syncTripPoints() {
    if (this._needSync) {
      this._needSync = false;
      this._api.syncTripPoints({
        tripPoints: this._getNeededData(
            `points`,
            this._convertObjectToArray(this._store.getAll())
        ).map((it) => ModelTripPoint.toRawForToSend(it))
      });
    }
  }


  _changeModelParse(additionalUrl, data) {
    switch (additionalUrl) {
      case `points`:
        data.map((it) => this._store.setItem({
          key: it.id,
          item: ModelTripPoint.toRawForToSend(it),
        }));
        break;

      case `destinations`:
        data.map((it) => this._store.setItem({
          key: it.name,
          item: ModelTypeDestination.toRawForToSend(it),
        }));
        break;

      case `offers`:
        data.map((it) => this._store.setItem({
          key: it.type,
          item: ModelTypeOffer.toRawForToSend(it),
        }));
        break;

      default :
        data.map((it) => this._store.setItem({
          key: it.id,
          item: ModelTripPoint.toRawForToSend(it),
        }));
        break;
    }
  }

  _getNeededData(additionalUrl, data) {
    let neededData = [];
    switch (additionalUrl) {
      case `points`:
        neededData = data.filter((item) => {
          return item.id;
        });
        return ModelTripPoint.parseTripPoints(neededData);

      case `destinations`:
        neededData = data.filter((item) => {
          return item.name;
        });
        return ModelTypeDestination.parseTypeDestinations(neededData);

      case `offers`:
        neededData = data.filter((item) => {
          return item.type;
        });
        return ModelTypeOffer.parseOffers(neededData);

      default :
        return neededData;
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  _convertObjectToArray(object) {
    const newArray = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        newArray.push(object[key]);
      }
    }
    return newArray;
  }

}
