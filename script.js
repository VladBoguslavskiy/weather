const APIWeather = "313695f122e4da7d8f00daad29f2da76";

const container = document.querySelector(".container");
const containerDetailes = document.querySelector(".detailes__container");
const searchBtn = document.querySelector(".search__box button");
const weatherBox = document.querySelector(".weather__box");
const weatherDetailes = document.querySelector(".weather__detailes");
const weatherError = document.querySelector(".not__found");
const cityWeather = document.querySelector(".city");
const countryWeather = document.querySelector(".country");
const moreDetailes = document.querySelector(".weather__more");
const closeDetailes = document.querySelector(".close__detailes");
const geoWeather = document.querySelector(".bxs-map");

const getFetch = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ua&appid=${APIWeather}`
  );
  const data = await response.json();
  return data;
};
const getWeatherData = async (city) => {
  const data = await getFetch(city);
  if (data.cod == "404") {
    errorWeather();
    return;
  }
  const longitude = data.coord.lon;
  const latitude = data.coord.lat;

  containerDetailes.innerHTML = ``;
  console.log(data);

  displayWeather(data, city);
  displayWeatherWithLoction(latitude, longitude);
};
const displayWeatherWithLoction = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=ua&appid=${APIWeather}`
  );
  const data = await response.json();
  const dailyWeather = [];

  for (let i = 0; i < data.list.length; i += 8) {
    dailyWeather.push(data.list[i]);
  }

  dailyWeather.forEach((day) => {
    const date = new Date(day.dt_txt).toLocaleString("ua-UK", {
      weekday: "short",
    });
    const dayContainer = document.createElement("div");
    dayContainer.classList.add("item-detailes");
    dayContainer.innerHTML = `
			  <div class="detailes__item item-detailes">
					<h3 class="item-detailes__day">${date}</h3>
					<img src="${getWeatherImage(
            day.weather[0].main
          )}" alt="" class="item-detailes__img"> 
					<p class="item-detailes__temp">${parseInt(day.main.temp)}<span>°C</span></p>
					<div class="item-detailes__humidity">
						 <i class='bx bx-water'></i>
						 <p class="item-detailes__wind-info">${day.main.humidity}%</p>
					</div>
					<div class="item-detailes__wind">
						 <i class='bx bx-wind'></i>
						 <p class="item-detailes__wind-info">${day.wind.speed}</p>
					</div>
					<div class="item-detailes__precipitation">
						 <i class='bx bx-cloud-rain'></i>
						 <p class="item-detailes__precipitation-info">${day.main.pressure}</p>
					</div>
			  </div>`;
    containerDetailes.appendChild(dayContainer);
  });
};
const displayWeather = (data, city) => {
  const image = document.querySelector(".weather__box img");
  const temperature = document.querySelector(".weather__box .temperature");
  const description = document.querySelector(".weather__box .description");
  const today = document.querySelector(".weather__box .today");
  const humidity = document.querySelector(".weather__detailes .humidity span");
  const wind = document.querySelector(".weather__detailes .wind span");

  showWeather();

  const weatherMain = data.weather[0].main;
  const imageWeather = getWeatherImage(weatherMain);
  const date = new Date(data.dt * 1000);
  const dayToday = date.toLocaleString("uk-UA", { weekday: "long" });

  image.src = imageWeather;
  temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
  description.innerHTML = `${data.weather[0].description}`;
  today.innerHTML = dayToday;
  humidity.innerHTML = `${data.main.humidity}%`;
  wind.innerHTML = `${parseInt(data.wind.speed)}Км/год`;
  cityWeather.innerHTML = `${city.toUpperCase()}`;

  document.querySelector(".search__box input").value = "";
};
const getWeatherImage = (weatherMain) => {
  switch (weatherMain) {
    case "Clear":
      return "./img/sunny.png";
    case "Rain":
      return "./img/rain.png";
    case "Snow":
      return "/img/snow.png";
    case "Clouds":
      return "./img/cloud.png";
    case "Mist":
      return "./img/mist.png";
    case "Storm":
      return "./img/storm.png";
    default:
      return "img/sunny.png";
  }
};
const errorWeather = () => {
  container.style.height = "400px";
  weatherBox.classList.remove("active");
  weatherDetailes.classList.remove("active");
  weatherError.classList.add("active");
};
const showWeather = () => {
  container.style.height = "555px";
  container.classList.add("active");
  weatherBox.classList.add("active");
  weatherDetailes.classList.add("active");
  moreDetailes.classList.add("active");
  weatherError.classList.remove("active");
};
searchBtn.addEventListener("click", () => {
  const city = document.querySelector(".search__box input").value;
  if (city == "") return;
  getWeatherData(city);
});
moreDetailes.addEventListener("click", () => {
  document.querySelector(".container__detailes").classList.toggle("active");
  document.querySelector(".weather__more").style.display = "none";
});
closeDetailes.addEventListener("click", () => {
  document
    .querySelector(".container__detailes.active")
    .classList.remove("active");
  document.querySelector(".weather__more").style.display = "flex";
});

const getWeatherByGeoLocation = async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ua&appid=${APIWeather}`
    );
    const data = await response.json();

    const city = data.name;
    containerDetailes.innerHTML = ``;
    city.value = ``;
    displayWeatherWithLoction(latitude, longitude);
    displayWeather(data, city);
  });
};

geoWeather.addEventListener("click", getWeatherByGeoLocation);

getWeatherByGeoLocation();
