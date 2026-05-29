import requests

# Register user
requests.post("http://127.0.0.1:5000/api/auth/register", json={
    "name": "Test User",
    "email": "testchat@test.com",
    "password": "password123"
})

# Login user
login_resp = requests.post("http://127.0.0.1:5000/api/auth/login", json={
    "email": "testchat@test.com",
    "password": "password123"
})

token = login_resp.json().get("token")

# Chat
chat_resp = requests.post("http://127.0.0.1:5000/api/chat", json={
    "message": "I am feeling very sad today"
}, headers={
    "Authorization": f"Bearer {token}"
})

print(chat_resp.status_code)
print(chat_resp.json())
