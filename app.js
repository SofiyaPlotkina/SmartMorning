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
        let suffix = isRaining ? '_rain' : (isSnowing ? '_snow' : '');
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
            // --- FILTER LOGIK START ---
            // 1. Wir filtern Begriffe wie "Airport" aus
            // 2. Wir nutzen ein Set, um nur eindeutige Namen zu behalten
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
            // --- FILTER LOGIK ENDE ---
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
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&lang=de`);
            if (!response.ok)
                throw new Error();
            const data = await response.json();
            if (weatherTemp)
                weatherTemp.innerText = `${Math.round(data.current.temp_c)}°C`;
            if (weatherDesc)
                weatherDesc.innerText = data.current.condition.text;
            if (weatherIcon) {
                weatherIcon.src = getLocalIconPath(data.current.condition.code, data.current.is_day === 1);
            }
        }
        catch (error) {
            if (weatherDesc)
                weatherDesc.innerText = "Nicht gef.";
            if (weatherTemp)
                weatherTemp.innerText = "--";
            if (weatherIcon)
                weatherIcon.src = 'weather_icons/unknown.png';
        }
    }
    // INITIALISIERUNG
    updateSnowAvailability();
    updateEnvironment();
    fetchWeather();
});
