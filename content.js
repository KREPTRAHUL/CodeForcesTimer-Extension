let defaultMaxTime = 300;
let intervalId;

//handle message from popup.js and set the time to defaultMaxTime
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.time) {
    defaultMaxTime = message.time;
    localStorage.setItem("defaultMaxTime", defaultMaxTime);
    if (!intervalId) {
      const timeElem = document.getElementById("timeElem");
      timeElem.textContent = getFormattedTime(defaultMaxTime);
    }
  }
});

const getFormattedTime = (time) => {
  let min = Math.floor(time / 60);
  let sec = Math.floor(time % 60);
  if (min < 10) min = `0${min}`;
  if (sec < 10) sec = `0${sec}`;
  return `${min}:${sec}`;
};
const getId = () => {
  //Id of the question
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

  const attributesInStorage = localStorage.getItem(id);
  if (!attributesInStorage) {
    let countPreviousAccepted =
      document.querySelectorAll(".verdict-accepted").length;
    const attributes = {
      max_Time: time,
      start_Time: startTime,
      count_PreviousAccepted: countPreviousAccepted,
    };
    localStorage.setItem(id, JSON.stringify(attributes));
    console.log(attributes);
    console.log(JSON.parse(localStorage.getItem(id)));
  }

  timeLeft = time;

  let countPreviousAccepted = JSON.parse(
    localStorage.getItem(id)
  ).count_PreviousAccepted;
  //console.log(countPreviousAccepted);

  intervalId = setInterval(function () {
    const currentAccepted =
      document.querySelectorAll(".verdict-accepted").length;
    if (currentAccepted == countPreviousAccepted + 1) {
      const timeElem = document.getElementById("timeElem");
      const attributes = JSON.parse(localStorage.getItem(id));

      timeElem.textContent = "Time Taken:";
      timeElem.textContent += getFormattedTime(attributes.max_Time - timeLeft);
      localStorage.setItem(`TimeTaken_${id}`, attributes.max_Time - timeLeft);
      localStorage.removeItem(id);
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
  timeElem.textContent = getFormattedTime(defaultMaxTime);
};

const addContent = () => {
  const timer = document.createElement("div");
  timer.id = "timer";

  const timeElem = document.createElement("div");
  timeElem.id = "timeElem";
  id = getId();
  const attributes = JSON.parse(localStorage.getItem(id));
  if (attributes) timeElem.textContent = "";
  else {
    const defaultMaxTimeInStorage = localStorage.getItem("defaultMaxTime");
    if (defaultMaxTimeInStorage)
      timeElem.textContent = getFormattedTime(defaultMaxTimeInStorage);
    else timeElem.textContent = getFormattedTime(defaultMaxTime);
  }

  const mybuttons = document.createElement("div");
  mybuttons.id = "mybuttons";

  const start = document.createElement("button");
  start.textContent = "Start";
  start.id = "start";
  start.addEventListener("click", () => {
    startTimer(defaultMaxTime);
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
  let defaultMaxTimeInStorage = localStorage.getItem("defaultMaxTime");
  if (defaultMaxTimeInStorage) defaultMaxTime = defaultMaxTimeInStorage;
  let id = getId();
  const checkIfTimerRunning = localStorage.getItem(id);
  let timeTaken = localStorage.getItem(`TimeTaken_${id}`);
  if (timeTaken && !checkIfTimerRunning) {
    const timeElem = document.getElementById("timeElem");
    timeElem.textContent = `Time Taken: ${getFormattedTime(timeTaken)}`;
    return;
  }
  const attributes = JSON.parse(localStorage.getItem(id));
  //let startTime = localStorage.getItem(id).start_Time;
  if (!attributes) return;
  const Time = new Date();
  const currTime = Time.getTime();

  if (currTime - attributes.start_Time < attributes.max_Time * 1000) {
    startTimer(attributes.max_Time - (currTime - attributes.start_Time) / 1000);
  }
};

const insertTimer = () => {
  window.addEventListener("load", () => {
    addContent();
    recoverFromLocalStorage();
  });
};

insertTimer();
