async function fetchGeography(location) {
  const loc = location.trim();
  if (!loc) throw new Error("Please enter a location");

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}`;
  const geoResult = await fetch(geoUrl);

  if (!geoResult.ok) {
    throw new Error("Weather request failed (" + geoResult.status + ")");
  }

  const geoJSON = await geoResult.json();
  if (!geoJSON.results || geoJSON.results.length === 0) {
    throw new Error("Weather request failed (" + geoJSON.status + ")");
  }
  const lon = geoJSON.results[0].longitude;
  const lat = geoJSON.results[0].latitude;
  const cityCountry =
    geoJSON.results[0].name + ", " + geoJSON.results[0].country;

  return { lon, lat, cityCountry };
}

export async function getForecast(location) {
  const geography = await fetchGeography(location);

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geography.lat}&longitude=${geography.lon}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`;
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

  for (let i = 0; i < forecastJSON.daily.time.length; i++) {
    const date = forecastJSON.daily.time[i];
    const high = forecastJSON.daily.temperature_2m_max[i];
    const low = forecastJSON.daily.temperature_2m_min[i];
    daysArr.push({ date, high, low });
  }

  return { temp, lon, lat, cityCountry, daysArr };
}
