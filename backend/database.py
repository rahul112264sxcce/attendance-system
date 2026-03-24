import psycopg2
import os
from dotenv import load_dotenv
def get_db_connection():
 try:
    load_dotenv()
    host = os.getenv("host")
    database = os.getenv("database")
    user = os.getenv("user")
    password = os.getenv("password")
    port = os.getenv("port")

    conn = psycopg2.connect(
        host=host,
        database=database,
        user=user,
        password=password,
        port=port
    )
    return conn
 except:
      print("database exception occurred") 


#         if conn and _pool:
#             try:
#                 _pool.putconn(conn)
#             except Exception:
#                 pass
