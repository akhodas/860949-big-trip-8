import createFilter from './create-filter';
import createTripPoint from './create-trip-point';

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
    const tripPoints = createTripPointsList(configTripPoints);

    feildTripPoints.innerHTML = tripPoints;
  }

  function createTripPointsList(config = []) {
    return config.map(createTripPoint).join(``);
  }
}

function generateConfigTripPoints(count = 0) {
  const tripPoints = [];

  for (let i = 0; i < count; i++) {
    const tripPoint = {};

    tripPoint.id = i + 1;

    tripPoints.push(tripPoint);
  }

  return tripPoints;
}

drawFilters();
drawTripPoints(generateConfigTripPoints(4));

const elementsFilter = document.getElementsByClassName(`trip-filter`);

for (let i = 0; i < elementsFilter.length; i++) {
  elementsFilter[i].addEventListener(`click`, () => {
    drawTripPoints(generateConfigTripPoints(Math.round(Math.random() * 5)));
  });
}
