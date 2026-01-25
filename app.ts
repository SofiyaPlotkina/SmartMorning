// app.ts

interface BackgroundMap {
    [key: string]: string; 
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Smart Mirroring Pixel OS Interface initialisiert.');
    
    // --- Elemente referenzieren ---
    const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
    const settingsModal = document.getElementById('settings-modal') as HTMLDivElement;
    const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
    
    const seasonSelect = document.getElementById('season-select') as HTMLSelectElement;
    const rainToggle = document.getElementById('rain-toggle') as HTMLInputElement;
    const rainContainer = document.getElementById('rain-container') as HTMLDivElement;

    // --- MAPPING: Jahreszeit Wert zu Bilddatei ---
    const backgrounds: BackgroundMap = {
        'spring': 'images/bg-spring.png',
        'summer': 'images/bg-summer.png',
        'autumn': 'images/bg-autumn.png',
        'winter': 'images/bg-winter.png'
    };


    // --- 1. MENU LOGIK (Öffnen/Schließen) ---
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    settingsModal.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    // --- 2. JAHRESZEITEN LOGIK ---
    seasonSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const selectedSeason = target.value;

        console.log(`Versuche Jahreszeit zu ändern auf: ${selectedSeason}`);

        if (backgrounds[selectedSeason]) {
            document.body.style.backgroundImage = `url('${backgrounds[selectedSeason]}')`;
            console.log('Hintergrund erfolgreich geändert.');
        } else {
            console.error(`Fehler: Kein Hintergrundbild für '${selectedSeason}' definiert.`);
        }
    });

    // --- 3. REGEN TOGGLE LOGIK ---
    const updateRain = () => {
        if (rainToggle.checked) {
            // Checkbox AN -> Regen sichtbar machen (hidden entfernen)
            rainContainer.classList.remove('hidden');
            console.log('Wetter: Regen aktiviert');
        } else {
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