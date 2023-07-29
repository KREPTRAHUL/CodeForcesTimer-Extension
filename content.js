const maxTime = 300;
let intervalId;

const getId = () => {
  const currentURL = window.location.toString();
  const len = currentURL.length;
  let ct = 0,
    id = "";
  for (let i = len - 1; i >= 0; i--) {
    if (currentURL.charAt(i) == "/") {
      if (ct == 1) break;
      ct++;
    }
    id += currentURL.charAt(i);
  }
  console.log(id);
  id = id.split("").reverse().join("");
  return id;
};

const startTimer = () => {
  const currentTime = new Date();
  const startTime = currentTime.getTime();

  const id = getId();
  localStorage.setItem(id, startTime);

  timeLeft = maxTime;
  let intervalId = setInterval(function () {
    timeLeft--;
  });
  const val = localStorage.getItem(id);
  console.log(val);
};

const resetTimer = () => {
  const id = getId();
  localStorage.removeItem(id);
  //add the timer
};

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
  start.addEventListener("click", startTimer);

  const reset = document.createElement("button");
  reset.textContent = "Reset";
  reset.id = "reset";
  reset.addEventListener("click", resetTimer);

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
