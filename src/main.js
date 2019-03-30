import TripPoint from './trip-point';
import TripPointEdit from './trip-point-edit';
import Filter from './filter';
import TypeSorting from './type-sorting';
import Statistic from './statistic';
import API from './api';
import ModelTripPoint from './model-trip-point';
import {TypesOffer} from './const-from-server';
import {TypesDestination} from './const-from-server';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
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

const renderCostTripTotal = (listTripPoint) => {
  costTripTotal = listTripPoint.reduce((sum, element) => (sum + +element.price), 0);
  document.querySelector(`.trip__total-cost`).innerHTML = `&euro;&nbsp; ${costTripTotal}`;
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

const renderFilters = (configFilters) => {
  const filterContainer = document.querySelectorAll(`.trip-filter`)[0];

  if (filterContainer) {
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
  }
};

const renderTypesSorting = (configTypesSorting) => {
  const typeSortingContainer = document.querySelectorAll(`.trip-sorting`)[0];

  if (typeSortingContainer) {
    configTypesSorting.forEach((configTypeSorting) => {
      const typeSortingComponent = new TypeSorting(configTypeSorting);
      typeSortingConponentsList.push(typeSortingComponent);

      typeSortingContainer.appendChild(typeSortingComponent.render(`display: inline-block;`));

      typeSortingComponent.onSorting = (evt) => {
        let typeSortingName = evt.target.htmlFor;
        let tepmVar = `КОГДА ВЫДАДУТ ЗАДАНИЕ, ПРОСТО ВПИСАТЬ СЮДА НУЖНУЮ ФУНКЦИЮ`;
        tepmVar = typeSortingName;
        typeSortingName = tepmVar;
      };

    });
  }
};

const renderStatistic = () => {
  const statisticContainer = document.querySelectorAll(`.statistic`)[0];
  const statisticComponent = new Statistic(tripPointComponentsList);

  statisticContainer.appendChild(statisticComponent.render());
};

const renderTripPoints = (componentsList, configTripPoints) => {
  const tripPointContainer = document.querySelectorAll(`.trip-points`)[0];

  if (tripPointContainer) {
    if (configTripPoints) {
      configTripPoints.forEach((element) => {
        const tripPointComponent = new TripPoint(element);
        tripPointComponentsList.push(tripPointComponent);
        const tripPointEditComponent = new TripPointEdit(element);
        tripPointEditComponentsList.push(tripPointEditComponent);

        tripPointComponent.onEdit = () => {
          tripPointEditComponent.render();
          tripPointContainer.replaceChild(tripPointEditComponent.element, tripPointComponent.element);
          tripPointComponent.unrender();
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

          api.updateTripPoint({
            id: newElement.id, data: ModelTripPoint.toRawForToSend(newElement)
          }, thisElement)
          .then((newTripPoint) => {
            tripPointComponent.update(newTripPoint);
            tripPointComponent.render();
            tripPointContainer.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
            tripPointEditComponent.unrender();
            renderCostTripTotal(componentsList);
          });

        };

        tripPointEditComponent.onDelete = (id, thisElement) => {
          api.deleteTripPoint({id}, thisElement)
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
        };

        tripPointEditComponent.onExit = () => {
          tripPointComponent.render();
          tripPointContainer.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
          tripPointEditComponent.unrender();
        };
      });
    }

    componentsList.forEach((element) => {
      if (!element.isDeleted) {
        tripPointContainer.appendChild(element.render());
      }
    });

    renderCostTripTotal(componentsList);
    console.log(tripPointComponentsList);
    console.log(costTripTotal);

  }
};

const unrenderOldTripPoint = () => {
  checkTripPointListOnRender(tripPointComponentsList);
  checkTripPointListOnRender(tripPointEditComponentsList);
};

const checkTripPointListOnRender = (arr = []) => {
  const tripPointContainer = document.querySelectorAll(`.trip-points`)[0];
  arr.forEach((tripPoint) => {
    if (tripPoint.element) {
      tripPointContainer.removeChild(tripPoint.element);
      tripPoint.unrender();
    }
  });
};

const clearArray = (arr = []) => {
  while (arr.length) {
    arr.pop();
  }
};

renderFilters(configurationFilters);
renderTypesSorting(configurationTypesSorting);

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

renderStatistic();
