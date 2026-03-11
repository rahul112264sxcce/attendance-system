def close_db(conn, cur):
    if cur:
        cur.close()
    if conn:
        conn.close()