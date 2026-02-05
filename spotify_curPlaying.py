import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Deine Zugangsdaten
CLIENT_ID = "1602d36c01c14ca4baeb37076594b651"
CLIENT_SECRET = "38cab5e459024b7e9925e32cb9607670"
REDIRECT_URI = "http://127.0.0.1:8000/callback"

# Welches Recht fordern wir an? (Scope)
SCOPE = "user-read-currently-playing"

# Verbindung herstellen (öffnet automatisch den Browser beim ersten Mal)
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope=SCOPE
))

# Daten abrufen: Der aktuell laufende Track
current_track = sp.current_user_playing_track()

if current_track is not None and current_track['is_playing']:
    track = current_track['item']
    artist_name = track['artists'][0]['name']
    track_name = track['name']
    print(f"Du hörst gerade: {track_name} von {artist_name}")
else:
    print("Aktuell wird keine Musik abgespielt.")