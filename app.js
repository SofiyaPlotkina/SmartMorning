document.addEventListener('DOMContentLoaded', () => {
    console.log('--- System Start: Smart Mirroring OS ---');
    // =================================================
    // 1. DOM ELEMENTE (ORIGINAL)
    // =================================================
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
    // =================================================
    // 2. HELPER (ORIGINAL)
    // =================================================
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
    // =================================================
    // 3. CORE LOGIC (ORIGINAL)
    // =================================================
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
        const uvIndex = current.uv;
        const windKph = current.wind_kph;
        const tempC = current.temp_c;
        const chanceOfRain = forecast.daily_chance_of_rain;
        const needSunglasses = uvIndex >= 3 || (current.condition.code === 1000 && !isRaining);
        const needSunscreen = uvIndex >= 4;
        const needHat = uvIndex >= 5 || tempC < 5;
        const needUmbrella = isRaining || chanceOfRain > 50;
        const needScarf = windKph > 15 || tempC < 10;
        const needGloves = tempC < 4;
        const needWater = tempC > 25;
        const needBoots = isSnowing || chanceOfRain > 80;
        const toggleItem = (id, active) => {
            const el = document.getElementById(id);
            if (!el)
                return;
            const checkbox = el.querySelector('.pixel-checkbox');
            if (active) {
                checkbox === null || checkbox === void 0 ? void 0 : checkbox.classList.add('checked');
                el.classList.remove('inactive');
            }
            else {
                checkbox === null || checkbox === void 0 ? void 0 : checkbox.classList.remove('checked');
                el.classList.add('inactive');
            }
        };
        toggleItem('item-sunglasses', needSunglasses);
        toggleItem('item-sunscreen', needSunscreen);
        toggleItem('item-hat', needHat);
        toggleItem('item-umbrella', needUmbrella);
        toggleItem('item-scarf', needScarf);
        toggleItem('item-gloves', needGloves);
        toggleItem('item-water', needWater);
        toggleItem('item-boots', needBoots);
    }
    // =================================================
    // 4. MANUAL MODE & API (ORIGINAL)
    // =================================================
    function applyManualSettings() {
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
    // =================================================
    // 5. EVENT LISTENERS & SETUP (ORIGINAL)
    // =================================================
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
        if (btnDown)
            btnDown.addEventListener('click', () => changeVal(-step));
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
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                locationList === null || locationList === void 0 ? void 0 : locationList.classList.add('hidden');
                fetchWeather();
                cityInput.blur();
            }
        });
    }
    // =================================================
    // 6. SPOTIFY INTEGRATION (NEU)
    // =================================================
    // Config
    const SPOTIFY_CLIENT_ID = "1602d36c01c14ca4baeb37076594b651";
    const SPOTIFY_SCOPE = "user-read-currently-playing user-read-playback-state";
    const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
    const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
    const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/player/currently-playing";
    // --- AUTH LOGIC (PKCE) ---
    async function initSpotifyAuth() {
        const redirectUri = window.location.origin + window.location.pathname;
        // Prüfen: Kommen wir von Spotify zurück?
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
            console.log("Spotify: Auth Code erhalten. Tausche gegen Token...");
            window.history.replaceState({}, document.title, redirectUri); // URL bereinigen
            await exchangeCodeForToken(code, redirectUri);
            window.location.reload(); // Refresh für sauberen Start
            return;
        }
        // Token vorhanden?
        const token = localStorage.getItem("spotify_access_token");
        if (!token) {
            console.log("Spotify: Kein Token. Starte Login...");
            // Kurze Pause damit die Seite erst lädt
            setTimeout(() => redirectToSpotify(redirectUri), 1000);
        }
        else {
            console.log("Spotify: Token gefunden. Starte Player.");
            startPlayerLoop();
        }
    }
    async function redirectToSpotify(redirectUri) {
        const verifier = generateRandomString(128);
        const challenge = await generateCodeChallenge(verifier);
        localStorage.setItem("spotify_verifier", verifier);
        const args = new URLSearchParams({
            response_type: "code",
            client_id: SPOTIFY_CLIENT_ID,
            scope: SPOTIFY_SCOPE,
            redirect_uri: redirectUri,
            code_challenge_method: "S256",
            code_challenge: challenge
        });
        window.location.href = `${SPOTIFY_AUTH_URL}?${args.toString()}`;
    }
    async function exchangeCodeForToken(code, redirectUri) {
        const verifier = localStorage.getItem("spotify_verifier");
        if (!verifier)
            return;
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: SPOTIFY_CLIENT_ID,
            code: code,
            redirect_uri: redirectUri,
            code_verifier: verifier
        });
        try {
            const res = await fetch(SPOTIFY_TOKEN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body
            });
            const data = await res.json();
            if (data.access_token)
                saveToken(data);
        }
        catch (e) {
            console.error("Spotify Token Error", e);
        }
    }
    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem("spotify_refresh_token");
        if (!refreshToken) {
            const redirectUri = window.location.origin + window.location.pathname;
            redirectToSpotify(redirectUri);
            return null;
        }
        const body = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: SPOTIFY_CLIENT_ID
        });
        try {
            const res = await fetch(SPOTIFY_TOKEN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body
            });
            const data = await res.json();
            if (data.access_token) {
                saveToken(data);
                return data.access_token;
            }
        }
        catch (e) {
            console.error(e);
        }
        return null;
    }
    function saveToken(data) {
        localStorage.setItem("spotify_access_token", data.access_token);
        const expiresAt = Date.now() + (data.expires_in * 1000);
        localStorage.setItem("spotify_token_expiry", expiresAt.toString());
        if (data.refresh_token)
            localStorage.setItem("spotify_refresh_token", data.refresh_token);
    }
    // --- HELPER CRYPTO ---
    function generateRandomString(length) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    async function generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        const bytes = new Uint8Array(digest);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    // --- PLAYER LOOP & UI ---
    function startPlayerLoop() {
        const vinylWidget = document.querySelector('.vinyl-widget');
        const spotifyLink = document.getElementById('spotify-link');
        const albumArt = document.getElementById('album-art');
        const trackName = document.getElementById('track-name');
        const artistName = document.getElementById('artist-name');
        const checkSpotify = async () => {
            let token = localStorage.getItem("spotify_access_token");
            const expiry = localStorage.getItem("spotify_token_expiry");
            if (expiry && Date.now() > parseInt(expiry)) {
                console.log("Token abgelaufen. Refresh...");
                token = await refreshAccessToken();
            }
            if (!token)
                return;
            try {
                const res = await fetch(SPOTIFY_API_URL, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 204) { // Nichts spielt
                    updateVinylUI(false, null, vinylWidget, trackName, artistName, albumArt, spotifyLink);
                    return;
                }
                if (res.status === 401) { // Token Invalid
                    await refreshAccessToken();
                    return;
                }
                const data = await res.json();
                const isPlaying = data.is_playing && data.currently_playing_type === 'track';
                updateVinylUI(isPlaying, data.item, vinylWidget, trackName, artistName, albumArt, spotifyLink);
            }
            catch (e) {
                console.error("Spotify Fetch Error", e);
            }
        };
        setInterval(checkSpotify, 5000);
        checkSpotify();
    }
    function updateVinylUI(playing, track, widget, txtName, txtArtist, imgArt, link) {
        var _a;
        if (playing && track) {
            widget === null || widget === void 0 ? void 0 : widget.classList.add('is-playing');
            if (txtName)
                txtName.innerText = track.name;
            if (txtArtist)
                txtArtist.innerText = track.artists.map((a) => a.name).join(', ');
            const artUrl = (_a = track.album.images[0]) === null || _a === void 0 ? void 0 : _a.url;
            if (imgArt && imgArt.src !== artUrl)
                imgArt.src = artUrl;
            const url = track.external_urls.spotify;
            if (link)
                link.href = url;
        }
        else {
            widget === null || widget === void 0 ? void 0 : widget.classList.remove('is-playing');
            if (txtName)
                txtName.innerText = "Paused / Offline";
            if (txtArtist)
                txtArtist.innerText = "--";
        }
    }
    // =================================================
    // INITIALIZATION
    // =================================================
    fetchWeather();
    initSpotifyAuth(); // Spotify starten
});
