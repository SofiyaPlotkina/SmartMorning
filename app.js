// app.ts
document.addEventListener('DOMContentLoaded', function () {
    console.log('Smart Mirroring Pixel OS Interface initialisiert.');
    // --- Elemente referenzieren ---
    var settingsBtn = document.getElementById('settings-btn');
    var settingsModal = document.getElementById('settings-modal');
    var closeModalBtn = document.getElementById('close-modal-btn');
    var seasonSelect = document.getElementById('season-select');
    var rainToggle = document.getElementById('rain-toggle');
    var rainContainer = document.getElementById('rain-container');
    // --- MAPPING: Jahreszeit Wert zu Bilddatei ---
    var backgrounds = {
        'spring': 'images/bg-spring.png',
        'summer': 'images/bg-summer.png',
        'autumn': 'images/bg-autumn.png',
        'winter': 'images/bg-winter.png'
    };
    // --- 1. MENU LOGIK (Öffnen/Schließen) ---
    settingsBtn.addEventListener('click', function () {
        settingsModal.classList.remove('hidden');
    });
    closeModalBtn.addEventListener('click', function () {
        settingsModal.classList.add('hidden');
    });
    settingsModal.addEventListener('click', function (event) {
        if (event.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
    // --- 2. JAHRESZEITEN LOGIK ---
    seasonSelect.addEventListener('change', function (e) {
        var target = e.target;
        var selectedSeason = target.value;
        console.log("Versuche Jahreszeit zu \u00E4ndern auf: ".concat(selectedSeason));
        if (backgrounds[selectedSeason]) {
            document.body.style.backgroundImage = "url('".concat(backgrounds[selectedSeason], "')");
            console.log('Hintergrund erfolgreich geändert.');
        }
        else {
            console.error("Fehler: Kein Hintergrundbild f\u00FCr '".concat(selectedSeason, "' definiert."));
        }
    });
    // --- 3. REGEN TOGGLE LOGIK ---
    var updateRain = function () {
        if (rainToggle.checked) {
            // Checkbox AN -> Regen sichtbar machen (hidden entfernen)
            rainContainer.classList.remove('hidden');
            console.log('Wetter: Regen aktiviert');
        }
        else {
            // Checkbox AUS -> Regen verstecken (hidden hinzufügen)
            rainContainer.classList.add('hidden');
            console.log('Wetter: Klar');
        }
    };
    // Event Listener für Klick auf den Switch
    rainToggle.addEventListener('change', updateRain);
    // Initialen Status prüfen (falls Browser den Haken beim Reload behält)
    updateRain();
});
