import os
from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt,JWTError
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer
from fastapi import Depends, HTTPException
from database import get_db_connection
from utils.dbHelpers import close_db

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEYS")
ALGORITHM = "HS256"
security = HTTPBearer()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=2)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


security = HTTPBearer()


def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security)
):
    conn = None
    cur = None

    try:

        payload = jwt.decode(
            token.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT id, role FROM users WHERE id=%s",
            (user_id,)
        )

        user = cur.fetchone()

        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return {
            "id": user[0],
            "role": user[1]
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    except Exception as e:
        print("TOKEN ERROR:", e)
        raise HTTPException(status_code=500, detail="Internal server error")

    finally:
         close_db(conn, cur)
            
            
# def get_current_user(
#     token: HTTPAuthorizationCredentials = Depends(security)
# ):

#     try:
#         payload = jwt.decode(
#             token.credentials,
#             SECRET_KEY,
#             algorithms=[ALGORITHM]
#         )

#         user_id = payload.get("user_id")
#         conn = get_db_connection()
#         cur = conn.cursor()

#         cur.execute("SELECT id, role FROM users WHERE id=%s",(user_id,))
#         user = cur.fetchone()
#         if not user_id:
#             raise HTTPException(status_code=401, detail="Invalid token")

#         return {
#              "id": user[0],
#             "role": user[1]
#          }
        
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")