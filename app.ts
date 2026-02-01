// app.ts

interface BackgroundMap {
    [key: string]: string; 
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Smart Mirroring Pixel OS Interface initialisiert.');
    
    // DOM-Elemente
    const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
    const settingsModal = document.getElementById('settings-modal') as HTMLDivElement;
    const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;
    
    const seasonSelect = document.getElementById('season-select') as HTMLSelectElement;
    const rainToggle = document.getElementById('rain-toggle') as HTMLInputElement;
    const rainContainer = document.getElementById('rain-container') as HTMLDivElement;

    /**
     * Aktualisiert den Hintergrund basierend auf Jahreszeit und Regenstatus.
     * Beachtet die unterschiedliche Namenskonvention: 
     * Regen nutzt Unterstriche (_), klares Wetter Bindestriche (-).
     */
    const updateBackground = () => {
        const season = seasonSelect.value;
        const isRaining = rainToggle.checked;
        
        // Dateipfad-Logik nach Vorgabe der Dateinamen
        const imageUrl = isRaining 
            ? `images/bg_${season}_rain.png` 
            : `images/bg-${season}.png`;

        // Regen-Overlay & Logging
        rainContainer.classList.toggle('hidden', !isRaining);
        console.log(`Wetter: ${isRaining ? 'Regen' : 'Klar'} (${season})`);

        document.body.style.backgroundImage = `url('${imageUrl}')`;
    };

    // Modal-Steuerung
    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

    settingsModal.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    // Event-Listener für Einstellungen
    seasonSelect.addEventListener('change', updateBackground);
    rainToggle.addEventListener('change', updateBackground);
    
    // Initialer Status beim Laden
    updateBackground();
});