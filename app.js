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
    // --- HELPER: Hintergrund aktualisieren ---
    // Diese Funktion prüft BEIDE Zustände (Jahreszeit + Regen) und setzt das richtige Bild
    var updateBackground = function () {
        var season = seasonSelect.value;
        var isRaining = rainToggle.checked;
        var imageUrl = '';
        if (isRaining) {
            // Logik für Regen-Bilder: "images/bg_spring_rain.png"
            // Wichtig: Hier nutzen wir Unterstriche, wie in deinen Dateinamen
            imageUrl = "images/bg_".concat(season, "_rain.png");
            // Regen-Overlay anzeigen
            rainContainer.classList.remove('hidden');
            console.log("Wetter: Regen (".concat(season, ")"));
        }
        else {
            // Logik für normale Bilder: "images/bg-spring.png"
            // Wichtig: Hier nutzen wir Bindestriche
            imageUrl = "images/bg-".concat(season, ".png");
            // Regen-Overlay verstecken
            rainContainer.classList.add('hidden');
            console.log("Wetter: Klar (".concat(season, ")"));
        }
        // Hintergrund setzen
        document.body.style.backgroundImage = "url('".concat(imageUrl, "')");
    };
    // --- 1. MENÜ LOGIK ---
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
    // --- 2. EVENT LISTENER ---
    // Wenn die Jahreszeit geändert wird -> Hintergrund updaten
    seasonSelect.addEventListener('change', function () {
        updateBackground();
    });
    // Wenn der Regen-Schalter betätigt wird -> Hintergrund updaten
    rainToggle.addEventListener('change', function () {
        updateBackground();
    });
    // --- INITIALISIERUNG ---
    // Einmal beim Laden ausführen, um den korrekten Startzustand zu haben
    updateBackground();
});
