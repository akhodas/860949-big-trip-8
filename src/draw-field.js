const drawField = (className, textHTML) => {

  const boardTasks = document.getElementsByClassName(className)[0];

  if (boardTasks) {
    boardTasks.innerHTML = textHTML;
  }

};

export default drawField;
