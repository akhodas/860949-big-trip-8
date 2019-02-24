import createFilter from './create-filter';
import createSorting from './create-sorting';
import createTripPoint from './create-trip-point';
import generateConfigTripPoints from './generate-config-trip-points';

function drawFilters() {
  const configFilters = [
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

  const feildTripFilter = document.getElementsByClassName(`trip-filter`)[0];

  if (feildTripFilter) {
    const filters = createFiltersList(configFilters);

    feildTripFilter.innerHTML = filters;
  }

  function createFiltersList(config = []) {
    return config.map(createFilter).join(``);
  }
}

function drawTripPoints(configTripPoints) {
  const feildTripPoints = document.getElementsByClassName(`trip-points`)[0];

  if (feildTripPoints) {
    const tripPoints = createTripPointsList(simplefilter(configTripPoints));

    feildTripPoints.innerHTML = tripPoints;
  }

  function createTripPointsList(config = []) {
    return config.map(createTripPoint).join(``);
  }

  function simplefilter(conf) {
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
  }

}

function drawSorting() {
  const configSorting = [
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

  const feildTripSorting = document.getElementsByClassName(`trip-sorting`)[0];

  if (feildTripSorting) {
    const filters = createSortingList(configSorting);

    feildTripSorting.innerHTML = filters;
  }

  function createSortingList(config = []) {
    return config.map(createSorting).join(``);
  }
}

drawFilters();
drawTripPoints(generateConfigTripPoints(4));
drawSorting();


const elementsFilter = document.getElementsByClassName(`trip-filter`);

for (let i = 0; i < elementsFilter.length; i++) {
  elementsFilter[i].addEventListener(`click`, () => {
    drawTripPoints(generateConfigTripPoints(Math.round(Math.random() * 15)));
  });
}
