from pymongo import MongoClient

from app.config import settings

try:
    client = MongoClient(settings.MONGO_URI)
    client.admin.command("ping")

    print("✅ Connected to MongoDB Atlas!")

    database = client[settings.DATABASE_NAME]

except Exception as e:
    print("❌ MongoDB Connection Failed")
    print(e)
    raise