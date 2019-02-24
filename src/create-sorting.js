export default (config) => {
  let result = ``;

  if (config.input) {
    result = `
        <input type="radio" name="trip-sorting" 
            id="sorting-${config.id}" 
            value="${config.id}" 
            ${config.checked ? `checked` : ``}
        >
        <label class="trip-sorting__item trip-sorting__item--${config.id}" 
            for="sorting-${config.id}">
            ${config.id}
        </label>
      `;
  } else {
    result = `
          <span class="trip-sorting__item trip-sorting__item--${config.id}">
            ${config.id}
          </span> 
      `;
  }

  return result;
};
