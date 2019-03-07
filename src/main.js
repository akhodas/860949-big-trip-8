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
  {
    id: `testing`
  }
];
const configurationTripPoints = (count) => {
  const listTripPoints = [];
  for (let i = 0; i < count; i++) {
    listTripPoints.push(new ConfigTripPoint());
  }
  return listTripPoints;
};

const drawFilters = (configFilters) => {
  const createFiltersList = (config = []) => config.map(createFilter).join(``);

  drawField(`trip-filter`, createFiltersList(configFilters));
};

const drawTripPoints = (configTripPoints) => {
  const createTripPointsList = (config) => config.map(
      (current) => new TripPoint(current).prepareForDrow()).join(``);
  const simplefilter = (conf) => {
    const sort = [1, 2, 3, 4, 5];
    const configTripPointsModified = [];

    if (conf.length) {
      let tempArr = [];
      let tempDate;

      for (let j = 0; j < sort.length; j++) {
        for (let i = 0; i < conf.length; i++) {
          const elementI = conf[i];
          if (elementI.date.day === sort[j]) {
            tempArr.push(elementI.options);
            tempDate = elementI.date;
          }
        }
        if (tempArr.length) {
          configTripPointsModified.push(
              {
                date: tempDate,
                eventsDate: tempArr
              }
          );
          tempArr = [];
        }
      }
    }

    return configTripPointsModified;
  };

  // drawField(`trip-points`, createTripPointsList(simplefilter(configTripPoints)));
  drawField(`trip-points`, createTripPointsList(configTripPoints));
};

const drawSorting = (configSorting) => {
  const createSortingList = (config = []) => config.map(createSorting).join(``);

  drawField(`trip-sorting`, createSortingList(configSorting));
};

drawFilters(configurationFilters);
drawTripPoints(configurationTripPoints(4));
drawSorting(configurationSorting);


const elementsFilter = document.getElementsByClassName(`trip-filter`);

for (let i = 0; i < elementsFilter.length; i++) {
  elementsFilter[i].addEventListener(`click`, () => {
    drawTripPoints(configurationTripPoints(Math.round(Math.random() * 15)));
  });
}
