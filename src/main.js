import createFilter from './create-filter';
import createSorting from './create-sorting';
import TripPoint from './trip-point';
import TripPointEdit from './trip-point-edit';
import drawField from './draw-field';

import ConfigTripPoint from './config-trip-point';

const configurationSorting = [
  {
    id: `event`,
    input: true,
    checked: true
  },
  {
    id: `time`,
    input: true
  },
  {
    id: `price`,
    input: true
  },
  {
    id: `offers`
  }
];
const configurationFilters = [
  {
    id: `everything`,
    checked: true
  },
  {
    id: `future`
  },
  {
    id: `past`
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

const drawFilters = (configFilters) => {
  const createFiltersList = (config = []) => config.map(createFilter).join(``);

  drawField(`trip-filter`, createFiltersList(configFilters));
};

let tripPointComponentsList = [];
let tripPointEditComponentsList = [];

const drawTripPoints = (configTripPoints) => {
  const tripPointContainer = document.getElementsByClassName(`trip-points`)[0];

  if (tripPointContainer) {
    configTripPoints.forEach((element) => {
      const tripPointComponent = new TripPoint(element);
      tripPointComponentsList.push(tripPointComponent);
      const tripPointEditComponent = new TripPointEdit(element);
      tripPointEditComponentsList.push(tripPointEditComponent);

      tripPointContainer.appendChild(tripPointComponent.render());

      tripPointComponent.onEdit = () => {
        tripPointEditComponent.render();
        tripPointContainer.replaceChild(tripPointEditComponent.element, tripPointComponent.element);
        tripPointComponent.unrender();
      };
      tripPointEditComponent.onSave = () => {
        tripPointComponent.render();
        tripPointContainer.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
        tripPointEditComponent.unrender();
      };
      tripPointEditComponent.onDelete = () => {
        tripPointComponent.render();
        tripPointContainer.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
        tripPointEditComponent.unrender();
      };
    });
  }
};

const undrawOldTripPoint = () => {
  checkTripPointListOnRender(tripPointComponentsList);
  tripPointComponentsList = [];
  checkTripPointListOnRender(tripPointEditComponentsList);
  tripPointEditComponentsList = [];
};

const checkTripPointListOnRender = (arr = []) => {
  const tripPointContainer = document.getElementsByClassName(`trip-points`)[0];
  arr.forEach((tripPoint) => {
    if (tripPoint.element) {
      tripPointContainer.removeChild(tripPoint.element);
      tripPoint.unrender();
    }
  });
};

const drawSorting = (configSorting) => {
  const createSortingList = (config = []) => config.map(createSorting).join(``);

  drawField(`trip-sorting`, createSortingList(configSorting));
};

drawFilters(configurationFilters);
drawTripPoints(configurationTripPoints(4));
drawSorting(configurationSorting);


const elementsFilter = document.getElementsByClassName(`trip-filter__item`);

for (let i = 0; i < elementsFilter.length; i++) {
  elementsFilter[i].addEventListener(`click`, () => {
    undrawOldTripPoint();
    drawTripPoints(configurationTripPoints(Math.floor(Math.random() * 4) + 1));
  });
}
