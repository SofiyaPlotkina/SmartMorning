document.addEventListener('DOMContentLoaded', function () {
    console.log('--- System Start: Smart Mirroring OS ---');
    // 1. DOM ELEMENTE SELEKTIEREN
    // UI Buttons & Modal
    var settingsBtn = document.getElementById('settings-btn');
    var settingsModal = document.getElementById('settings-modal');
    var closeModalBtn = document.getElementById('close-modal-btn');
    // Inputs
    var seasonSelect = document.getElementById('season-select');
    var rainToggle = document.getElementById('rain-toggle');
    var snowToggle = document.getElementById('snow-toggle');
    // Visuelle Container
    var rainContainer = document.getElementById('rain-container');
    var snowContainer = document.getElementById('snow-container');
    // Sicherheits-Check: Abbrechen, falls kritische Elemente fehlen
    if (!seasonSelect || !rainToggle || !snowToggle || !rainContainer || !snowContainer) {
        console.error('Kritischer Fehler: UI-Elemente fehlen im HTML.');
        return;
    }
    // Zugriff auf das Label des Snow-Toggles (für visuelles Ausgrauen)
    var snowToggleLabel = snowToggle.parentElement;
    // 2. LOGIK FUNKTIONEN
    var updateSnowAvailability = function () {
        var isWinter = seasonSelect.value === 'winter';
        if (isWinter) {
            // Aktivieren
            snowToggle.disabled = false;
            if (snowToggleLabel) {
                snowToggleLabel.style.opacity = '1';
                snowToggleLabel.style.cursor = 'pointer';
            }
        }
        else {
            // Deaktivieren & Zurücksetzen
            if (snowToggle.checked) {
                snowToggle.checked = false;
                // Wichtig: Overlay sofort ausblenden, damit es nicht "hängt"
                snowContainer.classList.add('hidden');
            }
            snowToggle.disabled = true;
            if (snowToggleLabel) {
                snowToggleLabel.style.opacity = '0.5';
                snowToggleLabel.style.cursor = 'not-allowed';
            }
        }
    };
    var updateEnvironment = function () {
        var season = seasonSelect.value;
        var isRaining = rainToggle.checked;
        var isSnowing = snowToggle.checked;
        // 1. Dateinamen generieren
        var suffix = '';
        if (isRaining)
            suffix = '_rain';
        else if (isSnowing)
            suffix = '_snow';
        var fileName = "bg_".concat(season).concat(suffix, ".png");
        var imageUrl = "images/".concat(fileName);
        // 2. Hintergrund setzen
        document.body.style.backgroundImage = "url('".concat(imageUrl, "')");
        // 3. Overlays umschalten
        rainContainer.classList.toggle('hidden', !isRaining);
        snowContainer.classList.toggle('hidden', !isSnowing);
        console.log("Environment Update: ".concat(fileName));
    };
    // 3. EVENT LISTENER
    // A. Saison-Wechsel
    seasonSelect.addEventListener('change', function () {
        updateSnowAvailability();
        updateEnvironment();
    });
    // B. Regen-Toggle (Exklusiv-Logik)
    rainToggle.addEventListener('change', function () {
        if (rainToggle.checked)
            snowToggle.checked = false;
        updateEnvironment();
    });
    // C. Schnee-Toggle (Exklusiv-Logik)
    snowToggle.addEventListener('change', function () {
        if (snowToggle.checked)
            rainToggle.checked = false;
        updateEnvironment();
    });
    // D. Modal Steuerung
    if (settingsBtn && settingsModal && closeModalBtn) {
        settingsBtn.addEventListener('click', function () { return settingsModal.classList.remove('hidden'); });
        closeModalBtn.addEventListener('click', function () { return settingsModal.classList.add('hidden'); });
        settingsModal.addEventListener('click', function (e) {
            if (e.target === settingsModal)
                settingsModal.classList.add('hidden');
        });
    }
    // 4. INITIALISIERUNG
    updateSnowAvailability();
    updateEnvironment();
});
