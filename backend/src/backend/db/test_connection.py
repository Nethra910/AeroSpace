from sqlalchemy import text
from backend.db.session import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("TiDB connection successful:", result.scalar())
except Exception as e:
    print("Database connection failed:", e)