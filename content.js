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
  if (currentURL.includes("contest")) {
    id = "";
    for (let i = 31; i < len; i++) {
      if (currentURL.charAt(i) == "/") {
        id += "/";
        id += currentURL.charAt(i + 9);
        break;
      }
      id += currentURL.charAt(i);
    }
    console.log(id);
    return id;
  } else {
    let id = "";
    for (let i = 42; i < len; i++) {
      if (currentURL.charAt(i) == "/") {
        id += "/";
        id += currentURL.charAt(i + 1);
        break;
      }
      id += currentURL.charAt(i);
    }
    console.log(id);
    return id;
  }
};

const updateTimerDisplay = (timeLeft) => {
  const timeElem = document.getElementById("timeElem");
  timeElem.textContent = getFormattedTime(timeLeft);
};

const getSubmissionsCount = () => {
  const tableRows = document.querySelector(".rtable.smaller tbody");
  if (!tableRows) return 0;
  const count = tableRows.querySelectorAll("tr").length - 1;
  return count;
};

const addSubmitTimeAndSubmissionsCount = () => {
  const currentTime = new Date();
  const currTime = currentTime.getTime() / 1000;
  const id = getId();
  const attributesInStorage = JSON.parse(localStorage.getItem(id));
  attributesInStorage.submission_Time = currTime;
  attributesInStorage.submissoins_Count = getSubmissionsCount();
  localStorage.setItem(id, JSON.stringify(attributesInStorage));
};
const activateSubmitButtonandStore = () => {
  const submiBtn = document.getElementById("sidebarSubmitButton");
  submiBtn.addEventListener("click", addSubmitTimeAndSubmissionsCount);
};

const deactivateSubmitButton = () => {
  const submiBtn = document.getElementById("sidebarSubmitButton");
  submiBtn.removeEventListener("click", addSubmitTimeAndSubmissionsCount);
};

const startTimer = (time) => {
  const timeElem = document.getElementById("timeElem");
  if (timeElem.textContent.includes("Time")) return;
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
  timeElem.style.fontSize = "25px";
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
  //returns recent verdict
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
  console.log(attributes);

  if (!attributes) {
    const alreadySolved = localStorage.getItem(`TimeTaken_${id}`);
    console.log(alreadySolved);
    if (alreadySolved) {
      const timeElem = document.getElementById("timeElem");
      timeElem.textContent = "Time Taken:";
      timeElem.textContent += getFormattedTime(alreadySolved);
      timeElem.style.fontSize = "25px";
    }
    return;
  }
  attributes = JSON.parse(attributes);
  if (
    attributes.submission_Time &&
    attributes.submissoins_Count + 1 == getSubmissionsCount()
  ) {
    const verdict = getRecentVerdict();
    console.log("verdit", verdict);
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
    } else {
      delete attributes["submission_Time"];
      delete attributes["submissoins_Count"];
      localStorage.setItem(id, JSON.stringify(attributes));
    }
  }
  const isTimerRunning = checkIfTimerRunning(attributes); //take cares of Time Out also
  if (!isTimerRunning) {
    return;
  }

  const date = new Date();
  const currTime = date.getTime() / 1000;
  startTimer(attributes.max_Time - (currTime - attributes.start_Time));
};

const checkIfContestRunning = () => {
  const sideTableLength = document
    .querySelector(".rtable tbody")
    .querySelectorAll("tr").length;
  if (sideTableLength == 5) return true;
  return false;
};

const insertTimer = () => {
  window.addEventListener("load", () => {
    const currentURL = window.location.toString(); //different URL for contest ques and problemset ques, So needed to handeled.
    if (currentURL.includes("contest")) {
      if (currentURL.includes("problem")) {
        const checkContestRunning = checkIfContestRunning(); //checking if there is a contest running
        if (!checkContestRunning) {
          addContent();
          recoverFromLocalStorage();
        }
      }
    } else {
      addContent();
      recoverFromLocalStorage();
      console.log(getSubmissionsCount());
    }
  });
};

insertTimer();
