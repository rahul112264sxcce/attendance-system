from fastapi import HTTPException
from database import get_db_connection
from utils.dbHelpers import close_db
from datetime import datetime


def add_attendence(user_id: int):
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id
            FROM attendance
            WHERE user_id = %s
            AND attendance_date = CURRENT_DATE
        """,
            (user_id,),
        )

        record = cur.fetchone()

        if record:
            raise HTTPException(status_code=400, detail="User already checked in today")

        cur.execute(
            """
            INSERT INTO attendance (user_id, attendance_date, in_time)
            VALUES (%s, CURRENT_DATE, CURRENT_TIMESTAMP)
            RETURNING id
        """,
            (user_id,),
        )

        attendance_id = cur.fetchone()[0]

        conn.commit()

        return {"message": "Check-in successful", "attendance_id": attendance_id}

    except HTTPException:
        raise

    except Exception as e:
        print(e, "e")
        if conn:
            conn.rollback()

        raise HTTPException(status_code=500, detail="Internal server error")

    finally:
        close_db(conn, cur)


def close_attendance(user_id: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        # Get today's attendance
        cur.execute(
            """
            SELECT in_time, out_time
            FROM attendance
            WHERE user_id = %s
            AND attendance_date = CURRENT_DATE
        """,
            (user_id,),
        )

        record = cur.fetchone()

        if not record:
            raise HTTPException(status_code=404, detail="Check-in not found for today")

        in_time, out_time = record

        if out_time is not None:
            raise HTTPException(
                status_code=400, detail="User already checked out today"
            )

        current_time = datetime.now()

        work_hours = (current_time - in_time).total_seconds() / 3600

        if work_hours >= 8:
            status = "present"
        elif work_hours >= 4:
            status = "half_day"
        else:
            status = "absent"

        cur.execute(
            """
            UPDATE attendance
            SET out_time = %s,
                work_hours = %s,
                status = %s
            WHERE user_id = %s
            AND attendance_date = CURRENT_DATE
        """,
            (current_time, work_hours, status, user_id),
        )

        conn.commit()

        return {
            "message": "Check-out successful",
            "work_hours": round(work_hours, 2),
            "status": status,
        }

    except HTTPException:
        raise

    except Exception as e:
        print("ERROR:", e)
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        close_db(conn, cur)

def get_all_attendance(user_id: int):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT attendance_date, in_time, out_time, work_hours, status
            FROM attendance
            WHERE user_id = %s
            AND attendance_date < CURRENT_DATE
            ORDER BY attendance_date
            """,
            (user_id,)
        )

        records = cur.fetchall()

        attendance_list = []

        for row in records:
            attendance_list.append({
                "date": row[0],
                "in_time": row[1],
                "out_time": row[2],
                "work_hours": row[3],
                "status": row[4]
            })

        return attendance_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)
# def get_all_attendance(user_id: int):

#     conn = None
#     cur = None

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor()

#         cur.execute(
#             """
#             SELECT attendance_date, in_time, out_time, work_hours, status
#             FROM attendance
#             WHERE user_id = %s
#             ORDER BY attendance_date
#             """,
#             (user_id,)
#         )

#         records = cur.fetchall()

#         attendance_list = []

#         for row in records:
#             attendance_list.append({
#                 "date": row[0],
#                 "in_time": row[1],
#                 "out_time": row[2],
#                 "work_hours": row[3],
#                 "status": row[4]
#             })

#         return attendance_list

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         close_db(conn, cur)

def get_today_attendance(user_id: int):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT attendance_date, in_time, out_time, work_hours, status
            FROM attendance
            WHERE user_id = %s
            AND attendance_date = CURRENT_DATE
        """,
            (user_id,),
        )

        record = cur.fetchone()

        if not record:
            return {"message": "No attendance"}

        attendance_date = record[0]
        in_time = record[1]
        out_time = record[2]
        work_hours = record[3]
        status = record[4]

        if in_time and not out_time:
            return {
                "date": attendance_date,
                "in_time": in_time,
                "out_time": None,
                "work_hours": None,
                "message": "Checked In",
            }

        return {
            "date": attendance_date,
            "in_time": in_time,
            "out_time": out_time,
            "work_hours": work_hours,
            "message": status,
        }
        
    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)
