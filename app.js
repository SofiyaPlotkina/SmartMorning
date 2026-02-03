document.addEventListener('DOMContentLoaded', () => {
    console.log('--- System Start: Smart Mirroring OS ---');
    // 1. DOM ELEMENTE SELEKTIEREN
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const seasonSelect = document.getElementById('season-select');
    const rainToggle = document.getElementById('rain-toggle');
    const snowToggle = document.getElementById('snow-toggle');
    const cityInput = document.getElementById('city-input');
    const cityDropdown = document.getElementById('city-dropdown');
    const locationList = document.getElementById('location-list');
    const rainContainer = document.getElementById('rain-container');
    const snowContainer = document.getElementById('snow-container');
    if (!seasonSelect || !rainToggle || !snowToggle || !rainContainer || !snowContainer || !cityInput || !locationList || !cityDropdown) {
        console.error('Kritischer Fehler: UI-Elemente fehlen im HTML.');
        return;
    }
    const snowToggleLabel = snowToggle.parentElement;
    // 2. LOGIK FUNKTIONEN (Umgebung)
    const updateSnowAvailability = () => {
        const isWinter = seasonSelect.value === 'winter';
        if (isWinter) {
            snowToggle.disabled = false;
            if (snowToggleLabel)
                snowToggleLabel.style.opacity = '1';
        }
        else {
            if (snowToggle.checked) {
                snowToggle.checked = false;
                snowContainer.classList.add('hidden');
            }
            snowToggle.disabled = true;
            if (snowToggleLabel)
                snowToggleLabel.style.opacity = '0.5';
        }
    };
    const updateEnvironment = () => {
        const season = seasonSelect.value;
        const isRaining = rainToggle.checked;
        const isSnowing = snowToggle.checked;
        let suffix = '';
        if (isRaining)
            suffix = '_rain';
        else if (isSnowing)
            suffix = '_snow';
        const fileName = `bg_${season}${suffix}.png`;
        document.body.style.backgroundImage = `url('images/${fileName}')`;
        rainContainer.classList.toggle('hidden', !isRaining);
        snowContainer.classList.toggle('hidden', !isSnowing);
    };
    // 3. EVENT LISTENER (UI)
    seasonSelect.addEventListener('change', () => { updateSnowAvailability(); updateEnvironment(); });
    rainToggle.addEventListener('change', () => { if (rainToggle.checked)
        snowToggle.checked = false; updateEnvironment(); });
    snowToggle.addEventListener('change', () => { if (snowToggle.checked)
        rainToggle.checked = false; updateEnvironment(); });
    if (settingsBtn && settingsModal && closeModalBtn) {
        settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
        closeModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    }
    // --- GEFILTERTE LOGIK FÜR DAS DROPDOWN ---
    cityInput.addEventListener('click', () => {
        if (cityInput.value.length >= 3) {
            locationList.classList.remove('hidden');
        }
    });
    document.addEventListener('click', (e) => {
        if (!cityDropdown.contains(e.target)) {
            locationList.classList.add('hidden');
        }
    });
    async function fetchSuggestions(query) {
        if (query.length < 3) {
            locationList.classList.add('hidden');
            return;
        }
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`);
            const locations = await response.json();
            locationList.innerHTML = '';
            const uniqueNames = new Set();
            const filteredLocations = locations.filter((loc) => {
                const name = loc.name;
                const isAirport = name.toLowerCase().includes('airport');
                const isDuplicate = uniqueNames.has(name);
                if (!isAirport && !isDuplicate) {
                    uniqueNames.add(name);
                    return true;
                }
                return false;
            });
            if (filteredLocations.length > 0) {
                filteredLocations.forEach((loc) => {
                    const li = document.createElement('li');
                    li.textContent = loc.name;
                    li.addEventListener('click', () => {
                        cityInput.value = loc.name;
                        locationList.classList.add('hidden');
                        fetchWeather();
                    });
                    locationList.appendChild(li);
                });
                locationList.classList.remove('hidden');
            }
            else {
                locationList.classList.add('hidden');
            }
        }
        catch (e) {
            console.error("Autocomplete Fehler", e);
        }
    }
    cityInput.addEventListener('input', (e) => {
        const target = e.target;
        fetchSuggestions(target.value);
    });
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchWeather();
            locationList.classList.add('hidden');
            cityInput.blur();
        }
    });
    // 4. WEATHER WIDGET LOGIC
    const API_KEY = 'ad0adc3f94b44bf9bad135212262301';
    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherDesc = document.getElementById('weather-desc');
    function getLocalIconPath(code, isDay) {
        const basePath = 'weather_icons/';
        let filename = 'unknown.png';
        if (code === 1000)
            filename = isDay ? 'sunny.png' : 'clear_night.png';
        else if (code === 1003)
            filename = isDay ? 'partly_cloudy.png' : 'partly_cloudy_night.png';
        else if ([1006, 1009].includes(code))
            filename = 'cloudy.png';
        else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(code))
            filename = 'rain.png';
        else if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(code))
            filename = 'snow.png';
        else if ([1273, 1276, 1279, 1282].includes(code))
            filename = 'storm.png';
        else if ([1030, 1135, 1147].includes(code))
            filename = 'fog.png';
        return basePath + filename;
    }
    async function fetchWeather() {
        const city = cityInput.value || 'Leipzig';
        try {
            // WICHTIG: Änderung auf 'forecast.json', um Regenwahrscheinlichkeit & UV Forecast zu bekommen
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no&lang=de`);
            if (!response.ok)
                throw new Error();
            const data = await response.json();
            const current = data.current;
            const forecastDay = data.forecast.forecastday[0].day; // Vorhersage für heute
            // --- 1. EXISTING WEATHER WIDGET ---
            if (weatherTemp)
                weatherTemp.innerText = `${Math.round(current.temp_c)}°C`;
            if (weatherDesc)
                weatherDesc.innerText = current.condition.text;
            if (weatherIcon) {
                weatherIcon.src = getLocalIconPath(current.condition.code, current.is_day === 1);
            }
            // --- 2. ENVIRONMENT AUTO SETUP ---
            const detectedSeason = calculateSeason(data.location.localtime, data.location.lat);
            seasonSelect.value = detectedSeason;
            // Regen/Schnee Codes prüfen
            const rainCodes = [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276];
            const snowCodes = [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264, 1279, 1282];
            let isRaining = rainCodes.includes(current.condition.code);
            let isSnowing = snowCodes.includes(current.condition.code);
            if (isSnowing && detectedSeason !== 'winter') {
                isSnowing = false;
                isRaining = true;
            }
            rainToggle.checked = isRaining;
            snowToggle.checked = isSnowing;
            updateSnowAvailability();
            updateEnvironment();
            // --- 3. CLOTHING CHECKLIST LOGIC ---
            updateClothingChecklist(current, forecastDay, isRaining, isSnowing);
        }
        catch (error) {
            console.error(error);
            // Error Handling wie gehabt...
        }
    }
    function calculateSeason(localtime, lat) {
        const date = new Date(localtime);
        const month = date.getMonth();
        const hemisphere = lat > 0 ? 'northern' : 'southern';
        // Einfache saisonale Zuordnung
        if (hemisphere === 'northern') {
            if (month >= 2 && month <= 4)
                return 'spring';
            if (month >= 5 && month <= 7)
                return 'summer';
            if (month >= 8 && month <= 10)
                return 'autumn';
            return 'winter';
        }
        else {
            if (month >= 2 && month <= 4)
                return 'autumn';
            if (month >= 5 && month <= 7)
                return 'winter';
            if (month >= 8 && month <= 10)
                return 'spring';
            return 'summer';
        }
    }
    // Neue Funktion für die Checkliste
    function updateClothingChecklist(current, forecast, isRaining, isSnowing) {
        // Datenpunkte
        const uvIndex = current.uv; // UV Index aktuell
        const windKph = current.wind_kph; // Wind km/h
        const tempC = current.temp_c;
        const chanceOfRain = forecast.daily_chance_of_rain; // Regenwahrscheinlichkeit in %
        // Logik für Items
        // Sonnenbrille: Wenn UV > 3 oder Wetter "Sonnig" (Code 1000)
        const needSunglasses = uvIndex >= 3 || current.condition.code === 1000;
        // Sonnencreme: Wenn UV > 4
        const needSunscreen = uvIndex >= 4;
        // Hut: Wenn UV sehr hoch ODER es sehr kalt ist (Mütze)
        // Wir nehmen hier Logik für "Kopfbedeckung allgemein"
        const needHat = uvIndex >= 5 || tempC < 5;
        // Regenschirm: Wenn es regnet ODER Regenwahrscheinlichkeit > 50%
        const needUmbrella = isRaining || chanceOfRain > 50;
        // Schal: Wenn es windig ist (> 15kmh) ODER kalt (< 10 Grad)
        const needScarf = windKph > 15 || tempC < 10;
        // Helper Funktion zum Umschalten der UI
        const toggleItem = (id, active) => {
            const el = document.getElementById(id);
            if (!el)
                return;
            const checkbox = el.querySelector('.pixel-checkbox');
            // Checkbox Status
            if (active) {
                checkbox === null || checkbox === void 0 ? void 0 : checkbox.classList.add('checked');
                el.classList.remove('inactive');
            }
            else {
                checkbox === null || checkbox === void 0 ? void 0 : checkbox.classList.remove('checked');
                el.classList.add('inactive'); // Optional: Text ausgrauen
            }
        };
        toggleItem('item-sunglasses', needSunglasses);
        toggleItem('item-sunscreen', needSunscreen);
        toggleItem('item-hat', needHat);
        toggleItem('item-umbrella', needUmbrella);
        toggleItem('item-scarf', needScarf);
    }
    fetchWeather();
});
