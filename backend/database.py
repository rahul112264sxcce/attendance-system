import psycopg2
import os
from dotenv import load_dotenv
def get_db_connection():
    load_dotenv()
    host = os.getenv("host")
    database = os.getenv("database")
    user = os.getenv("user")
    password = os.getenv("password")
    port = os.getenv("port")
    print(host)
    conn = psycopg2.connect(
        host=host,
        database=database,
        user=user,
        password=password,
        port=port
    )
    return conn

    

# import os
# from dotenv import load_dotenv
# from psycopg2 import pool

# load_dotenv()
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Rahul%40postgres@localhost:5432/attendance")

# _pool = None
# try:
#     _pool = pool.SimpleConnectionPool(1, 10, dsn=DATABASE_URL)
#     # quick test
#     conn = _pool.getconn()
#     cur = conn.cursor()
#     cur.execute("SELECT 1")
#     cur.close()
#     _pool.putconn(conn)
#     print("✅ PostgreSQL pool created")
# except Exception as e:
#     print("❌ PostgreSQL pool creation failed:", e)


# def get_db():
#     """FastAPI dependency: yields a psycopg2 connection from the pool."""
#     conn = None
#     try:
#         if not _pool:
#             raise RuntimeError("DB pool not initialized")
#         conn = _pool.getconn()
#         yield conn
#     finally:
#         if conn and _pool:
#             try:
#                 _pool.putconn(conn)
#             except Exception:
#                 pass
