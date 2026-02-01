document.addEventListener('DOMContentLoaded', () => {
    console.log('--- System Start: Smart Mirroring OS ---');

    // 1. DOM ELEMENTE SELEKTIEREN
    
    // UI Buttons & Modal
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // Inputs
    const seasonSelect = document.getElementById('season-select') as HTMLSelectElement;
    const rainToggle = document.getElementById('rain-toggle') as HTMLInputElement;
    const snowToggle = document.getElementById('snow-toggle') as HTMLInputElement;
    
    // Visuelle Container
    const rainContainer = document.getElementById('rain-container');
    const snowContainer = document.getElementById('snow-container');

    // Sicherheits-Check: Abbrechen, falls kritische Elemente fehlen
    if (!seasonSelect || !rainToggle || !snowToggle || !rainContainer || !snowContainer) {
        console.error('Kritischer Fehler: UI-Elemente fehlen im HTML.');
        return;
    }

    // Zugriff auf das Label des Snow-Toggles (für visuelles Ausgrauen)
    const snowToggleLabel = snowToggle.parentElement;


    // 2. LOGIK FUNKTIONEN

    const updateSnowAvailability = () => {
        const isWinter = seasonSelect.value === 'winter';

        if (isWinter) {
            // Aktivieren
            snowToggle.disabled = false;
            if (snowToggleLabel) {
                snowToggleLabel.style.opacity = '1';
                snowToggleLabel.style.cursor = 'pointer';
            }
        } else {
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


    const updateEnvironment = () => {
        const season = seasonSelect.value;
        const isRaining = rainToggle.checked;
        const isSnowing = snowToggle.checked;

        // 1. Dateinamen generieren
        let suffix = '';
        if (isRaining) suffix = '_rain';
        else if (isSnowing) suffix = '_snow';

        const fileName = `bg_${season}${suffix}.png`;
        const imageUrl = `images/${fileName}`;

        // 2. Hintergrund setzen
        document.body.style.backgroundImage = `url('${imageUrl}')`;

        // 3. Overlays umschalten
        rainContainer.classList.toggle('hidden', !isRaining);
        snowContainer.classList.toggle('hidden', !isSnowing);
        
        console.log(`Environment Update: ${fileName}`);
    };


    // 3. EVENT LISTENER

    // A. Saison-Wechsel
    seasonSelect.addEventListener('change', () => {
        updateSnowAvailability(); 
        updateEnvironment();
    });

    // B. Regen-Toggle (Exklusiv-Logik)
    rainToggle.addEventListener('change', () => {
        if (rainToggle.checked) snowToggle.checked = false;
        updateEnvironment();
    });

    // C. Schnee-Toggle (Exklusiv-Logik)
    snowToggle.addEventListener('change', () => {
        if (snowToggle.checked) rainToggle.checked = false;
        updateEnvironment();
    });

    // D. Modal Steuerung
    if (settingsBtn && settingsModal && closeModalBtn) {
        settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
        closeModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.classList.add('hidden');
        });
    }

    // 4. INITIALISIERUNG
    
    updateSnowAvailability();
    updateEnvironment();
});