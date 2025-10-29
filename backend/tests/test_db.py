import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))) # Go up two folders from this test file and add that directory to Python’s import search path.
#  ye add isliye kiya bcz 'ModuleNotFoundError' araha tha
from backend.app import app, db 
from sqlalchemy import text # for executing plain string 

def test_sqlalchemy_connection():
    try:
        # Flask’s database (db) is tied to the Flask app context — meaning, you can only use db.engine.connect() 
        # when Flask knows which app you’re talking about.So, even though your backend server (app.py) is running,
        # when you run your test script separately, Flask doesn’t automatically know which app instance is active — 
        # hence we used this otherwise error arise
        with app.app_context():  # for db acces  
            with db.engine.connect() as connection:
                result = connection.execute(text("SELECT version();"))
                version = result.fetchone()
                assert version is not None
                print("✅ SQLAlchemy connected to PostgreSQL:", version)
    except Exception as e:
        assert False, f"❌ SQLAlchemy connection failed: {e}"

test_sqlalchemy_connection()

