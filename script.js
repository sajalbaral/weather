const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const city = document.getElementById("city");
const coord = document.getElementById("coords");
const cardContainer = document.getElementById("card-container");

const state = {
  status: "idle",
  data: null,
  error: null,
  requestId: 0,
};

function setState(obj) {
  if (obj.status !== undefined) state.status = obj.status;
  if (obj.data !== undefined) state.data = obj.data;
  if (obj.error !== undefined) state.error = obj.error;
  if (obj.requestId !== undefined) state.requestId = obj.requestId;

  render();
}

function render() {
  if (state.status === "idle") {
    city.textContent = "Enter a City";
    coord.textContent = "";
  }

  if (state.status === "loading") {
    city.textContent = "Loading";
    coord.textContent = "";
  }

  if (state.status === "success") {
    city.textContent = "" + state.data.cityCountry;
    coord.textContent = "Lat: " + state.data.lat + " · Lon: " + state.data.lon;
  }

  if (state.status === "error") {
    city.textContent = state.error;
    coord.textContent = "";
  }
}

async function fetchGeography(location) {
  const loc = location.trim();
  if (!loc) throw new Error("Please enter a location");

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${loc}`;
  const geoResult = await fetch(geoUrl);

  if (!geoResult.ok) {
    throw new Error("Weather request failed (" + geoResult.status + ")");
  }

  const geoJSON = await geoResult.json();
  if (!geoJSON.results) {
    throw new Error("Weather request failed (" + geoJSON.status + ")");
  }
  const lon = geoJSON.results[0].longitude;
  const lat = geoJSON.results[0].latitude;
  const cityCountry =
    geoJSON.results[0].name + ", " + geoJSON.results[0].country;

  return { lon, lat, cityCountry };
}

async function fetchWeather(location) {
  const loc = location.trim();
  if (!loc) throw new Error("Please enter a location");
  const geography = await fetchGeography(loc);

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geography.lat}&longitude=${geography.lon}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=7`;
  const forecastResult = await fetch(forecastUrl);

  if (!forecastResult.ok) {
    throw new Error("Weather request failed (" + forecastResult.status + ")");
  }

  const forecastJSON = await forecastResult.json();
  const temp = forecastJSON.current.temperature_2m;
  const lon = geography.lon;
  const lat = geography.lat;
  const cityCountry = geography.cityCountry;
  const daysArr = [];

  for (let i = 0; i < 7; i++) {
    const date = forecastJSON.daily.time[i];
    const high = forecastJSON.daily.temperature_2m_max[i];
    const low = forecastJSON.daily.temperature_2m_min[i];
    daysArr.push({ date, high, low });
  }

  return { temp, lon, lat, cityCountry, daysArr };
}

async function search() {
  const nextId = state.requestId++;

  setState({ status: "loading", data: null, error: null, requestId: nextId });

  const myId = nextId;

  try {
    const result = await fetchWeather(searchInput.value);
    if (state.requestId !== myId) return;
    setState({
      status: "success",
      data: result,
      error: null,
    });
  } catch (err) {
    if (state.requestId !== myId) return;
    setState({ status: "error", data: null, error: err });
  }
}

searchBtn.addEventListener("click", search);
render();
