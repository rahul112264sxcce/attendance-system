from fastapi import HTTPException
from database import get_db_connection
from utils.dbHelpers import close_db

def create_leave_request(user_id, data):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

  
        if data.start_date > data.end_date:
            raise HTTPException(
                status_code=400, detail="Start date cannot be after end date"
            )

        cur.execute(
            """
            SELECT id
            FROM leave_requests
            WHERE user_id = %s
            AND (
                start_date <= %s
                AND end_date >= %s
            )
        """,
            (user_id, data.end_date, data.start_date),
        )

        existing_leave = cur.fetchone()

        if existing_leave:
            raise HTTPException(
                status_code=400,
                detail="You already have a leave request for this period",
            )

        if data.leave_type not in ["maternity_leave", "paternity_leave"]:

            cur.execute(
                """
                SELECT id
                FROM holidays
                WHERE holiday_date BETWEEN %s AND %s
            """,
                (data.start_date, data.end_date),
            )

            holiday = cur.fetchone()

            if holiday:
                raise HTTPException(
                    status_code=400,
                    detail="Leave cannot be applied on company holidays",
                )

        cur.execute(
            """
            INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason)
            VALUES (%s,%s,%s,%s,%s)
        """,
            (user_id, data.leave_type, data.start_date, data.end_date, data.reason),
        )

        conn.commit()

        return {"message": "Leave request submitted"}

    except HTTPException:
        raise

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)


def get_leave_requests(user_id,role):

    conn = get_db_connection()
    cur = conn.cursor()

    if role == "admin":
        cur.execute("""
            SELECT * FROM leave_requests
            ORDER BY created_at DESC
        """)
    else:
        cur.execute("""
            SELECT * FROM leave_requests
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))

    records = cur.fetchall()

    return records

# @router.put("/leave")
# def update_leave_status(leave_id:int, status:str):

#     conn = get_db_connection()
#     cur = conn.cursor()

#     cur.execute("""
#         UPDATE leave_requests
#         SET status = %s
#         WHERE id = %s
#     """, (status, leave_id))

#     conn.commit()

#     return {"message": "Leave status updated"}