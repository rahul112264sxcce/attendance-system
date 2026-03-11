from fastapi import HTTPException
from database import get_db_connection
from utils.dbHelpers import close_db

from fastapi import HTTPException


def create_holiday(data):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check duplicate
        cur.execute(
            """
            SELECT id
            FROM holidays
            WHERE holiday_date = %s
            """,
            (data.holiday_date,),
        )

        existing = cur.fetchone()

        if existing:
            raise HTTPException(
                status_code=400, detail="Holiday already exists for this date"
            )

        # Insert holiday
        cur.execute(
            """
            INSERT INTO holidays (title, holiday_date)
            VALUES (%s, %s)
            RETURNING id
            """,
            (data.title, data.holiday_date),
        )

        holiday_id = cur.fetchone()[0]

        conn.commit()

        return {"message": "Holiday created", "holiday_id": holiday_id}

    except HTTPException:
        raise

    except Exception as e:
        if conn:
            conn.rollback()

        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_db(conn, cur)


def get_all_holidays():

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT id, title, holiday_date
            FROM holidays
            ORDER BY holiday_date
            """
        )

        rows = cur.fetchall()

        holidays = [{"id": r[0], "title": r[1], "holiday_date": r[2]} for r in rows]

        return holidays

    finally:
        close_db(conn, cur)


def delete_holiday(holiday_id: int):

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            DELETE FROM company_holidays
            WHERE id = %s
            """,
            (holiday_id,),
        )

        conn.commit()

        return {"message": "Holiday deleted"}

    except Exception:

        if conn:
            conn.rollback()

        raise HTTPException(status_code=500, detail="Error deleting holiday")

    finally:
        close_db(conn, cur)
