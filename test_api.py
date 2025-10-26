import requests

url = "http://127.0.0.1:5000/add_user"

data = {
    "username": "Nabeel",
    "email": "nabeel@example.com",
    "password": "12345"
}

response = requests.post(url, json=data)
print(response.json())

