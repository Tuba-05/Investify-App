import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from flask import Flask
from flask_cors import CORS

from database.database import init_db
from routes.auth_routes import auth_bp
from routes.company_routes import company_bp
from routes.watchlist import watchlist_bp
from routes.news import news_bp
from routes.graphs import graph_bp

app = Flask(__name__)

# Allow CORS for all origins and HTTP methods (handles any port like 5173, 5174, etc.)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Initialize database
init_db(app)

# routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(company_bp, url_prefix="/api/companies")
app.register_blueprint(watchlist_bp, url_prefix="/api/watchlist")
app.register_blueprint(news_bp, url_prefix="/api/news")
app.register_blueprint(graph_bp, url_prefix="/api/analytics")

# ================== 8. HOME ROUTE ==================
@app.route("/")
def home():
    ''' Home route to check if backend is running '''
    return {"status": "ok", "message": "Investify backend is running!"}


# ================== Run the Flask app ===================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
