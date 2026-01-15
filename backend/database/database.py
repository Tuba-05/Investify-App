# ============================ Database Configuration ================================================================
# sqlalchemy import
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        "postgresql://postgres.ltjvcxpuxcrnoomavhre:"
        "tubanaushad@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
