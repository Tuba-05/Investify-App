from flask import Blueprint, jsonify
from database.database import db
from models.models import User, Company, Watchlist

watchlist_bp = Blueprint("watchlist", __name__)


# ================== WATCH-LIST ROUTES ==================
# ************* 1- Get watchlist for a user & displaying daily news *************
@watchlist_bp.route('/watchlist/<int:user_id>', methods=['GET'])
def get_watchlist(user_id):
    ''' Fetch a user's watchlist with user and company details '''
    
    try:
        # Fetch user
        user = db.session.query(User).filter_by(id=user_id).first()
        if not user: # if user not found in DB
            return jsonify({"success": False, "message": "User not found"}), 404

        # Fetch companies in user's watchlist
        companies = (
            db.session.query(Company.id, Company.name)
            .join(Watchlist, Watchlist.company_id == Company.id)
            .filter(Watchlist.user_id == user_id)
            .all()
        )

        if not companies: # if watchlist is empty
            return jsonify({ "success": True, "username": user.name, "companies": [] }) 
        
        company_list = [{ "id": c[0], "c_name": c[1] } for c in companies] # convert to list of dicts 
        print("Successfully fetched watchlist data from DB(watchlist)") # for checking purposes
        return jsonify({ "success": True, "username": user.name, "companies": company_list})

    except Exception as e:
        print("Error fetching watchlist:", str(e))
        return jsonify({"success": False, "message": "Error fetching watchlist"}), 500


# *************** 2- Add/ Remove company from user's watchlist ***************
@watchlist_bp.route('/watchlist/<int:user_id>/<int:company_id>', methods=['POST'])
def toggle_watchlist(user_id, company_id):
    """ Toggle company in user's watchlist (add/remove) & also shows daily NEWS current headlines"""

    existing_entry = Watchlist.query.filter_by(user_id=user_id, company_id=company_id).first() # check if entry already exists

    if existing_entry:
        # Remove from watchlist
        db.session.delete(existing_entry) # delete entry from DB
        db.session.commit() # save in DB
        print("Company removed from watchlist") # for checking purposes
        return jsonify({"success": True, "action": "removed", "message": "Company removed from watchlist"})

    else:
        # Add to watchlist
        new_entry = Watchlist(user_id=user_id, company_id=company_id) # create new watchlist entry
        db.session.add(new_entry) # add in DB
        db.session.commit() # save in DB
        print("Company added to watchlist") # for checking purposes 
        return jsonify({"success": True, "action": "added", "message": "Company added to watchlist"})


