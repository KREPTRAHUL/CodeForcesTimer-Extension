
let defaultTime;
const activeButton = document.getElementsByClassName("button")
const min5Button = document.getElementById("5minButton")
const min10Button = document.getElementById("10minButton")
const min20Button = document.getElementById("20minButton")
const min30Button = document.getElementById("30minButton")

const customTimer = document.getElementById("customTimer")
if(!customTimer.value){
    customTimer.value = localStorage.getItem("customTime");
}
else{
    customTimer.value = "00:00";
}
const customButton = document.getElementById("customButton")

var active;
const addActiveClass = (active) => {
    switch(active){
        case "min5button":
            min5Button.classList.add("active")
            defaultTime = 301;
            break;
        case "min10button":
            min10Button.classList.add("active")
            defaultTime = 601;
            break;
        case "min20button":
            min20Button.classList.add("active")
            defaultTime = 1201;
            break;
        case "min30button":
            min30Button.classList.add("active")
            defaultTime = 1801;
            break;
        case "customButton":
            customButton.classList.add("active")
            defaultTime = localStorage.getItem("customTime")
            break;
        default:
            min5Button.classList.add("active")
            defaultTime = 301;
    }
}
const removeActiveClass = (active) => {
    switch(active){
        case "min5button":
            min5Button.classList.remove("active")
            break;
        case "min10button":
            min10Button.classList.remove("active")
            break;
        case "min20button":
            min20Button.classList.remove("active")
            break;
        case "min30button":
            min30Button.classList.remove("active")
            break;
        case "customButton":
            customButton.classList.remove("active")
            break;
        default:
            min5Button.classList.remove("active")
            defaultTime = 301;
    }
}


active = localStorage.getItem("activeClass")
addActiveClass(active);


min5Button.onclick = function() {
    console.log("pressed = ", min5Button)
    removeActiveClass(active);
    active = "min5button";
    addActiveClass(active);
    localStorage.setItem("defaultTime", defaultTime);
    localStorage.setItem("activeClass", "min5button");
    customTimer.value = "00:00";
    console.log("custom time = ", active)
}
min10Button.onclick = function() {
    console.log("pressed = ", min10Button)
    removeActiveClass(active);
    active = "min10button";
    addActiveClass(active);
    localStorage.setItem("defaultTime", defaultTime);
    localStorage.setItem("activeClass", "min10button");
    customTimer.value = "00:00";
    console.log("custom time = ", active)
}
min20Button.onclick = function() {
    console.log("pressed = ", min20Button)
    removeActiveClass(active);
    active = "min20button";
    addActiveClass(active);
    localStorage.setItem("defaultTime", defaultTime);
    localStorage.setItem("activeClass", "min20button");
    customTimer.value = "00:00";
    console.log("custom time = ", active)
}
min30Button.onclick = function() {
    console.log("pressed = ", min30Button)
    removeActiveClass(active);
    active = "min30button";
    addActiveClass(active);
    localStorage.setItem("defaultTime", defaultTime);
    localStorage.setItem("activeClass", "min30button");
    customTimer.value = "00:00";
    console.log("custom time = ", active)
}

customButton.onclick = function() {
    if(customTimer.value){
        console.log("pressed = ", customButton.id)
        console.log("custom time = ", customTimer.value)
        const [hours, minutes] = customTimer.value.split(":").map(Number);
        defaultTime = hours * 60 + minutes;
        removeActiveClass(active);
        active = "customButton";
        customButton.classList.add("active");
        localStorage.setItem("defaultTime", defaultTime);
        localStorage.setItem("customTime", customTimer.value)
        localStorage.setItem("activeClass", "customButton");
        console.log("custom time = ", active)
    }
}



