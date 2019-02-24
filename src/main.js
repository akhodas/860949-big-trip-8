import createFilter from './create-filter';
import createTripPoint from './create-trip-point';

// eslint-disable-next-line no-console
console.log(`hello people`);
createTripPoint(`HI`);


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
drawFilters();

