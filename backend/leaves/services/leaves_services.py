from psycopg2.extras import RealDictCursor
from fastapi import HTTPException
from database import get_db_connection
from utils.dbHelpers import close_db
from datetime import date, timedelta

def create_leave_request(user_id, data):
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()


        if data.start_date > data.end_date:
            raise HTTPException(
                status_code=400,
                detail="Start date cannot be after end date"
            )


        if data.start_date < date.today():
            raise HTTPException(
                status_code=400,
                detail="Leave cannot be requested for past dates"
            )

        cur.execute(
            """
            SELECT id
            FROM leave_requests
            WHERE user_id = %s
            AND status != 'rejected'
            AND start_date <= %s
            AND end_date >= %s
            """,
            (user_id, data.end_date, data.start_date),
        )

        if cur.fetchone():
            raise HTTPException(
                status_code=400,
                detail="You already have a leave request for this period",
            )


        cur.execute(
            """
            INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason)
            VALUES (%s,%s,%s,%s,%s)
            """,
            (
                user_id,
                data.leave_type,
                data.start_date,
                data.end_date,
                data.reason,
            ),
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

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)



        if role == "admin":
            cur.execute(
                """
                SELECT 
                    l.id,
                    u.employee_id,
                    u.first_name,
                    u.last_name,
                    l.leave_type,
                    l.start_date,
                    l.end_date,
                    l.reason,
                    l.status,
                    l.created_at
                FROM leave_requests l
                JOIN users u ON l.user_id = u.id
                ORDER BY l.created_at DESC
                """
            )

        else:
            cur.execute(
                """
                SELECT 
                    id,
                    leave_type,
                    start_date,
                    end_date,
                    reason,
                    status,
                    created_at
                FROM leave_requests
                WHERE user_id = %s
                ORDER BY created_at DESC
                """,
                (user_id,),
            )

        records = cur.fetchall()

        return records

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    finally:
        close_db(conn, cur)
        
        
def update_leave_status(leave_id: int, admin_id: int, status: str):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT user_id, leave_type, start_date, end_date
            FROM leave_requests
            WHERE id = %s
            """,
            (leave_id,),
        )

        leave = cur.fetchone()

        user_id, leave_type, start_date, end_date = leave

        cur.execute(
            """
            UPDATE leave_requests
            SET status=%s, approved_by=%s
            WHERE id=%s
            """,
            (status, admin_id, leave_id),
        )

        if status == "approved":

            current_date = start_date

            while current_date <= end_date:

                cur.execute(
                    """
                    SELECT 1 FROM holidays
                    WHERE holiday_date = %s
                    """,
                    (current_date,),
                )

                holiday = cur.fetchone()

                if not holiday:
                    cur.execute(
                        """
                        INSERT INTO attendance (user_id, attendance_date, status)
                        VALUES (%s,%s,%s)
                        ON CONFLICT (user_id, attendance_date) DO NOTHING
                        """,
                        (user_id, current_date, leave_type),
                    )

                current_date += timedelta(days=1)

        conn.commit()

        return {"message": f"Leave {status} successfully"}

    finally:
        close_db(conn, cur)




# def create_leave_request(user_id, data):
#     print(user_id, data)
#     conn = None
#     cur = None

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor()

#         if data.start_date > data.end_date:
#             raise HTTPException(
#                 status_code=400, detail="Start date cannot be after end date"
#             )

#         if data.start_date < date.today():
#             raise HTTPException(
#                 status_code=400, detail="Leave cannot be requested for past dates"
#             )

#         # Check overlapping leave
#         cur.execute(
#             """
#             SELECT id
#             FROM leave_requests
#             WHERE user_id = %s
#             AND status != 'rejected'
#             AND start_date <= %s
#             AND end_date >= %s
#             """,
#             (user_id, data.end_date, data.start_date),
#         )

#         if cur.fetchone():
#             raise HTTPException(
#                 status_code=400,
#                 detail="You already have a leave request for this period",
#             )

#         # Holiday check
#         if data.leave_type not in ["maternity_leave", "paternity_leave"]:

#             cur.execute(
#                 """
#                 SELECT id
#                 FROM holidays
#                 WHERE holiday_date BETWEEN %s AND %s
#                 """,
#                 (data.start_date, data.end_date),
#             )

#             if cur.fetchone():
#                 raise HTTPException(
#                     status_code=400,
#                     detail="Leave cannot be applied on company holidays",
#                 )

#         # Insert leave
#         cur.execute(
#             """
#         INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason)
#         VALUES (%s,%s,%s,%s,%s)
#         """,
#             (
#                 user_id,
#                 data.leave_type,
#                 data.start_date,
#                 data.end_date,
#                 data.reason,
#             ),
#         )

#         conn.commit()

#         return {"message": "Leave request submitted"}

#     except HTTPException:
#         raise

#     except Exception as e:
#         if conn:
#             conn.rollback()
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         close_db(conn, cur)


# def get_leave_requests(user_id,role):

#     conn = get_db_connection()
#     cur = conn.cursor()

#     if role == "admin":
#         cur.execute("""
#             SELECT * FROM leave_requests
#             ORDER BY created_at DESC
#         """)
#     else:
#         cur.execute("""
#             SELECT * FROM leave_requests
#             WHERE user_id = %s
#             ORDER BY created_at DESC
#         """, (user_id,))

#     records = cur.fetchall()

#     return records

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
