from app.database.connection import database

chat_collection = database["chat_history"]


def save_chat(
    user_email: str,
    role: str,
    message: str,
    created_at,
):
    chat_collection.insert_one(
        {
            "user_email": user_email,
            "role": role,
            "message": message,
            "created_at": created_at,
        }
    )


def get_recent_chat(
    user_email: str,
    limit: int = 6,
):
    chats = list(
        chat_collection.find(
            {
                "user_email": user_email
            },
            {
                "_id": 0
            }
        )
        .sort("created_at", -1)
        .limit(limit)
    )

    chats.reverse()

    return chats