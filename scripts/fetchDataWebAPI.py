import requests

# Define your Firebase Function API endpoint
API_URL = "https://api-el2iezsu2q-uc.a.run.app/tasks"

# Function to fetch tasks from the API
def fetch_tasks():
    try:
        response = requests.get(API_URL)  # Send GET request
        response.raise_for_status()  # Raise error if response is not 200 OK
        
        # Print the API response
        tasks = response.json()
        print("Tasks Retrieved Successfully:")
        for task in tasks:
            print(f"Task ID: {task['id']}, Title: {task['title']}, Status: {task['status']}")
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching tasks: {e}")

# Run the function
if __name__ == "__main__":
    fetch_tasks()
