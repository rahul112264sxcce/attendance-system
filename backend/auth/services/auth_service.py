from fastapi import HTTPException
from database import get_db_connection
from utils.dbHelpers import close_db
from psycopg2.extras import RealDictCursor
from utils.token import create_access_token
import bcrypt

def generate_employee_id(cur):
    cur.execute("SELECT COUNT(*) FROM users")
    count = cur.fetchone()[0]
    new_id = f"EMP{count+1:03d}"
    return new_id


def signin_user(email: str, password: str):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, email, password, role
            FROM users
            WHERE email = %s
        """,
            (email,),
        )

        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="Invalid email or password")

        user_id, user_email, db_password, role = user
        
        if db_password.startswith("$2"):
  
            if not bcrypt.checkpw(password.encode('utf-8'), db_password.encode('utf-8')):
                raise HTTPException(status_code=401, detail="Invalid email or password")

        else:
     
            if password != db_password:
                raise HTTPException(status_code=401, detail="Invalid email or password")

        
            hashed_password = bcrypt.hashpw(
                password.encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')

            cur.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                (hashed_password, user_id)
            )
            conn.commit()

        
        token = create_access_token({"user_id": user_id})
        
        return {
            "message": "Signin successful",
            "user_id": user_id,
            "email": user_email,
            "role": role,
            "access_token":token
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)


def create_user(data):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        employee_id = generate_employee_id(cur)

        cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
        user = cur.fetchone()

        if user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        hashed_password = bcrypt.hashpw(
            data.password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        query = """
        INSERT INTO users (employee_id,first_name, last_name, email, password ,role, status)
        VALUES (%s,%s, %s, %s, %s,%s,%s)
        RETURNING id
        """

        cur.execute(
            query,
            (
                employee_id,
                data.firstname,
                data.lastname,
                data.email,
                hashed_password,
                data.role,
                data.status
            ),
        )

        user_id = cur.fetchone()[0]
        conn.commit()
        return {"message": "User created", "id": user_id}

    except HTTPException:
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error")
    finally:
        close_db(conn, cur)


def get_users(current_user):
    user_id = current_user["id"]
    role = current_user["role"]
    
    if role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can access")
    
    conn = None
    cur = None
    try:
     
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if role == "admin":
            cur.execute(
                """
                SELECT *
                FROM users
                ORDER BY created_at ASC  
            """
            )
            users = cur.fetchall()

        elif role == "employee":
            cur.execute(
                """
                SELECT id, employee_id, first_name, last_name, email, role, status
                FROM users
                WHERE id = %s
            """,
                (user_id,),
            )
            users = cur.fetchone()

        else:
            raise HTTPException(status_code=403, detail="Access denied")
        return {"users": users}

    except HTTPException:
        raise
    except Exception as e:
        print(e, "error")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_db(conn, cur)
