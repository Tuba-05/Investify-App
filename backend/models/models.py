from database.database import db

# ==================== MODELS (blueprints of tables) =======================
class User(db.Model):
    __tablename__ = 'users'   # table name in database
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

class ForgotPassword(db.Model):
    __tablename__ = 'forgot_password_details'
    id =  db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    email = db.Column(db.String(120), nullable=False)
    verif_code = db.Column(db.String(6), unique=True, nullable=False)
    generated_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    expired_at = db.Column(db.DateTime, nullable=False)
    no_of_codes_generated = db.Column( db.Integer, default = 0)
    created_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    # already set through sql query 
    # __table_args__ = (
    #     UniqueConstraint('email', 'no_of_codes_generated', name='uix_email_codecount'),
    # )

class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    sector = db.Column(db.String(100))
    country = db.Column(db.String(50), nullable=True)
    symbol = db.Column(db.String(20), nullable=True, unique = True)
    price_usd = db.Column("price(USD)", db.Float, nullable=True)
    marketcap = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

class FinancialStatement(db.Model):
    __tablename__ = 'financial_statement'
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    revenue = db.Column(db.Float, nullable=True)
    profit = db.Column(db.Float, nullable=True)
    income = db.Column(db.Float, nullable=True)
    equity = db.Column(db.Float, nullable=True)
    assets = db.Column(db.Float, nullable=True)
    liabilities = db.Column(db.Float, nullable=True)
    date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

class Watchlist(db.Model):
    __tablename__ = 'watchlist'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    created_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

