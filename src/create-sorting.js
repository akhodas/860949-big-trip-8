export default (config) => {
  return config.input ? `
      <input type="radio" name="trip-sorting" 
        id="sorting-${config.id}" 
        value="${config.id}" 
        ${config.checked ? `checked` : ``}
      >
      <label class="trip-sorting__item trip-sorting__item--${config.id}" 
        for="sorting-${config.id}">
        ${config.id}
      </label>
    ` : `
      <span class="trip-sorting__item trip-sorting__item--${config.id}">
        ${config.id}
      </span>
    `;
};
