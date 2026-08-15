import os
import json
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    # Allow DATABASE_URL env var, or fallback to local SQLite database for offline reliability
    default_db = "sqlite:///investify.db"
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", default_db)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        try:
            from models.models import Company, FinancialStatement, User, ForgotPassword, Watchlist
            db.create_all()
            # Seed companies from jsonfiles/companies.json if table is empty
            if Company.query.count() == 0:
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                json_path = os.path.join(base_dir, "jsonfiles", "companies.json")
                if os.path.exists(json_path):
                    with open(json_path, "r", encoding="utf-8") as f:
                        companies_data = json.load(f)
                    for item in companies_data:
                        company = Company(
                            name=item.get("Name"),
                            symbol=item.get("Symbol"),
                            sector=item.get("sector", "Technology"),
                            country=item.get("country"),
                            price_usd=item.get("price (USD)"),
                            marketcap=item.get("marketcap")
                        )
                        db.session.add(company)
                    db.session.commit()
                    print("Seeded companies table from jsonfiles/companies.json successfully!")
        except Exception as e:
            print("Database initialization notice:", e)

