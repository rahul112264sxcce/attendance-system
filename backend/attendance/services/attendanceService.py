from fastapi import HTTPException
from database import get_db_connection
from utils.dbHelpers import close_db
from datetime import datetime, timedelta


def _get_user_start_date(cur, user_id: int):
    cur.execute(
        """
        SELECT created_at::date
        FROM users
        WHERE id = %s
        """,
        (user_id,),
    )

    user_row = cur.fetchone()

    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")

    return user_row[0]


def _get_holiday_map(cur, start_date, end_date):
    cur.execute(
        """
        SELECT holiday_date, title
        FROM holidays
        WHERE holiday_date BETWEEN %s AND %s
        """,
        (start_date, end_date),
    )

    return {str(row[0]): row[1] for row in cur.fetchall()}


def _get_leave_map(cur, user_id: int, start_date, end_date):
    cur.execute(
        """
        SELECT leave_type, start_date, end_date
        FROM leave_requests
        WHERE user_id = %s
        AND status = 'approved'
        AND start_date <= %s
        AND end_date >= %s
        """,
        (user_id, end_date, start_date),
    )

    leave_map = {}

    for leave_type, leave_start, leave_end in cur.fetchall():
        current_date = max(leave_start, start_date)
        final_date = min(leave_end, end_date)

        while current_date <= final_date:
            leave_map[str(current_date)] = leave_type
            current_date += timedelta(days=1)

    return leave_map

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
            status = "half day"
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

        start_date = _get_user_start_date(cur, user_id)
        end_date = datetime.today().date()

        cur.execute(
            """
            SELECT attendance_date, in_time, out_time, work_hours, status
            FROM attendance
            WHERE user_id = %s
            AND attendance_date BETWEEN %s AND %s
            ORDER BY attendance_date
            """,
            (user_id, start_date, end_date)
        )

        records = cur.fetchall()
        holiday_map = _get_holiday_map(cur, start_date, end_date)
        leave_map = _get_leave_map(cur, user_id, start_date, end_date)

        attendance_map = {
            str(row[0]): {
                "in_time": row[1],
                "out_time": row[2],
                "work_hours": row[3],
                "status": row[4]
            }
            for row in records
        }

        result = []
        current = start_date

        while current <= end_date:
            date_str = str(current)

            if date_str in attendance_map:
                data = attendance_map[date_str]
            elif date_str in holiday_map:
                data = {
                    "in_time": None,
                    "out_time": None,
                    "work_hours": 0,
                    "status": "holiday",
                    "holiday_name": holiday_map[date_str],
                }
            elif date_str in leave_map:
                data = {
                    "in_time": None,
                    "out_time": None,
                    "work_hours": 0,
                    "status": leave_map[date_str],
                }
            else:

                data = {
                    "in_time": None,
                    "out_time": None,
                    "work_hours": 0,
                    "status": "absent"
                }

            result.append({
                "date": date_str,
                **data
            })

            current += timedelta(days=1)

        return result

    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

    finally:
        close_db(conn, cur)


def get_today_attendance(user_id: int):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check holiday
        cur.execute(
            """
            SELECT title
            FROM holidays
            WHERE holiday_date = CURRENT_DATE
            """
        )

        holiday = cur.fetchone()

        if holiday:
            return {
                "date": str(datetime.now().date()),
                "message": "Holiday",
                "holiday_name": holiday[0]
            }

        cur.execute(
            """
            SELECT leave_type
            FROM leave_requests
            WHERE user_id = %s
            AND status = 'approved'
            AND CURRENT_DATE BETWEEN start_date AND end_date
            """,
            (user_id,),
        )

        approved_leave = cur.fetchone()

        if approved_leave:
            return {
                "date": str(datetime.now().date()),
                "message": approved_leave[0]
            }

        # Check attendance
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

        # No attendance
        if not record:
            return {
                "date": str(datetime.now().date()),
                "message": "absent"
            }

        attendance_date, in_time, out_time, work_hours, status = record

        if in_time and not out_time:
            return {
                "date": attendance_date,
                "in_time": in_time,
                "out_time": None,
                "work_hours": None,
                "message": "Checked In"
            }

        return {
            "date": attendance_date,
            "in_time": in_time,
            "out_time": out_time,
            "work_hours": work_hours,
            "message": status
        }

    except HTTPException:
        raise

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
#         print(records, "records")

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
        
        
# def get_today_attendance(user_id: int):

#     conn = None
#     cur = None

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor()

#         today = datetime.now().date()

#         # ✅ 1. Check Holiday
#         cur.execute(
#             """
#             SELECT title
#             FROM holidays
#             WHERE holiday_date = %s
#             """,
#             (today,)
#         )

#         holiday = cur.fetchone()

#         if holiday:
#             return {
#                 "date": str(today),
#                 "message": "holiday",
#                 "holiday_name": holiday[0]
#             }

#         # ✅ 2. Check Approved Leave
#         cur.execute(
#             """
#             SELECT id
#             FROM leave_requests
#             WHERE user_id = %s
#             AND %s BETWEEN start_date AND end_date
#             AND status = 'approved'
#             """,
#             (user_id, today)
#         )

#         leave = cur.fetchone()

#         if leave:
#             return {
#                 "date": str(today),
#                 "message": "leave"
#             }

#         # ✅ 3. Check Attendance
#         cur.execute(
#             """
#             SELECT attendance_date, in_time, out_time, work_hours, status
#             FROM attendance
#             WHERE user_id = %s
#             AND attendance_date = %s
#             """,
#             (user_id, today),
#         )

#         record = cur.fetchone()

#         # ❌ No attendance → ABSENT
#         if not record:
#             return {
#                 "date": str(today),
#                 "message": "absent"
#             }

#         attendance_date, in_time, out_time, work_hours, status = record

#         # ✅ Checked in but not checked out
#         if in_time and not out_time:
#             return {
#                 "date": str(attendance_date),
#                 "in_time": in_time,
#                 "out_time": None,
#                 "work_hours": None,
#                 "message": "checked in"
#             }

#         # ✅ Completed attendance
#         return {
#             "date": str(attendance_date),
#             "in_time": in_time,
#             "out_time": out_time,
#             "work_hours": work_hours,
#             "message": status  # present / half day / absent
#         }

#     except HTTPException:
#         raise

#     except Exception as e:
#         print("ERROR:", e)
#         raise HTTPException(status_code=500, detail="Internal server error")

#     finally:
#         close_db(conn, cur)



# def get_today_attendance(user_id: int):

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
#             AND attendance_date = CURRENT_DATE
#         """,
#             (user_id,),
#         )

#         record = cur.fetchone()

#         if not record:
#             return {"message": "No attendance"}

#         attendance_date = record[0]
#         in_time = record[1]
#         out_time = record[2]
#         work_hours = record[3]
#         status = record[4]

#         if in_time and not out_time:
#             return {
#                 "date": attendance_date,
#                 "in_time": in_time,
#                 "out_time": None,
#                 "work_hours": None,
#                 "message": "Checked In",
#             }

#         return {
#             "date": attendance_date,
#             "in_time": in_time,
#             "out_time": out_time,
#             "work_hours": work_hours,
#             "message": status,
#         }
        
#     except HTTPException:
#         raise

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         close_db(conn, cur)


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
#             AND attendance_date < CURRENT_DATE
#             ORDER BY attendance_date
#             """,
#             (user_id,)
#         )

#         records = cur.fetchall()
#         print(records, 'records')
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
