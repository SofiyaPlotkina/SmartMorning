import requests

url = "https://accounts.spotify.com/api/token"
headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}
data = {
    "grant_type": "client_credentials",
    "client_id": "1602d36c01c14ca4baeb37076594b651",
    "client_secret": "7afd661f11454e59b0f8e2f6b841a768"
}

response = requests.post(url, headers=headers, data=data)

print(response.json())


