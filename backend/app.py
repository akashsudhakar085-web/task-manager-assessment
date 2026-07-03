import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from bson import ObjectId
from dotenv import load_dotenv
import certifi

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all domains
CORS(app)

# 1. MongoDB Connection Setup with Error Handling
# First check if MONGO_URI exists in environment variables
MONGO_URI = os.getenv('MONGO_URI')

if not MONGO_URI:
    print("ERROR: MONGO_URI not found in environment variables!")
    print("Make sure you have created a '.env' file in the backend folder")
    print("and it contains: MONGO_URI=your_mongodb_connection_string")
    sys.exit(1)  # Stop the application entirely

print(f"Attempting to connect to MongoDB using URI: {MONGO_URI[:15]}...")

try:
    # Adding a serverSelectionTimeoutMS so it fails fast if MongoDB isn't running
    client = MongoClient(
        MONGO_URI, 
        serverSelectionTimeoutMS=5000,
        tlsCAFile=certifi.where()
    )
    
    # Send a ping to confirm a successful connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
    
except ServerSelectionTimeoutError as err:
    print("ERROR: Could not connect to MongoDB.")
    print("Make sure MongoDB is installed and running on your system, or check your MONGO_URI in the .env file.")
    print(f"Details: {err}")

db = client['taskmanager']
users_collection = db['users']
tasks_collection = db['tasks']


# ---------- Health Check ----------

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'message': 'Task Manager API is running'})


# ---------- Auth Routes ----------

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if JSON was actually provided
        if not data:
            return jsonify({'error': 'Invalid or empty request data'}), 400

        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        # Basic validation
        if not name or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400

        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'error': 'Email already exists'}), 400

        # Create and insert the user
        user = {
            'name': name, 
            'email': email, 
            'password': password
        }
        
        users_collection.insert_one(user)

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        # Proper error handling: print the exact error to the console
        print(f"ERROR in /register endpoint: {str(e)}")
        
        # Return a 500 Internal Server Error to the frontend
        return jsonify({
            'error': 'Internal server error occurred while registering user.',
            'details': str(e)
        }), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = users_collection.find_one({'email': email})

        if not user or user['password'] != password:
            return jsonify({'error': 'Invalid email or password'}), 401

        return jsonify({
            'message': 'Login successful',
            'name': user['name'],
            'email': user['email']
        }), 200

    except Exception as e:
        print(f"ERROR in /login endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error occurred.'}), 500


# ---------- Task Routes ----------

@app.route('/tasks/<email>', methods=['GET'])
def get_tasks(email):
    try:
        tasks = list(tasks_collection.find({'email': email}))
        for task in tasks:
            task['_id'] = str(task['_id'])
        return jsonify(tasks), 200
    except Exception as e:
        print(f"ERROR in GET /tasks endpoint: {str(e)}")
        return jsonify({'error': 'Failed to fetch tasks'}), 500


@app.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        title = data.get('title', '').strip()
        email = data.get('email', '').strip()
        description = data.get('description', '').strip() if data.get('description') else ''
        status = data.get('status', '').strip() if data.get('status') else 'To Do'

        if not title or not email:
            return jsonify({'error': 'Title and email are required'}), 400

        task = {
            'title': title,
            'description': description,
            'status': status,
            'email': email
        }

        result = tasks_collection.insert_one(task)
        task['_id'] = str(result.inserted_id)
        return jsonify(task), 201
    except Exception as e:
        print(f"ERROR in POST /tasks endpoint: {str(e)}")
        return jsonify({'error': 'Failed to create task'}), 500


@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.get_json()
        updated_fields = {}
        
        if 'title' in data: updated_fields['title'] = data['title']
        if 'description' in data: updated_fields['description'] = data['description']
        if 'status' in data: updated_fields['status'] = data['status']

        tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': updated_fields}
        )
        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        print(f"ERROR in PUT /tasks endpoint: {str(e)}")
        return jsonify({'error': 'Failed to update task'}), 500


@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        tasks_collection.delete_one({'_id': ObjectId(task_id)})
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        print(f"❌ ERROR in DELETE /tasks endpoint: {str(e)}")
        return jsonify({'error': 'Failed to delete task'}), 500


# ---------- Run the App ----------

if __name__ == '__main__':
    app.run(debug=True, port=5000)