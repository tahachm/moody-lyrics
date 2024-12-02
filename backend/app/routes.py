from flask import Blueprint, jsonify, request 
from app.models import *

routes = Blueprint('routes', __name__)

@routes.route('/api/mood-frequencies', methods=['GET'])
def mood_frequencies():
    """
    API route to get mood frequencies.
    """
    try:
        data = get_mood_frequencies()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 200

@routes.route('/api/song-frequencies', methods=['GET'])
def song_frequencies():
    """
    API route to get song suggestion frequencies.
    """
    try:
        data = get_song_frequencies()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 200

@routes.route('/api/user-ranks', methods=['GET'])
def user_ranks():
    """
    API route to get user ranks based on recommendations received.
    """
    try:
        data = get_user_ranks()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 200
    

@routes.route('/', methods=['GET'])
def test():
    """
    API route to get user ranks based on recommendations received.
    """
    try:
        return jsonify({"data":"Hello World"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@routes.route('/api/recent-suggestions', methods=['POST'])
def recent_suggestions():
    """
    API route to get recently suggested songs for a user.
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        songs = get_recently_suggested_songs(user_id)
        return jsonify(songs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500