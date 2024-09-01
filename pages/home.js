const busCompanies = {
  yangon: [
    { name: "JJ Express", url: "https://jjexpress.net" },
    { name: "Elite", url: "https://www.elitebus.com" },
    { name: "Shwe Mandalar", url: "https://www.shwemandalarbus.com" },
    { name: "Bagan Min Thar", url: "https://www.baganmintharbus.com" },
  ],
  mandalay: [
    { name: "Shwe Mandalar", url: "https://www.shwemandalarbus.com" },
    { name: "Bagan Min Thar", url: "https://www.baganmintharbus.com" },
    { name: "JJ Express", url: "https://jjexpress.net" },
  ],
  naypyidaw: [
    { name: "Apex Express", url: "https://www.apexexpressbus.com" },
    { name: "OK Express", url: "https://www.okexpressbus.com" },
  ],
};

function showBusCompanies() {
  document.getElementById("cities").addEventListener("change", function () {
    document.getElementById("addToCart").disabled = false;
  });

  document.getElementById("buses").addEventListener("change", function () {
    document.getElementById("addToCart").disabled = false;
  });

  document.getElementById("cities-hotel").addEventListener("change", function () {
    document.getElementById("addHotelToNotes").disabled = false;
  });

  document.getElementById("hotels").addEventListener("change", () => {
    document.getElementById("addHotelToNotes").disabled = false;
  });
}
showBusCompanies();

// ========================================================

/** @param {import("./types").FetchMeteoParam} param  */
async function fetchCurrentMeteo(param) {
  let url = new URL("/v1/forecast", "https://api.open-meteo.com");
  Object.entries(param).forEach(([key, value]) => {
    url.searchParams.append(key, typeof value === "object" ? value.join(",") : value);
  });

  return fetch(url).then((res) => res.json());
}

document.getElementById("current-date").innerText =
  "(" + new Date().toISOString().slice(0, 10) + ")";

let cities = {
  yangon: [16.8408, 96.1735],
  mandalay: [21.9747, 96.0896],
  naypyidaw: [19.7454, 96.0294],
  bagan: [21.1611, 94.8561],
  taunggyi: [20.7824, 97.0388],
  mawlamyine: [16.4906, 97.6288],
  "hpa-an": [16.8941, 97.6315],
  pyay: [18.8118, 95.213],
  myitkyina: [25.3851, 97.3963],
  sittwe: [20.1494, 92.9068],
};

async function updateCurrentWeather(city = "hpa-an") {
  let [latitude, longitude] = cities[city];

  let { current, hourly } = await fetchCurrentMeteo({
    latitude,
    longitude,
    current: ["temperature_2m", "relative_humidity_2m", "rain", "wind_speed_10m"],
    hourly: ["temperature_2m", "relative_humidity_2m", "rain", "wind_speed_10m"],
    timezone: "Asia/Bangkok",
    forecast_days: 5,
  });
  document.getElementById("current-temperature").innerText = current.temperature_2m;
  document.getElementById("current-windspeed").innerText = current.wind_speed_10m;
  document.getElementById("current-humidity").innerText = current.relative_humidity_2m;
  document.getElementById("current-humidity").innerText = current.relative_humidity_2m;

  /**
   * @param {number} rain
   * @returns {"Clear sky" | "Light rain" | "Moderate rain" | "Heavy rain"} */
  let getRainCond = (rain) =>
    rain < 2 ? "Clear sky" : rain < 8 ? "Light rain" : rain < 15 ? "Moderate rain" : "Heavy rain";

  /** @param {"Clear sky" | "Light rain" | "Moderate rain" | "Heavy rain"} rainCondition */
  let getIcon = (rainCondition) =>
    rainCondition === "Clear sky"
      ? "https://openweathermap.org/img/wn/01d@2x.png"
      : rainCondition === "Light rain"
        ? "https://openweathermap.org/img/wn/09d@2x.png"
        : rainCondition === "Moderate rain"
          ? "https://openweathermap.org/img/wn/10d@2x.png"
          : "https://openweathermap.org/img/wn/11d@2x.png";

  let rainCondition = getRainCond(current.rain);
  document.getElementById("current-rain").innerText = rainCondition;
  document.getElementById("current-weather-icon").src = getIcon(rainCondition);

  [0, 0, 0, 0, 0].forEach((_, i) => {
    idx = i * 24;

    let time = hourly.time[idx].slice(0, 10);
    let temp = hourly.temperature_2m[idx];
    let rain = hourly.rain[idx];
    let humidity = hourly.relative_humidity_2m[idx];
    let windSpeed = hourly.wind_speed_10m[idx];

    let { children } = document.getElementById(`card-${i}`);
    children[0].innerText = time;
    children[1].src = getIcon(getRainCond(rain));
    children[2].children[0].innerText = temp;
    children[3].children[0].innerText = windSpeed;
    children[4].children[0].innerText = humidity;
  });
}

updateCurrentWeather();

let currentCity = document.getElementById("current-city");

document.getElementById("cities").addEventListener("change", (e) => {
  updateCurrentWeather(e.target.value);
  currentCity.innerText = e.target.value;
});
