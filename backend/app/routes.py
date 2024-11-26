from flask import Blueprint, jsonify
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
        return jsonify({"error": str(e)}), 500

@routes.route('/api/song-frequencies', methods=['GET'])
def song_frequencies():
    """
    API route to get song suggestion frequencies.
    """
    try:
        data = get_song_frequencies()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route('/api/user-ranks', methods=['GET'])
def user_ranks():
    """
    API route to get user ranks based on recommendations received.
    """
    try:
        data = get_user_ranks()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@routes.route('/', methods=['GET'])
def user_ranks():
    """
    API route to get user ranks based on recommendations received.
    """
    try:
        return jsonify({"data":"Hello World"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500