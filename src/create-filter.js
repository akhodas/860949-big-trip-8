export default (config) => {
  return `
    <input type="radio" id="filter-${config.id}" name="filter" value="${config.id}" 
      ${config.checked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${config.id}">${config.id}</label>
  `;
};
