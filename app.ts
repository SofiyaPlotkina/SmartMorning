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

    // --- HELPER: Hintergrund aktualisieren ---
    // Diese Funktion prüft BEIDE Zustände (Jahreszeit + Regen) und setzt das richtige Bild
    const updateBackground = () => {
        const season = seasonSelect.value;
        const isRaining = rainToggle.checked;
        
        let imageUrl = '';

        if (isRaining) {
            // Logik für Regen-Bilder: "images/bg_spring_rain.png"
            // Wichtig: Hier nutzen wir Unterstriche, wie in deinen Dateinamen
            imageUrl = `images/bg_${season}_rain.png`;
            
            // Regen-Overlay anzeigen
            rainContainer.classList.remove('hidden');
            console.log(`Wetter: Regen (${season})`);
        } else {
            // Logik für normale Bilder: "images/bg-spring.png"
            // Wichtig: Hier nutzen wir Bindestriche
            imageUrl = `images/bg-${season}.png`;
            
            // Regen-Overlay verstecken
            rainContainer.classList.add('hidden');
            console.log(`Wetter: Klar (${season})`);
        }

        // Hintergrund setzen
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    };

    // --- 1. MENÜ LOGIK ---
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

    // --- 2. EVENT LISTENER ---
    
    // Wenn die Jahreszeit geändert wird -> Hintergrund updaten
    seasonSelect.addEventListener('change', () => {
        updateBackground();
    });

    // Wenn der Regen-Schalter betätigt wird -> Hintergrund updaten
    rainToggle.addEventListener('change', () => {
        updateBackground();
    });
    
    // --- INITIALISIERUNG ---
    // Einmal beim Laden ausführen, um den korrekten Startzustand zu haben
    updateBackground();
});