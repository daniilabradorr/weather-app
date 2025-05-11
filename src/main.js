// src/main.js

// 1. Capturo elementos del DOM
const form             = document.getElementById('weatherForm');
const cityInput        = document.getElementById('cityInput');
const spinner          = document.getElementById('spinner');
const errorMessage     = document.getElementById('error');

const divResultWeather = document.getElementById('weatherResult');
const cityName         = document.getElementById('cityName');
const stateName        = document.getElementById('stateName');
const weatherIcon      = document.getElementById('weatherIcon');
const temperatura      = document.getElementById('temp');
const humedad          = document.getElementById('humidity');
const descriptionWeather = document.getElementById('description');

const dailyContainer   = document.getElementById('dailyContainer');
const dailyCards       = document.getElementById('dailyCards');
const hourlyContainer  = document.getElementById('hourlyContainer');
const hourlyCards      = document.getElementById('hourlyCards');

// 2. Mi API key
const apiKey = '620883a70137772b963b2b6d943f285f';

// 3. Map de comunidades en español
const statesMap = {
  'Andalusia': 'Andalucía', 'Aragon': 'Aragón', 'Asturias': 'Asturias',
  'Balearic Islands': 'Islas Baleares', 'Canary Islands': 'Canarias',
  'Cantabria': 'Cantabria', 'Castile-La Mancha': 'Castilla-La Mancha',
  'Castile and León': 'Castilla y León', 'Catalonia': 'Cataluña',
  'Valencian Community': 'Comunidad Valenciana','Extremadura': 'Extremadura',
  'Galicia': 'Galicia','La Rioja': 'La Rioja','Community of Madrid': 'Comunidad de Madrid',
  'Region of Murcia': 'Región de Murcia','Navarre': 'Navarra','Basque Country': 'País Vasco',
  'Ceuta':'Ceuta','Melilla':'Melilla'
};

// 4. Reverse geocoding para obtener comunidad
async function getState(lat, lon) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse`
            + `?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  const res = await fetch(url);
  const [loc] = await res.json();
  const st = loc && loc.state ? (statesMap[loc.state] || loc.state) : '';
  return st;
}

// 5. Geocoding: de ciudad a coords
async function geocodeCity(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct`
            + `?q=${encodeURIComponent(city)},ES&limit=1&appid=${apiKey}`;
  const res = await fetch(url);
  const [loc] = await res.json();
  if (!loc) throw new Error('Ciudad no encontrada');
  return { lat: loc.lat, lon: loc.lon, state: statesMap[loc.state] || loc.state };
}

// 6. Función principal: clima + forecasts
async function fetchWeatherAndForecast(city){
  try {
    spinner.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    divResultWeather.classList.add('hidden');
    dailyContainer.classList.add('hidden');
    hourlyContainer.classList.add('hidden');
    dailyCards.innerHTML = '';
    hourlyCards.innerHTML = '';

    // obtengo coords y state
    const { lat, lon, state } = await geocodeCity(city);

    // clima actual
    const w = await (await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`
      + `&appid=${apiKey}&units=metric&lang=es`
    )).json();
    if (w.cod !== 200) throw new Error(w.message);

    cityName.textContent           = `${w.name}, ${w.sys.country}`;
    stateName.textContent          = state;
    weatherIcon.src                = `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`;
    weatherIcon.alt                = w.weather[0].description;
    temperatura.textContent        = w.main.temp.toFixed(1);
    humedad.textContent            = w.main.humidity;
    descriptionWeather.textContent = w.weather[0].description;
    divResultWeather.classList.remove('hidden');

    // forecast 5 días (tomamos cada día a las 12:00)
    const f5 = await (await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}`
      + `&appid=${apiKey}&units=metric&lang=es`
    )).json();
    if (f5.cod !== '200') throw new Error('Error al obtener forecast diario');

    dailyContainer.classList.remove('hidden');
    // Filtrar entradas con hora "12:00:00"
    f5.list.filter(item => item.dt_txt.endsWith('12:00:00'))
      .forEach(day => {
        const d = new Date(day.dt * 1000);
        const wd = d.toLocaleDateString('es-ES',{weekday:'long'});
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const card = `
          <div class="weather-card forecast-card">
            <h4>${wd}</h4>
            <img src="${icon}" alt="${day.weather[0].description}" />
            <p><strong>${day.main.temp.toFixed(0)}°</strong></p>
          </div>`;
        dailyCards.insertAdjacentHTML('beforeend', card);
      });

    // forecast horas día actual (próximas 8 franjas de 3h)
    hourlyContainer.classList.remove('hidden');
    const now = new Date();
    f5.list.filter(item => {
      const d = new Date(item.dt * 1000);
      return d.getDate() === now.getDate();
    }).slice(0, 8).forEach(item => {
      const d = new Date(item.dt * 1000);
      const hr = d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
      const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
      const card = `
        <div class="weather-card forecast-card">
          <h4>${hr}</h4>
          <img src="${icon}" alt="${item.weather[0].description}" />
          <p><strong>${item.main.temp.toFixed(0)}°</strong></p>
        </div>`;
      hourlyCards.insertAdjacentHTML('beforeend', card);
    });

  } catch(err) {
    console.error(err);
    errorMessage.textContent = err.message;
    errorMessage.classList.remove('hidden');
  } finally {
    spinner.classList.add('hidden');
  }
}

// 7. Evento submit
form.addEventListener('submit', e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeatherAndForecast(city);
});

// 8. Autoubicación al cargar
window.addEventListener('load', ()=>{
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async pos => {
        spinner.classList.remove('hidden');
        const state = await getState(pos.coords.latitude,pos.coords.longitude);
        cityInput.value = '';
        await fetchWeatherAndForecast(state || '');
        spinner.classList.add('hidden');
      },
      ()=>spinner.classList.add('hidden'),
      {timeout:10000}
    );
  }
});
