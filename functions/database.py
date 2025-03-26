import firebase_admin
from firebase_admin import credentials, firestore
import threading

# -------------------------------
# Singleton Pattern: DatabaseConnection
# -------------------------------
# This class ensures that the Firebase Firestore connection is only initialized once.
# It provides a single shared instance of the Firestore client across the entire application.
class DatabaseConnection:
    _instance = None                   # Static variable to hold the singleton instance
    _lock = threading.Lock()           # Lock for thread-safe singleton creation

    def __init__(self):
        # Prevent direct instantiation
        raise RuntimeError("Use get_instance() instead of creating DatabaseConnection directly")

    @classmethod
    def get_instance(cls):
        """
        Returns a shared singleton instance of the Firestore database client.
        Initializes Firebase app and client if it hasn't been initialized yet.
        """
        with cls._lock:  # Ensure thread-safe instantiation
            if cls._instance is None:
                # Load credentials from Firebase Admin SDK service account key
                cred = credentials.Certificate("./taskmaster-2a195-firebase-adminsdk-fbsvc-f4f4130e97.json")
                
                # Initialize the Firebase app (only once)
                firebase_admin.initialize_app(cred)

                # Create the Firestore client instance and cache it
                cls._instance = firestore.client()

            return cls._instance  # Return the existing or newly created instance

# -------------------------------
# Usage Example: Add Task
# -------------------------------
# Demonstrates how to use the singleton instance of the database
def add_task():
    db = DatabaseConnection.get_instance()
    try:
        task_ref = db.collection("tasks").add({
            "title": "Complete Milestone 4",
            "deadline": "2024-04-10",
            "status": "Pending"
        })
        print(f"✅ Task added with ID: {task_ref[1].id}")
    except Exception as e:
        print(f"❌ Error adding task: {e}")

# -------------------------------
# Usage Example: Get Tasks
# -------------------------------
# Demonstrates retrieving tasks using the singleton database instance
def get_tasks():
    db = DatabaseConnection.get_instance()
    try:
        tasks = db.collection("tasks").get()
        print("📋 Retrieved Tasks:")
        for task in tasks:
            print(f"{task.id} => {task.to_dict()}")
    except Exception as e:
        print(f"❌ Error retrieving tasks: {e}")

# -------------------------------
# Entry point to run demo
# -------------------------------
if __name__ == "__main__":
    add_task()
    get_tasks()
