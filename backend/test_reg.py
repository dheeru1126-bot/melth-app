import requests
resp = requests.post("http://127.0.0.1:5000/api/auth/register", json={
    "name": "Dheer",
    "email": "test7@test.com",
    "password": "password123"
})
print("STATUS", resp.status_code)
print("BODY", resp.text)
