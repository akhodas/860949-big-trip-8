import createFilter from './create-filter';
import createSorting from './create-sorting';
import TripPoint from './trip-point';
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
// let editTripPointComponentsList = [];

const drawTripPoints = (configTripPoints) => {
  const tripPointContainer = document.getElementsByClassName(`trip-points`)[0];

  if (tripPointContainer) {
    configTripPoints.forEach((element) => {
      const tripPointComponent = new TripPoint(element);
      tripPointComponentsList.push(tripPointComponent);
      // const editTaskComponent = new TaskEdit(element);
      // editTaskComponentsList.push(editTaskComponent);

      tripPointContainer.appendChild(tripPointComponent.render());

      // taskComponent.onEdit = () => {
      //   editTaskComponent.render();
      //   taskContainer.replaceChild(editTaskComponent.element, taskComponent.element);
      //   taskComponent.unrender();
      // };
      // editTaskComponent.onSubmit = () => {
      //   taskComponent.render();
      //   taskContainer.replaceChild(taskComponent.element, editTaskComponent.element);
      //   editTaskComponent.unrender();
      // };
    });
  }

  // const createTripPointsList = (config) => config.map(
  //     (current) => new TripPoint(current).template).join(``);
  // const sortConfigTripPointsByDate = (a, b) => {
  //   return a.date - b.date;
  // };

  // drawField(
  //     `trip-points`,
  //     createTripPointsList(configTripPoints.sort(sortConfigTripPointsByDate)));
};

const undrawOldTripPoint = () => {
  checkTripPointListOnRender(tripPointComponentsList);
  tripPointComponentsList = [];
  // checkListOnRender(editTaskComponentsList);
  // editTaskComponentsList = [];
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
