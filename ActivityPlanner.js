let categories = [];

class Category {
  constructor(category, activities, id) {
    this.category = category;
    this.activities = activities;
    this.id = id;
  }
}

function fetchActivities() {
  fetch('./assets/activities.json')
    .then(response => response.json())
    .then(data => {
      initList(data);
      addActivity();
      initFilter();
    }).catch(error => console.error('Error loading text:', error));
}

function initList(data) {
  try {
    let cats = [];
    let i = 0;
    for(const [category, activs] of Object.entries(data)) {
      cats.push(new Category(category, activs, i));
      i++;
    }

    categories = cats.sort((a, b) => {
      const catA = a.category.toUpperCase();
      const catB = b.category.toUpperCase();
      if (catA < catB) {
        return -1;
      }
      if (catA > catB) {
        return 1;
      }
      return 0;
    });

    updateActivityList();
  } catch(error) {
    console.error('Error loading activity list:', error);
  }
}

function updateActivityList(cats = categories) {
  try {
    const container = document.getElementById("activity-list");
    container.innerHTML = "";

    cats.forEach(cat => {
      const categoryContainer = document.createElement("div");
      categoryContainer.className = "category-container";

      const h = document.createElement("h3");
      h.className = "category-title";
      h.textContent = cat.category;
      categoryContainer.appendChild(h);

      cat.activities.forEach((act => {
        const p = document.createElement("p");
        p.className = "activity-text"
        p.textContent = act;
        p.addEventListener("click", (event) => {
          addActivity(act);
        })
        categoryContainer.appendChild(p);
      }))
      container.appendChild(categoryContainer);

    })
  } catch(error) {
    console.error('Error loading activity list:', error);
  }
}

let activityCount = 0;

let selectedActivities = new Array(activityCount).fill(null);

function addActivity(activity = "") {
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
  categories.forEach((cat) => {
    cat.activities.forEach((act) => {
      const option = document.createElement("option");
      option.value = act;
      option.textContent = act;
      select.appendChild(option);
    });
  });
  if(activity != "") {
    Array.from(select.options).forEach((option, index) => {
      if (option.value === activity || option.textContent === activity) {
        select.selectedIndex = index;
      } // If we create an activity by pressing in the list it sets the select value
    });
  }

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

function initFilter() {
  const filterDropdown = document.querySelector('.filter-dropdown');
  filterDropdown.innerHTML = "";

  categories.forEach(cat => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = cat.category;
    checkbox.name = "category-filter";
    checkbox.checked = true;

    checkbox.addEventListener('change', () => {
      filterActivities(categories);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + cat.category));

    filterDropdown.appendChild(label);
  });

  const filterBtn = document.querySelector('.filter-button');

  filterBtn.addEventListener('click', () => {
    const isVisible = filterDropdown.style.display === 'block';
    filterDropdown.style.display = isVisible ? 'none' : 'block';
  });

  document.addEventListener('click', (event) => {
    if (!filterBtn.contains(event.target) && !filterDropdown.contains(event.target)) {
      filterDropdown.style.display = 'none';
    }
  });
}

function filterActivities() {
  const checkedCategories = Array.
    from(document.querySelectorAll('.filter-dropdown input[type="checkbox"]:checked')).map(cb => cb.value);

  let filteredCats;
  if (checkedCategories.length === 0) {
    filteredCats = categories;
  } else {
    filteredCats = categories.filter(cat => checkedCategories.includes(cat.category));
  }
  updateActivityList(filteredCats);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchActivities();
});
