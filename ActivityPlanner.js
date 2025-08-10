const activities = [
  "Pingis",
  "Kubb",
  "Beerpong",
  "UNO",
  "Kortlekar",
  "Ring of Fire",
  "Discgolf",
  "Grilla",
  "Resturang",
  "Fiska"
];

let activityCount = 0;

let selectedActivities = new Array(activityCount).fill(null);

function addActivity() {
  const container = document.getElementById("activities-container");

  if (activityCount > 0) {
    const arrowSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrowSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    arrowSvg.setAttribute("height", "24px");
    arrowSvg.setAttribute("viewBox", "0 -960 960 960");
    arrowSvg.setAttribute("width", "24px");
    arrowSvg.setAttribute("fill", "#000000");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z");

    arrowSvg.appendChild(path);
    container.appendChild(arrowSvg);
  }

  activityCount++;

  const activityDiv = document.createElement("div");
  activityDiv.className = "activity-container";

  const activityTitle= document.createElement("h1");
  activityTitle.textContent = "Aktivitet " + activityCount;
  activityDiv.appendChild(activityTitle);

  const select = document.createElement("select");
  select.className = "select-activity";
  activities.sort().forEach((act, index) => {
    const option = document.createElement("option");
    option.value = act;
    option.textContent = act;
    select.appendChild(option);
  });
  activityDiv.appendChild(select);

  container.appendChild(activityDiv);
}

function removeActivity() {
  const container = document.getElementById("activities-container");
  if (activityCount > 1) {
    const last = container.lastElementChild;
    if (last) {
      container.removeChild(last);
      activityCount--;
    }

    const maybeArrow = container.lastElementChild;
    if (maybeArrow && maybeArrow.tagName.toLowerCase() === "svg") {
      container.removeChild(maybeArrow);
    }
  }
}

function initList() {
  try {
    let list = activities.sort();
    let html = ``;
    list.forEach((activity, index) => {
      html += `
        <p>${activity}</p>
        `
    })
    document.getElementById('activity-list').innerHTML = html;
  } catch(error) {
    console.error('Error loading activity list:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  addActivity();
  initList();
});
