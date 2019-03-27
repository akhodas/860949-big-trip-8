import TripPoint from './trip-point';
import TripPointEdit from './trip-point-edit';
import Filter from './filter';
import TypeSorting from './type-sorting';
import Statistic from './statistic';

import ConfigTripPoint from './config-trip-point';

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
const configurationTripPoints = (count) => {
  const sortConfigTripPointsByDate = (a, b) => {
    return a.date - b.date;
  };
  const listTripPoints = [];
  for (let i = 0; i < count; i++) {
    listTripPoints.push(new ConfigTripPoint());
  }
  return listTripPoints.sort(sortConfigTripPointsByDate);
};

let tripPointComponentsList = [];
let tripPointEditComponentsList = [];
const filterConponentsList = [];
const typeSortingConponentsList = [];

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
        tripPointEditComponent.onSave = (newObject) => {
          const newElement = {};
          newElement.date = newObject.date;
          newElement.duration = newObject.duration;
          newElement.city = newObject.city;
          newElement.typeParameters = newObject.typeParameters;
          newElement.price = newObject.price;
          newElement.offers = newObject.offers;

          tripPointComponent.update(newElement);
          tripPointComponent.render();
          tripPointContainer.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
          tripPointEditComponent.unrender();
        };
        tripPointEditComponent.onDelete = () => {
          tripPointComponent.delete();
          tripPointContainer.removeChild(tripPointEditComponent.element);
          tripPointEditComponent.unrender();
          tripPointEditComponent.delete();
        };
      });
    }

    componentsList.forEach((element) => {
      if (!element.isDeleted) {
        tripPointContainer.appendChild(element.render());
      }
    });
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

renderFilters(configurationFilters);
renderTypesSorting(configurationTypesSorting);
renderTripPoints(tripPointComponentsList, configurationTripPoints(10));
renderStatistic();
