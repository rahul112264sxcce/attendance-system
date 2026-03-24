from fastapi import HTTPException
from datetime import date
from database import get_db_connection
from utils.dbHelpers import close_db
from psycopg2.extras import RealDictCursor


def create_wfh_request(user_id, data):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Validate dates
        if data.start_date > data.end_date:
            raise HTTPException(
                status_code=400, detail="Start date cannot be after end date"
            )

        if data.start_date < date.today():
            raise HTTPException(
                status_code=400, detail="WFH cannot be requested for past dates"
            )

        # Prevent overlapping WFH requests
        cur.execute(
            """
            SELECT id
            FROM wfh_requests
            WHERE user_id = %s
            AND status != 'rejected'
            AND start_date <= %s
            AND end_date >= %s
            """,
            (user_id, data.end_date, data.start_date),
        )

        if cur.fetchone():
            raise HTTPException(
                status_code=400, detail="WFH already requested for this period"
            )

        # Insert request
        cur.execute(
            """
            INSERT INTO wfh_requests (user_id, start_date, end_date, reason)
            VALUES (%s,%s,%s,%s)
            """,
            (user_id, data.start_date, data.end_date, data.reason),
        )

        conn.commit()

        return {"message": "WFH request submitted"}

    except HTTPException:
        raise

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)


def get_wfh_requests(user_id, role):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if role == "admin":

            cur.execute(
                """
         SELECT w.id,w.user_id,u.employee_id,u.first_name,u.last_name,w.start_date,w.end_date,w.reason,w.status,w.created_at
         FROM wfh_requests w
         JOIN users u ON w.user_id = u.id
         ORDER BY w.created_at DESC
         """
            )
        # cur.execute(
        #     """
        #     SELECT id, user_id, start_date, end_date, reason, status, created_at
        #     FROM wfh_requests
        #     ORDER BY created_at DESC
        #     """
        # )

        else:

            cur.execute(
                """
                SELECT id, start_date, end_date, reason, status, created_at
                FROM wfh_requests
                WHERE user_id = %s
                ORDER BY created_at DESC
                """,
                (user_id,),
            )

        records = cur.fetchall()

        return records

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)


def update_wfh_status(id: int, status: str):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check request exists
        cur.execute(
            """
            SELECT status
            FROM wfh_requests
            WHERE id = %s
            """,
            (id,),
        )

        record = cur.fetchone()

        if not record:
            raise HTTPException(status_code=404, detail="WFH request not found")

        current_status = record[0]

        if current_status != "pending":
            raise HTTPException(status_code=400, detail="WFH request already processed")

        # Update status
        cur.execute(
            """
            UPDATE wfh_requests
            SET status = %s
            WHERE id = %s
            """,
            (status, id),
        )

        conn.commit()

        return {"message": f"WFH request {status}"}

    except HTTPException:
        raise

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)
