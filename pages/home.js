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

  document.getElementById("cities").addEventListener("change", function() {
    document.getElementById("addToCart").disabled = !this.value;
  });

  document.getElementById("buses").addEventListener("change", function() {
    document.getElementById("addToCart").disabled = !this.value;
  });

  document.getElementById("cities-hotel").addEventListener("change", function() {
    document.getElementById("addHotelToNotes").disabled = !this.value;
  });

  document.getElementById("hotels").addEventListener("change", () => {
    document.getElementById("addHotelToNotes").disabled = !this.value;
  });
}
showBusCompanies();
document.getElementById("current-date").innerText = new Date().toLocaleString("en-GB").split(",")[0]



/** @param {import("./types").FetchMeteoParam} param  */
async function fetchCurrentMeteo(param) {
  let url = new URL("/v1/forecast", "https://api.open-meteo.com");
  Object.entries(param).forEach(([key, value]) => { url.searchParams.append(key, typeof value === "object" ? value.join(",") : value) })

  return fetch(url).then(res => res.json())
}

async function updateCurrentWeather() {
  let cities = {
    "hpa-an": ["16.8759", "97.6440"]
  }

  let [latitude, longitude] = cities["hpa-an"];

  let { current } = await fetchCurrentMeteo({ latitude, longitude, current: ["temperature_2m", "relative_humidity_2m", "rain", "wind_speed_10m"] })
  document.getElementById("current-temperature").innerText = current.temperature_2m;
  document.getElementById("current-windspeed").innerText = current.wind_speed_10m;
  document.getElementById("current-humidity").innerText = current.relative_humidity_2m;
  document.getElementById("current-humidity").innerText = current.relative_humidity_2m;
  /** @type {"Clear sky" | "Light rain" | "Moderate rain" | "Heavy rain"} */
  let rainCondition = current.rain < 2 ? "Clear sky" : current.rain < 8 ? "Light rain" : current.rain < 15 ? "Moderate rain" : "Heavy rain";
  document.getElementById("current-rain").innerText = rainCondition;
  let icon = rainCondition === "Clear sky" ? "https://openweathermap.org/img/wn/01d@2x.png" :
    rainCondition === "Light rain" ? "https://openweathermap.org/img/wn/09d@2x.png" :
      rainCondition === "Moderate rain" ? "https://openweathermap.org/img/wn/10d@2x.png" :
        "https://openweathermap.org/img/wn/11d@2x.png";

  document.getElementById("current-weather-icon").src = icon;

}

updateCurrentWeather();

