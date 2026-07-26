from datetime import datetime, timedelta

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/login"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def verify_access_token(token: str):

    try:

        print("\n" + "=" * 60)
        print("🔐 VERIFYING JWT TOKEN")
        print("=" * 60)

        print("Token:")
        print(token)

        print("\nSECRET_KEY:")
        print(settings.SECRET_KEY)

        print("\nALGORITHM:")
        print(settings.ALGORITHM)

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        print("\n✅ TOKEN VERIFIED SUCCESSFULLY")
        print("Payload:")
        print(payload)

        print("=" * 60 + "\n")

        return payload

    except Exception as e:

        print("\n" + "=" * 60)
        print("❌ JWT VERIFICATION FAILED")
        print("=" * 60)

        print("Error Type:")
        print(type(e).__name__)

        print("\nError Message:")
        print(str(e))

        print("=" * 60 + "\n")

        return None