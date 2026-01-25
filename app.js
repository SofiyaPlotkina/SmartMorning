document.addEventListener('DOMContentLoaded', function () {
    console.log('Smart Mirroring Pixel OS Interface initialisiert.');
    // Elemente referenzieren
    var settingsBtn = document.getElementById('settings-btn');
    var settingsModal = document.getElementById('settings-modal');
    var closeModalBtn = document.getElementById('close-modal-btn');
    // Inputs (für spätere Logik Referenz)
    var seasonSelect = document.getElementById('season-select');
    var rainToggle = document.getElementById('rain-toggle');
    // --- Event Listener ---
    // 1. Modal Öffnen
    settingsBtn.addEventListener('click', function () {
        settingsModal.classList.remove('hidden');
    });
    // 2. Modal Schließen
    closeModalBtn.addEventListener('click', function () {
        settingsModal.classList.add('hidden');
    });
    // Optional: Schließen wenn man außerhalb des Fensters klickt
    settingsModal.addEventListener('click', function (event) {
        if (event.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
    // --- Placeholder Events für spätere Logik ---
    seasonSelect.addEventListener('change', function (e) {
        var target = e.target;
        console.log("Jahreszeit ge\u00E4ndert auf: ".concat(target.value, " (Logik folgt im n\u00E4chsten Schritt)"));
    });
    rainToggle.addEventListener('change', function (e) {
        var target = e.target;
        var status = target.checked ? 'AN' : 'AUS';
        console.log("Regen ist nun: ".concat(status, " (Logik folgt im n\u00E4chsten Schritt)"));
    });
});
