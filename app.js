// app.ts
document.addEventListener('DOMContentLoaded', function () {
    console.log('Smart Mirroring Pixel OS Interface initialisiert.');
    // Elemente referenzieren
    var settingsBtn = document.getElementById('settings-btn');
    var settingsModal = document.getElementById('settings-modal');
    var closeModalBtn = document.getElementById('close-modal-btn');
    // Inputs
    var seasonSelect = document.getElementById('season-select');
    var rainToggle = document.getElementById('rain-toggle');
    // --- MAPPING: Jahreszeit Wert zu Bilddatei ---
    // Die Schlüssel (links) müssen exakt den 'value'-Attributen 
    // in den <option> Tags im HTML entsprechen.
    var backgrounds = {
        'spring': 'images/bg-spring.png',
        'summer': 'images/bg-summer.png',
        'autumn': 'images/bg-autumn.png',
        'winter': 'images/bg-winter.png'
    };
    // --- Event Listener ---
    // 1. Modal Öffnen/Schließen
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
    // --- LOGIK: Jahreszeit ändern ---
    seasonSelect.addEventListener('change', function (e) {
        // Wir holen uns das Select-Element, das das Event ausgelöst hat
        var target = e.target;
        // Wir holen den ausgewählten Wert (z.B. "autumn")
        var selectedSeason = target.value;
        console.log("Versuche Jahreszeit zu \u00E4ndern auf: ".concat(selectedSeason));
        // Wir prüfen, ob wir für diesen Wert einen Eintrag in unserer Map haben
        if (backgrounds[selectedSeason]) {
            // Wir setzen das neue Hintergrundbild auf dem body-Tag
            // Die Syntax `url('...')` ist wichtig für CSS.
            document.body.style.backgroundImage = "url('".concat(backgrounds[selectedSeason], "')");
            console.log('Hintergrund erfolgreich geändert.');
        }
        else {
            console.error("Fehler: Kein Hintergrundbild f\u00FCr '".concat(selectedSeason, "' definiert."));
        }
    });
    // --- Placeholder Logik: Regen ---
    rainToggle.addEventListener('change', function (e) {
        var target = e.target;
        var status = target.checked ? 'AN' : 'AUS';
        console.log("Regen ist nun: ".concat(status, " (Logik folgt sp\u00E4ter)"));
    });
});
