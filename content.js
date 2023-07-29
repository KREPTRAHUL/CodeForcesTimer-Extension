const maxTime = 300;
let intervalId;

const getFormattedTime = (time) => {
  let min = Math.floor(time / 60);
  let sec = Math.floor(time % 60);
  if (min < 10) min = `0${min}`;
  if (sec < 10) sec = `0${sec}`;
  return `${min}:${sec}`;
};
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
  id = id.split("").reverse().join("");
  return id;
};

const updateTimerDisplay = (timeLeft) => {
  const timeElem = document.getElementById("timeElem");
  timeElem.textContent = getFormattedTime(timeLeft);
};

const startTimer = (time) => {
  const currentTime = new Date();
  const startTime = currentTime.getTime();
  const id = getId();

  if (intervalId) return;

  const idInLocalStorage = localStorage.getItem(id);
  if (!idInLocalStorage) {
    localStorage.setItem(id, startTime);
  }

  timeLeft = time;

  let countPreviousAccepted =
    document.querySelectorAll(".verdict-accepted").length;
  console.log(countPreviousAccepted);

  intervalId = setInterval(function () {
    const currentAccepted =
      document.querySelectorAll(".verdict-accepted").length;
    if (currentAccepted == countPreviousAccepted + 1) {
      const timeElem = document.getElementById("timeElem");
      timeElem.textContent = "Time Taken:";
      timeElem.textContent += getFormattedTime(time - timeLeft);
      localStorage.setItem(`TimeTaken_${id}`, time - timeLeft);
      clearInterval(intervalId);
      intervalId = undefined;
    } else {
      timeLeft--;
      if (timeLeft < 0) {
        const timeElem = document.getElementById("timeElem");
        timeElem.textContent = "Time Out";
        clearInterval(intervalId);
      } else {
        updateTimerDisplay(timeLeft);
      }
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(intervalId);
  intervalId = undefined;

  const id = getId();
  localStorage.removeItem(id);
  const timeElem = document.getElementById("timeElem");
  timeElem.textContent = getFormattedTime(maxTime);
  //add the timer
};

const addContent = () => {
  const timer = document.createElement("div");
  timer.id = "timer";

  const timeElem = document.createElement("div");
  timeElem.id = "timeElem";
  id = getId();
  const search = localStorage.getItem(id);
  if (search) timeElem.textContent = "";
  else timeElem.textContent = getFormattedTime(maxTime);

  const mybuttons = document.createElement("div");
  mybuttons.id = "mybuttons";

  const start = document.createElement("button");
  start.textContent = "Start";
  start.id = "start";
  start.addEventListener("click", () => {
    startTimer(maxTime);
  });

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

const recoverFromLocalStorage = () => {
  let id = getId();
  let timeTaken = localStorage.getItem(`TimeTaken_${id}`);
  if (timeTaken) {
    const timeElem = document.getElementById("timeElem");
    timeElem.textContent = `Time Taken: ${timeTaken}`;
  }
  let startTime = localStorage.getItem(id);
  if (!startTime) return;
  const Time = new Date();
  const currTime = Time.getTime();
  if (currTime - startTime < maxTime * 1000) {
    startTimer(maxTime - (currTime - startTime) / 1000);
  }
};

const insertTimer = () => {
  window.addEventListener("load", () => {
    addContent();
    recoverFromLocalStorage();
  });
};

insertTimer();
