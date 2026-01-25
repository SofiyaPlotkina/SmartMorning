// app.ts

// Wir definieren einen Typ für unsere Hintergrund-Map, um Typsicherheit zu haben
interface BackgroundMap {
    [key: string]: string; // Ein Objekt, das Strings als Schlüssel und Strings als Werte hat
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Smart Mirroring Pixel OS Interface initialisiert.');
    
    // Elemente referenzieren
    const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
    const settingsModal = document.getElementById('settings-modal') as HTMLDivElement;
    const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
    
    // Inputs
    const seasonSelect = document.getElementById('season-select') as HTMLSelectElement;
    const rainToggle = document.getElementById('rain-toggle') as HTMLInputElement;

    // --- MAPPING: Jahreszeit Wert zu Bilddatei ---
    // Die Schlüssel (links) müssen exakt den 'value'-Attributen 
    // in den <option> Tags im HTML entsprechen.
    const backgrounds: BackgroundMap = {
        'spring': 'images/bg-spring.png',
        'summer': 'images/bg-summer.png',
        'autumn': 'images/bg-autumn.png',
        'winter': 'images/bg-winter.png'
    };


    // --- Event Listener ---

    // 1. Modal Öffnen/Schließen
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

    // --- LOGIK: Jahreszeit ändern ---
    
    seasonSelect.addEventListener('change', (e) => {
        // Wir holen uns das Select-Element, das das Event ausgelöst hat
        const target = e.target as HTMLSelectElement;
        // Wir holen den ausgewählten Wert (z.B. "autumn")
        const selectedSeason = target.value;

        console.log(`Versuche Jahreszeit zu ändern auf: ${selectedSeason}`);

        // Wir prüfen, ob wir für diesen Wert einen Eintrag in unserer Map haben
        if (backgrounds[selectedSeason]) {
            // Wir setzen das neue Hintergrundbild auf dem body-Tag
            // Die Syntax `url('...')` ist wichtig für CSS.
            document.body.style.backgroundImage = `url('${backgrounds[selectedSeason]}')`;
            console.log('Hintergrund erfolgreich geändert.');
        } else {
            console.error(`Fehler: Kein Hintergrundbild für '${selectedSeason}' definiert.`);
        }
    });

    // --- Placeholder Logik: Regen ---
    rainToggle.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const status = target.checked ? 'AN' : 'AUS';
        console.log(`Regen ist nun: ${status} (Logik folgt später)`);
    });
});