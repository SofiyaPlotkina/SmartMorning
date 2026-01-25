document.addEventListener('DOMContentLoaded', () => {
    console.log('Smart Mirroring Pixel OS Interface initialisiert.');
    
    // Elemente referenzieren
    const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
    const settingsModal = document.getElementById('settings-modal') as HTMLDivElement;
    const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
    
    // Inputs (für spätere Logik Referenz)
    const seasonSelect = document.getElementById('season-select') as HTMLSelectElement;
    const rainToggle = document.getElementById('rain-toggle') as HTMLInputElement;

    // --- Event Listener ---

    // 1. Modal Öffnen
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    // 2. Modal Schließen
    closeModalBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    // Optional: Schließen wenn man außerhalb des Fensters klickt
    settingsModal.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    // --- Placeholder Events für spätere Logik ---
    
    seasonSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        console.log(`Jahreszeit geändert auf: ${target.value} (Logik folgt im nächsten Schritt)`);
    });

    rainToggle.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const status = target.checked ? 'AN' : 'AUS';
        console.log(`Regen ist nun: ${status} (Logik folgt im nächsten Schritt)`);
    });
});