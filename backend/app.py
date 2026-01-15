# flask imports
from flask import Flask # to create flask web app
from flask_cors import CORS # in order to resolve different server ports(frontend&backend) connection problems 

# db imports
from database.database import init_db
# routes imports
from routes.auth_routes import auth_bp
from routes.company_routes import company_bp
from routes.watchlist import watchlist_bp
from routes.news import news_bp
from routes.graphs import graph_bp

# other imports
# from threading import Thread

app = Flask(__name__)  # createing flask web application

CORS(app, origins=["http://localhost:5173",  "http://localhost:3000"]) # frontend server 

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
    ''' Run the Flask app ''' 
    app.run(debug=True)

