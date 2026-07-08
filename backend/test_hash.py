from app.security.auth import hash_password, verify_password

password = "123456"

hashed = hash_password(password)

print("Hash:", hashed)
print("Doğrulama:", verify_password(password, hashed))