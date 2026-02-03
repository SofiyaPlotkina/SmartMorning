document.addEventListener('DOMContentLoaded', () => {
    console.log('--- System Start: Smart Mirroring OS ---');
    // 1. DOM ELEMENTE
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    // Inputs
    const seasonSelect = document.getElementById('season-select');
    const rainToggle = document.getElementById('rain-toggle');
    const snowToggle = document.getElementById('snow-toggle');
    const manualModeToggle = document.getElementById('manual-mode-toggle');
    const manualControlsContainer = document.getElementById('manual-controls-container');
    // Manual Inputs (IDs müssen exakt mit HTML übereinstimmen!)
    const manualTempInput = document.getElementById('manual-temp-input');
    const manualWindInput = document.getElementById('manual-wind-input');
    const manualUVInput = document.getElementById('manual-uv-input');
    const manualRainProbInput = document.getElementById('manual-rain-prob-input');
    // Search & Visuals
    const cityInput = document.getElementById('city-input');
    const cityDropdown = document.getElementById('city-dropdown');
    const locationList = document.getElementById('location-list');
    const rainContainer = document.getElementById('rain-container');
    const snowContainer = document.getElementById('snow-container');
    // Widgets
    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const API_KEY = 'ad0adc3f94b44bf9bad135212262301';
    // 2. HELPER
    function updateSnowAvailability() {
        const isWinter = seasonSelect.value === 'winter';
        const snowToggleLabel = snowToggle.parentElement;
        if (isWinter) {
            snowToggle.disabled = false;
            if (snowToggleLabel)
                snowToggleLabel.style.opacity = '1';
        }
        else {
            if (snowToggle.checked) {
                snowToggle.checked = false;
                snowContainer === null || snowContainer === void 0 ? void 0 : snowContainer.classList.add('hidden');
            }
            snowToggle.disabled = true;
            if (snowToggleLabel)
                snowToggleLabel.style.opacity = '0.5';
        }
    }
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
    function calculateSeason(localtime, lat) {
        const date = new Date(localtime);
        const month = date.getMonth() + 1;
        const isNorthern = lat >= 0;
        if (isNorthern) {
            if (month >= 3 && month <= 5)
                return 'spring';
            if (month >= 6 && month <= 8)
                return 'summer';
            if (month >= 9 && month <= 11)
                return 'autumn';
            return 'winter';
        }
        else {
            if (month >= 3 && month <= 5)
                return 'autumn';
            if (month >= 6 && month <= 8)
                return 'winter';
            if (month >= 9 && month <= 11)
                return 'spring';
            return 'summer';
        }
    }
    // 3. CORE LOGIC
    function updateDashboard(current, forecastDay, season) {
        if (weatherTemp)
            weatherTemp.innerText = `${Math.round(current.temp_c)}°C`;
        if (weatherDesc)
            weatherDesc.innerText = current.condition.text;
        if (weatherIcon)
            weatherIcon.src = getLocalIconPath(current.condition.code, current.is_day === 1);
        const isRaining = rainToggle.checked;
        const isSnowing = snowToggle.checked;
        let suffix = isRaining ? '_rain' : (isSnowing ? '_snow' : '');
        document.body.style.backgroundImage = `url('images/bg_${season}${suffix}.png')`;
        rainContainer === null || rainContainer === void 0 ? void 0 : rainContainer.classList.toggle('hidden', !isRaining);
        snowContainer === null || snowContainer === void 0 ? void 0 : snowContainer.classList.toggle('hidden', !isSnowing);
        updateClothingChecklist(current, forecastDay, isRaining, isSnowing);
    }
    function updateClothingChecklist(current, forecast, isRaining, isSnowing) {
        // 1. Wetterdaten extrahieren
        const uvIndex = current.uv;
        const windKph = current.wind_kph;
        const tempC = current.temp_c;
        const chanceOfRain = forecast.daily_chance_of_rain;
        // 2. Bedingungen definieren
        // Sonnenbrille: UV >= 3 ODER Code 1000 (Sonnig) und kein Regen
        const needSunglasses = uvIndex >= 3 || (current.condition.code === 1000 && !isRaining);
        // Sonnencreme: UV >= 4
        const needSunscreen = uvIndex >= 4;
        // Hut/Mütze: UV >= 5 (Sonnenhut) ODER Temp < 5°C (Wintermütze)
        const needHat = uvIndex >= 5 || tempC < 5;
        // Regenschirm: Regen aktuell ODER Regenwahrscheinlichkeit > 50%
        const needUmbrella = isRaining || chanceOfRain > 50;
        // Schal: Wind > 15 km/h ODER Temp < 10°C
        const needScarf = windKph > 15 || tempC < 10;
        // Handschuhe: Temp < 4°C
        const needGloves = tempC < 4;
        // Wasser: Temp > 25°C
        const needWater = tempC > 25;
        // Stiefel: Schnee aktuell ODER Regenwahrscheinlichkeit > 80%
        const needBoots = isSnowing || chanceOfRain > 80;
        // 3. Helper-Funktion zum Umschalten der UI
        const toggleItem = (id, active) => {
            const el = document.getElementById(id);
            if (!el)
                return; // Falls das HTML Element noch fehlt, Absturz verhindern
            const checkbox = el.querySelector('.pixel-checkbox');
            if (active) {
                checkbox === null || checkbox === void 0 ? void 0 : checkbox.classList.add('checked'); // Rotes X setzen
                el.classList.remove('inactive'); // Volle Deckkraft
            }
            else {
                checkbox === null || checkbox === void 0 ? void 0 : checkbox.classList.remove('checked'); // X entfernen
                el.classList.add('inactive'); // Ausgrauen
            }
        };
        // 4. UI aktualisieren
        toggleItem('item-sunglasses', needSunglasses);
        toggleItem('item-sunscreen', needSunscreen);
        toggleItem('item-hat', needHat);
        toggleItem('item-umbrella', needUmbrella);
        toggleItem('item-scarf', needScarf);
        // Neue Items
        toggleItem('item-gloves', needGloves);
        toggleItem('item-water', needWater);
        toggleItem('item-boots', needBoots);
    }
    // 4. MANUAL MODE & API
    function applyManualSettings() {
        // Safe parsing: Falls Input fehlt, nimm 0
        const temp = manualTempInput ? parseFloat(manualTempInput.value) : 0;
        const wind = manualWindInput ? parseFloat(manualWindInput.value) : 0;
        const uv = manualUVInput ? parseFloat(manualUVInput.value) : 0;
        const rainChance = manualRainProbInput ? parseFloat(manualRainProbInput.value) : 0;
        const isRaining = rainToggle.checked;
        const isSnowing = snowToggle.checked;
        const fakeCurrent = {
            temp_c: temp,
            is_day: 1,
            condition: {
                text: isRaining ? "Manual Rain" : (isSnowing ? "Manual Snow" : "Manual Clear"),
                code: isRaining ? 1183 : (isSnowing ? 1213 : 1000)
            },
            uv: uv,
            wind_kph: wind
        };
        const fakeForecastDay = { daily_chance_of_rain: rainChance };
        updateDashboard(fakeCurrent, fakeForecastDay, seasonSelect.value);
    }
    async function fetchWeather() {
        if (manualModeToggle && manualModeToggle.checked) {
            applyManualSettings();
            return;
        }
        const city = cityInput.value || 'Leipzig';
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no&lang=de`);
            if (!response.ok)
                throw new Error();
            const data = await response.json();
            const detectedSeason = calculateSeason(data.location.localtime, data.location.lat);
            seasonSelect.value = detectedSeason;
            updateSnowAvailability();
            const code = data.current.condition.code;
            const rainCodes = [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246];
            const snowCodes = [1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258];
            let isRaining = rainCodes.includes(code);
            let isSnowing = snowCodes.includes(code);
            if (isSnowing && detectedSeason !== 'winter') {
                isSnowing = false;
                isRaining = true;
            }
            rainToggle.checked = isRaining;
            snowToggle.checked = isSnowing;
            updateDashboard(data.current, data.forecast.forecastday[0].day, detectedSeason);
        }
        catch (error) {
            console.error(error);
        }
    }
    // 5. EVENT LISTENERS & SETUP
    // --- SETUP PIXEL INPUTS (ROBUST) ---
    function setupPixelInput(inputId, upBtnId, downBtnId, step = 1) {
        const input = document.getElementById(inputId);
        const btnUp = document.getElementById(upBtnId);
        const btnDown = document.getElementById(downBtnId);
        if (!input) {
            console.error(`Fehler: Input mit ID '${inputId}' nicht gefunden!`);
            return null;
        }
        const changeVal = (delta) => {
            let val = parseFloat(input.value) || 0;
            val += delta;
            if (inputId !== 'manual-temp-input' && val < 0)
                val = 0;
            input.value = val.toString();
            input.dispatchEvent(new Event('input'));
        };
        if (btnUp)
            btnUp.addEventListener('click', () => changeVal(step));
        else
            console.warn(`Warnung: Button '${upBtnId}' fehlt.`);
        if (btnDown)
            btnDown.addEventListener('click', () => changeVal(-step));
        else
            console.warn(`Warnung: Button '${downBtnId}' fehlt.`);
        input.addEventListener('input', () => {
            if (manualModeToggle.checked)
                applyManualSettings();
        });
        return { input, btnUp, btnDown };
    }
    const tempControls = setupPixelInput('manual-temp-input', 'temp-up-btn', 'temp-down-btn');
    const windControls = setupPixelInput('manual-wind-input', 'wind-up-btn', 'wind-down-btn', 5);
    const uvControls = setupPixelInput('manual-uv-input', 'uv-up-btn', 'uv-down-btn');
    const rainProbControls = setupPixelInput('manual-rain-prob-input', 'rain-prob-up-btn', 'rain-prob-down-btn', 10);
    const setManualControlsState = (active) => {
        const controls = [tempControls, windControls, uvControls, rainProbControls];
        if (manualControlsContainer) {
            manualControlsContainer.style.opacity = active ? '1' : '0.5';
            manualControlsContainer.style.pointerEvents = active ? 'auto' : 'none';
        }
        controls.forEach(ctrl => {
            if (ctrl && ctrl.input) {
                ctrl.input.disabled = !active;
                if (ctrl.btnUp)
                    ctrl.btnUp.disabled = !active;
                if (ctrl.btnDown)
                    ctrl.btnDown.disabled = !active;
            }
        });
    };
    if (manualModeToggle) {
        manualModeToggle.addEventListener('change', () => {
            if (manualModeToggle.checked) {
                setManualControlsState(true);
                applyManualSettings();
            }
            else {
                setManualControlsState(false);
                fetchWeather();
            }
        });
    }
    // Weitere Listener
    seasonSelect.addEventListener('change', () => {
        updateSnowAvailability();
        if (manualModeToggle.checked)
            applyManualSettings();
    });
    rainToggle.addEventListener('change', () => {
        if (rainToggle.checked)
            snowToggle.checked = false;
        if (manualModeToggle.checked)
            applyManualSettings();
    });
    snowToggle.addEventListener('change', () => {
        if (snowToggle.checked)
            rainToggle.checked = false;
        if (manualModeToggle.checked)
            applyManualSettings();
    });
    if (settingsBtn)
        settingsBtn.addEventListener('click', () => settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.classList.remove('hidden'));
    if (closeModalBtn)
        closeModalBtn.addEventListener('click', () => settingsModal === null || settingsModal === void 0 ? void 0 : settingsModal.classList.add('hidden'));
    // Autocomplete & Init
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                locationList === null || locationList === void 0 ? void 0 : locationList.classList.add('hidden');
                fetchWeather();
                cityInput.blur();
            }
        });
    }
    // Init call
    fetchWeather();
});
