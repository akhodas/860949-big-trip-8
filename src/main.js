import Day from './day';
import TripPoint from './trip-point';
import TripPointEdit from './trip-point-edit';
import Filter from './filter';
import TypeSorting from './type-sorting';
import Statistic from './statistic';
import API from './api';
import ModelTripPoint from './model-trip-point';
import {TypesOffer} from './const-from-server';
import {TypesDestination} from './const-from-server';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=123458`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});


const configurationTypesSorting = [
  {
    title: `event`,
    tagInput: true,
    checked: true
  },
  {
    title: `time`,
    tagInput: true
  },
  {
    title: `price`,
    tagInput: true
  },
  {
    title: `offers`
  }
];
const configurationFilters = [
  {
    title: `everything`,
    checked: true
  },
  {
    title: `future`
  },
  {
    title: `past`
  },
];


let tripPointComponentsList = [];
let tripPointEditComponentsList = [];
const filterConponentsList = [];
const typeSortingConponentsList = [];

let costTripTotal = 0;

let typeSorting = (tripPointComponent1, tripPointComponent2) => {
  return tripPointComponent1.dateStart - tripPointComponent2.dateStart;
};


const filterTripPoints = (tripPoints, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return tripPoints;

    case `filter-future`:
      return tripPoints.filter((it) => it.date > Date.now());

    case `filter-past`:
      return tripPoints.filter((it) => it.date < Date.now());

    default :
      return [];
  }
};

const selectTypesSorting = (type) => {
  switch (type) {
    case `event`:
      return (tripPointComponent1, tripPointComponent2) => {
        return tripPointComponent1.dateStart - tripPointComponent2.dateStart;
      };

    case `time`:
      return (tripPointComponent1, tripPointComponent2) => {
        return tripPointComponent1.duration - tripPointComponent2.duration;
      };

    case `price`:
      return (tripPointComponent1, tripPointComponent2) => {
        return tripPointComponent1.totalPriceTripPoint - tripPointComponent2.totalPriceTripPoint;
      };

    default :
      return (tripPointComponent1, tripPointComponent2) => {
        return tripPointComponent1.dateStart - tripPointComponent2.dateStart;
      };
  }
};


const renderFilters = (configFilters) => {
  const containerForFilterContainer = document.querySelector(`.trip-controls__menus`);

  const filterContainer = document.createElement(`form`);
  filterContainer.classList.add(`trip-filter`);

  if (containerForFilterContainer) {
    configFilters.forEach((configFilter) => {
      const filterComponent = new Filter(configFilter);
      filterConponentsList.push(filterComponent);

      filterContainer.appendChild(filterComponent.render(`display: inline-block;`));

      filterComponent.onFilter = (evt) => {
        unrenderOldTripPoint();
        const filterName = evt.target.htmlFor;

        const filteredTripPoints = filterTripPoints(tripPointComponentsList, filterName);
        renderTripPoints(filteredTripPoints);
      };

    });

    containerForFilterContainer.appendChild(filterContainer);
  }
};

const renderTypesSorting = (configTypesSorting) => {
  const containerForTypeSortingContainer = document.querySelector(`.main`);

  const typeSortingContainer = document.createElement(`form`);
  typeSortingContainer.classList.add(`trip-sorting`);

  if (containerForTypeSortingContainer) {
    configTypesSorting.forEach((configTypeSorting) => {
      const typeSortingComponent = new TypeSorting(configTypeSorting);
      typeSortingConponentsList.push(typeSortingComponent);

      typeSortingContainer.appendChild(typeSortingComponent.render(`display: inline-block;`));

      typeSortingComponent.onSorting = (evt) => {
        let typeSortingName = evt.target.htmlFor.split(`-`)[1];

        typeSorting = selectTypesSorting(typeSortingName);

        unrenderOldTripPoint();
        renderTripPoints(tripPointComponentsList);
      };

    });

    containerForTypeSortingContainer.insertBefore(
        typeSortingContainer,
        containerForTypeSortingContainer.firstChild);
  }
};

const renderTripPoints = (componentsList, configTripPoints) => {
  const containerForTripPointsConteiner = document.querySelector(`.main`);

  let tripPointsContainer = document.createElement(`section`);
  tripPointsContainer.classList.add(`trip-points`);

  let tripPointContainer = null;

  if (containerForTripPointsConteiner) {
    if (configTripPoints) {
      configTripPoints.forEach((element) => {
        const tripPointComponent = new TripPoint(element);
        tripPointComponentsList.push(tripPointComponent);
        const tripPointEditComponent = new TripPointEdit(element);
        tripPointEditComponentsList.push(tripPointEditComponent);

        tripPointComponent.onEdit = () => {
          tripPointEditComponent.render();
          tripPointComponent.containerElement
            .replaceChild(tripPointEditComponent.element, tripPointComponent.element);
          tripPointComponent.unrender();
        };

        tripPointComponent.onAddOffer = (newObject, thisElement) => {
          const newElement = {};
          newElement.id = newObject.id;
          newElement.dateStart = newObject.dateStart;
          newElement.dateFinish = newObject.dateFinish;
          newElement.destination = newObject.destination;
          newElement.typeParameters = newObject.typeParameters;
          newElement.price = newObject.price;
          newElement.isFavorite = newObject.isFavorite;
          newElement.offers = newObject.offers;
          newElement.flagNewPoint = newObject.flagNewPoint;

          api.updateTripPoint({
            id: newElement.id, data: ModelTripPoint.toRawForToSend(newElement)
          }, thisElement)
          .then((newTripPoint) => {

            tripPointEditComponent.update(newTripPoint);
            tripPointEditComponent.render();
            tripPointComponent.containerElement
              .replaceChild(tripPointEditComponent.element, tripPointComponent.element);
            tripPointComponent.unrender();

            tripPointComponent.update(newTripPoint);
            tripPointComponent.render();
            tripPointComponent.containerElement
              .replaceChild(tripPointComponent.element, tripPointEditComponent.element);
            tripPointEditComponent.unrender();

            renderCostTripTotal(tripPointComponentsList);
          });

        };

        tripPointEditComponent.onSave = (newObject, thisElement) => {
          const newElement = {};
          newElement.id = newObject.id;
          newElement.dateStart = newObject.dateStart;
          newElement.dateFinish = newObject.dateFinish;
          newElement.destination = newObject.destination;
          newElement.typeParameters = newObject.typeParameters;
          newElement.price = newObject.price;
          newElement.isFavorite = newObject.isFavorite;
          newElement.offers = newObject.offers;
          newElement.flagNewPoint = newObject.flagNewPoint;

          if (newElement.flagNewPoint) {
            api.createTripPoint({
              data: ModelTripPoint.toRawForToSend(newElement)
            })
            .then(() => {
              unrenderOldTripPoint();
              clearArray(tripPointComponentsList);
              clearArray(tripPointEditComponentsList);
              return api.getData(`points`);
            })
            .then((tripPoints) => {
              renderCostTripTotal(componentsList);
              return renderTripPoints(tripPointComponentsList, tripPoints);
            })
            .catch(alert);
          } else {
            api.updateTripPoint({
              id: newElement.id, data: ModelTripPoint.toRawForToSend(newElement)
            }, thisElement)
            .then(() => {
              unrenderOldTripPoint();
              clearArray(tripPointComponentsList);
              clearArray(tripPointEditComponentsList);
              return api.getData(`points`);
            })
            .then((tripPoints) => {
              renderCostTripTotal(componentsList);
              return renderTripPoints(tripPointComponentsList, tripPoints);
            })
            .catch(alert);
          }

        };

        if (element.flagNewPoint) {
          tripPointEditComponent.onDelete = () => {
            tripPointComponent.containerElement
              .remove(tripPointEditComponent.element);
            tripPointEditComponent.unrender();
            tripPointComponent.delete();
          };

          tripPointEditComponent.onExit = () => {
            tripPointComponent.containerElement
              .remove(tripPointEditComponent.element);
            tripPointEditComponent.unrender();
            tripPointComponent.delete();
          };
        } else {
          tripPointEditComponent.onDelete = (id, thisElement) => {
            api.deleteTripPoint({id}, thisElement)
            .then(() => {
              unrenderOldTripPoint();
              clearArray(tripPointComponentsList);
              clearArray(tripPointEditComponentsList);
              return api.getData(`points`);
            })
            .then((tripPoints) => {
              renderCostTripTotal(tripPointComponentsList);
              renderTripPoints(tripPointComponentsList, tripPoints);
            })
            .catch(alert);
          };

          tripPointEditComponent.onExit = () => {
            tripPointComponent.render();
            tripPointComponent.containerElement
              .replaceChild(tripPointComponent.element, tripPointEditComponent.element);
            tripPointEditComponent.unrender();
          };
        }
      });
    }

    let previousElement = null;
    let dayContainer = null;

    if (!configTripPoints || !configTripPoints[0].flagNewPoint) {
      componentsList.sort(typeSorting).forEach((element) => {
        if (!element.isDeleted) {

          if (previousElement &&
              (new Date(previousElement.dateStart).toDateString() ===
              new Date(element.dateStart).toDateString())) {
            element.flagFirstInDay = false;
          }

          if (!previousElement || element.flagFirstInDay) {
            tripPointsContainer.appendChild(new Day(element.dateStart).render());
            dayContainer = tripPointsContainer.querySelectorAll(`.trip-day__items`);
            tripPointContainer = dayContainer[dayContainer.length - 1];
          }

          element.containerElement = tripPointContainer;
          tripPointContainer.appendChild(element.render());
          previousElement = element;
        }
      });
    } else {
      tripPointsContainer = containerForTripPointsConteiner.querySelector(`.trip-points`);
      tripPointsContainer.insertBefore(
          tripPointEditComponentsList[tripPointEditComponentsList.length - 1].render(),
          tripPointsContainer.firstChild);
      tripPointComponentsList[tripPointComponentsList.length - 1]
        .containerElement = tripPointsContainer.firstChild;
    }

    containerForTripPointsConteiner.appendChild(tripPointsContainer);

    renderCostTripTotal(tripPointComponentsList);
  }
};

const renderStatistic = () => {
  const statisticContainer = document.querySelectorAll(`.statistic`)[0];
  const statisticComponent = new Statistic(tripPointComponentsList);

  statisticContainer.appendChild(statisticComponent.render());
};

const renderCostTripTotal = (listTripPoint) => {
  costTripTotal = listTripPoint
    .reduce((sum, element) => (sum + +element.totalPriceTripPoint), 0);
  document.querySelector(`.trip__total-cost`).innerHTML = `&euro;&nbsp; ${costTripTotal}`;
};


const unrenderOldTripPoint = () => {
  checkTripPointListOnRender(tripPointComponentsList);
  checkTripPointListOnRender(tripPointEditComponentsList);
  document.querySelector(`.main`)
    .removeChild(document.querySelector(`.trip-points`));
};

const checkTripPointListOnRender = (arr = []) => {
  arr.forEach((tripPoint) => {
    if (tripPoint.element) {
      tripPoint.unrender();
    }
  });
};

const clearArray = (arr = []) => {
  while (arr.length) {
    arr.pop();
  }
};


document.querySelector(`.trip-controls__new-event`)
  .addEventListener(`click`, () => {
    const newModelTripPoint = ModelTripPoint.parseTripPoint();
    renderTripPoints(tripPointComponentsList, [newModelTripPoint]);
  });


renderFilters(configurationFilters);
renderTypesSorting(configurationTypesSorting);
renderStatistic();

api.getData(`destinations`)
  .then((destinations) => {
    destinations.forEach((destination) => {
      TypesDestination.push(destination);
    });
  });

api.getData(`offers`)
  .then((offers) => {
    offers.forEach((offer) => {
      TypesOffer.push(offer);
    });
  });

api.getData(`points`)
  .then((tripPoints) => {
    renderTripPoints(tripPointComponentsList, tripPoints);
  });
