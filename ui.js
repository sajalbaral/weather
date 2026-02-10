const cardContainer = document.getElementById("card-container");
const city = document.getElementById("city");
const coord = document.getElementById("coords");
const currentTemp = document.getElementById("current-temp");

function renderCard(daysArr) {
  for (let i = 0; i < daysArr.length; i++) {
    const newSection = document.createElement("section");
    newSection.classList.add("card");

    const date = document.createElement("p");
    const max = document.createElement("p");
    const min = document.createElement("p");

    date.classList.add("card-date");
    max.classList.add("card-max");
    min.classList.add("card-min");

    const rawDate = daysArr[i].date;
    date.textContent = new Date(rawDate).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    max.textContent = Math.round(daysArr[i].high) + "°C";
    min.textContent = Math.round(daysArr[i].low) + "°C";

    newSection.append(date, max, min);
    cardContainer.appendChild(newSection);
  }
}

export function render(state) {
  cardContainer.textContent = "";

  if (state.status === "idle") {
    city.textContent = "Enter a City";
    coord.textContent = "";
  }

  if (state.status === "loading") {
    cardContainer.textContent = "";
    city.textContent = "Loading";
    coord.textContent = "";
  }

  if (state.status === "success") {
    city.textContent = "" + state.data.cityCountry;
    coord.textContent = "Lat: " + state.data.lat + " · Lon: " + state.data.lon;
    currentTemp.textContent =
      "Current Temperature: " + Math.round(state.data.temp) + "°C";
    renderCard(state.data.daysArr);
  }

  if (state.status === "error") {
    cardContainer.textContent = "";
    city.textContent = state.error;
    coord.textContent = "";
    currentTemp.textContent = "";
  }
}
