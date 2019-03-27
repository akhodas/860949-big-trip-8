const createElement = (template, style) => {
  const newElement = document.createElement(`div`);

  if (style) {
    newElement.setAttribute(`style`, style);
  }

  newElement.innerHTML = template;
  return newElement;
};

export default createElement;
