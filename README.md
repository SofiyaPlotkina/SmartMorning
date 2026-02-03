🌞 Smart Morning 

# Installation & Start
Voraussetzung ist eine installierte TypeScript-Umgebung.
Kompilieren: Wandle den TypeScript-Code in ausführbares JavaScript um:

Bash

```
tsc app.ts

//oder

tsc
```

Starten: Öffne die Datei index.html in einem modernen Webbrowser.

# Smart Logic: Clothing Checklist

🕶️ SUNGLASSES (Sonnenbrille)
UV-Index ≥ 3: Die Sonnenstrahlung ist moderat bis hoch.
ODER Wetter ist "Klar/Sonnig": Der Wetter-Code ist 1000 (Sunny) und es regnet nicht.

🧴 SUNSCREEN (Sonnencreme)
UV-Index ≥ 4: Sobald die Strahlung stärker wird, empfiehlt das System Hautschutz.

🧢 HAT (Kopfbedeckung)
Dieses Item hat eine Doppelfunktion (Sonnenhut im Sommer, Mütze im Winter):
UV-Index ≥ 5: Hohe Sonnenstrahlung (Schutz vor Sonnenstich).
ODER Temperatur < 5°C: Es ist kalt genug für eine Wintermütze.

☂️ UMBRELLA (Regenschirm)
Es regnet aktuell: Gemeldet durch die API oder den manuellen "Rain"-Schalter.
ODER Regenwahrscheinlichkeit > 50%: Die Tagesvorhersage meldet hohes Risiko, selbst wenn es momentan trocken ist.

🧣 SCARF (Schal)
Wind > 15 km/h: Es ist windig.
ODER Temperatur < 10°C: Es wird kühl am Hals.

🧤 GLOVES (Handschuhe)
Temperatur < 4°C: Schutz bei starker Kälte.

💧 WATER (Wasser)
Temperatur > 25°C: Erinnerung an Hydration an heißen Tagen.

👢 BOOTS (Stiefel)
Es schneit aktuell: Gemeldet durch API oder manuellen Switch.
ODER Regenwahrscheinlichkeit > 80%: Schutz bei sehr nassem Wetter oder Matsch.

# System Config (Manual Mode)
Das Dashboard verfügt über ein verstecktes Konfigurationsmenü (Klick auf "SETUP"), das ideal zum Testen aller Zustände ist:
Manual Mode: Aktiviert die manuelle Eingabe und trennt die Verbindung zur Live-API.
Parameter:

- Temp: Simuliert Temperatur (beeinflusst Hat, Scarf, Gloves, Water).
- Wind: Simuliert Windgeschwindigkeit (beeinflusst Scarf).
- UV Index: Simuliert Sonnenstrahlung (beeinflusst Sunglasses, Sunscreen, Hat).
- Rain Chance: Simuliert Wahrscheinlichkeit (beeinflusst Umbrella, Boots).
- Visuals: Manuelle Steuerung von Jahreszeiten, Regen- und Schnee-Animationen.