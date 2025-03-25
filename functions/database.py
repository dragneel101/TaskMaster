import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./taskmaster-2a195-firebase-adminsdk-fbsvc-f4f4130e97.json")
firebase_admin.initialize_app(cred)

# Get Firestore database instance
db = firestore.client()

# Function to add a task
def add_task():
    try:
        task_ref = db.collection("tasks").add({
            "title": "Complete Milestone 1",
            "deadline": "2024-03-10",
            "status": "In Progress"
        })
        print(f"Task added with ID: {task_ref[1].id}")
    except Exception as e:
        print(f"Error adding task: {e}")

# Function to retrieve tasks
def get_tasks():
    try:
        tasks = db.collection("tasks").get()
        for task in tasks:
            print(f"{task.id} => {task.to_dict()}")
    except Exception as e:
        print(f"Error retrieving tasks: {e}")

# Execute functions
add_task()
get_tasks()
