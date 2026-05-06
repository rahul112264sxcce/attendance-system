from fastapi import HTTPException
from auth.models.models import Users
from utils.database import engine, Base,SessionLocal
from utils.token import create_access_token
import bcrypt
from passlib.context import CryptContext
from sqlalchemy import asc, desc

Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_employee_id(db):
    last_user = db.query(Users).order_by(Users.id.desc()).first()

    if not last_user:
        return "EMP001"

    last_id = int(last_user.employee_id.replace("EMP", ""))
    new_id = f"EMP{last_id + 1:03d}"

    return new_id


def signin_user(email: str, password: str):

    db = SessionLocal()

    try:
        user = db.query(Users).filter(Users.email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="Invalid email or password")

        # Denial of Service (DoS) Attack
        MAX_LEN = 72
        safe_password = password[:MAX_LEN]

        if not pwd_context.verify(safe_password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"user_id": user.id})

        return {
            "message": "Login successful",
            "user_id": user.id,
            "email": user.email,
            "role": user.role.value,
            "access_token": token,
        }
        
    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


def create_user(data):
    db = SessionLocal()

    try:
        existing_user = db.query(Users).filter(Users.email == data.email).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = bcrypt.hashpw(
            data.password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        new_user = Users(
            employee_id=generate_employee_id(db),  
            first_name=data.firstname,
            last_name=data.lastname,
            email=data.email,
            password_hash=hashed_password,
            role=data.role,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "Registed successful"}
    
    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        db.close()


def get_users(page,limit, search,order ,current_user):
    db = SessionLocal()

    try:
        if current_user.role.value != "admin":
            raise HTTPException(status_code=403, detail="Only Admin access ")
        
        query = db.query(Users)
        
        if search:
            query = query.filter(
                Users.first_name.ilike(f"%{search}%") | 
                Users.email.ilike(f"%{search}%")
            )
            
        column = Users.created_at  
        
        query = query.order_by(
            asc(column) if order == "asc" else desc(column)
        )
        
        # if hasattr(Users, sort_by):
        #     column = getattr(Users, sort_by)
        #     query = query.order_by(
        #         asc(column) 
        #             if order == "asc" else desc(column) 
        #     )
        
        # limit = 10
        
        total = query.count()
        users = query.offset((page - 1) * limit).limit(limit).all()
        
        total_pages = (total + limit - 1) // limit   
             
        return {
 
            "users": users,
             "pagination": {
                "total": total,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1,
              }
            }

    except HTTPException:
        raise
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


