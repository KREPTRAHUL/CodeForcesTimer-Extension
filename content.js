const addContent = () => {
  const timer = document.createElement("div");
  timer.id = "timer";

  const timeElem = document.createElement("div");
  timeElem.textContent = "5:00";

  const mybuttons = document.createElement("div");
  mybuttons.id = "mybuttons";
  const start = document.createElement("button");
  start.textContent = "Start";
  start.id = "start";
  const reset = document.createElement("button");
  reset.textContent = "Reset";
  reset.id = "reset";

  mybuttons.appendChild(start);
  mybuttons.appendChild(reset);
  timer.appendChild(timeElem);
  timer.appendChild(mybuttons);

  const sideBar = document.querySelector("#sidebar");
  if (sideBar) {
    sideBar.prepend(timer);
  }
};

const insertTimer = () => {
  window.addEventListener("load", addContent);
};

insertTimer();
