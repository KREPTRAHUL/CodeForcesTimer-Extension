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

const addSubmitTime = () => {
  const currentTime = new Date();
  const currTime = currentTime.getTime() / 1000;
  const id = getId();
  const attributesInStorage = JSON.parse(localStorage.getItem(id));
  attributesInStorage.submission_Time = currTime;
  localStorage.setItem(id, JSON.stringify(attributesInStorage));
};
const activateSubmitButtonandStore = () => {
  const submiBtn = document.getElementById("sidebarSubmitButton");
  submiBtn.addEventListener("click", addSubmitTime);
};

const deactivateSubmitButton = () => {
  const submiBtn = document.getElementById("sidebarSubmitButton");
  submiBtn.removeEventListener("click", addSubmitTime);
};

const startTimer = (time) => {
  if (intervalId) return;

  const currentTime = new Date();
  const startTime = currentTime.getTime() / 1000;
  const id = getId();

  const attributesInStorage = localStorage.getItem(id);
  if (!attributesInStorage) {
    const attributes = {
      max_Time: time,
      start_Time: startTime,
    };
    localStorage.setItem(id, JSON.stringify(attributes));
  }
  activateSubmitButtonandStore();

  timeLeft = time;

  intervalId = setInterval(function () {
    timeLeft--;
    if (timeLeft < 0) {
      const timeElem = document.getElementById("timeElem");
      timeElem.textContent = "Time Out";
      clearInterval(intervalId);
      deactivateSubmitButton();
      localStorage.removeItem(id);
    } else {
      updateTimerDisplay(timeLeft);
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
  deactivateSubmitButton();
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

const checkIfTimerRunning = (attributes) => {
  const date = new Date();
  const currTime = date.getTime() / 1000;
  let remTime = attributes.max_Time - (currTime - attributes.start_Time);
  if (remTime <= 0) {
    const id = getId();
    localStorage.removeItem(id);
    const timeElem = document.getElementById("timeElem");
    timeElem.textContent = "Time Out";
    return false;
  } else {
    return true;
  }
};

const getRecentVerdict = () => {
  const tableRows = document.querySelector(".rtable.smaller tbody");
  const recentSubmission = tableRows
    .querySelector("tr:nth-child(2) td:nth-child(3)")
    .textContent.trim();
  if (recentSubmission == "Accepted") return true;
  return false;
};
const recoverFromLocalStorage = () => {
  let defaultMaxTimeInStorage = localStorage.getItem("defaultMaxTime");
  if (defaultMaxTimeInStorage) defaultMaxTime = defaultMaxTimeInStorage;

  let id = getId();
  let attributes = localStorage.getItem(id);

  if (!attributes) return;
  attributes = JSON.parse(attributes);
  if (attributes.submission_Time) {
    const verdict = getRecentVerdict();
    if (verdict) {
      const timeElem = document.getElementById("timeElem");
      timeElem.textContent = "Time Taken:";
      timeElem.textContent += getFormattedTime(
        attributes.submission_Time - attributes.start_Time
      );
      localStorage.setItem(
        `TimeTaken_${id}`,
        attributes.submission_Time - attributes.start_Time
      );
      localStorage.removeItem(id);
      return;
    }
  }
  const isTimerRunning = checkIfTimerRunning(attributes); //take cares of Time Out also
  if (!isTimerRunning) return;

  const date = new Date();
  const currTime = date.getTime() / 1000;
  startTimer(attributes.max_Time - (currTime - attributes.start_Time));
};

const insertTimer = () => {
  window.addEventListener("load", () => {
    addContent();
    recoverFromLocalStorage();
  });
};

insertTimer();
