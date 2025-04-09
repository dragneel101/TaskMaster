# 🧠 TaskMaster

**TaskMaster** is a productivity-focused web-based application designed to help individuals and teams efficiently manage tasks, set deadlines, track progress, and collaborate in real-time.

---

## 📌 Features

- ✅ **Task Management** – Create, update, delete, and categorize tasks
- ⏰ **Reminders & Notifications** – Get alerts via SMS (Twilio) and push (Firebase Cloud Messaging)
- 📊 **Progress Tracking** – Visual analytics for completed and pending tasks
- 👥 **Collaborative Workspaces** – Assign and manage team-based tasks
- 🔐 **User Roles & Permissions** – Admins, editors, and viewers with access control
- 📁 **File Attachments & Notes** – Enrich tasks with supporting content
- 📄 **Report Generation** – Basic reporting functionality (CSV/text)

---

## 🧱 Architecture

TaskMaster follows the **4+1 View Model**:

### 🔧 Development View
- Frontend: `React.js` SPA
- Backend: `Node.js` with `Express.js` REST API
- API Layers:
  - `Controllers`: Handle HTTP requests
  - `Services`: Business logic
  - `Repositories`: Firebase Firestore access

### 💡 Logical View
- Authentication with Firebase Auth
- Conditional dashboard access based on user role
- CRUD operations on tasks
- Exit via session management

### ⚙️ Process View
- User login → Auth validation → Dashboard → Firestore queries
- Admins trigger report generation → Notification sent

### 🌐 Physical View
- Client: Browser (React app)
- Backend: Node.js API hosted on Firebase or AWS
- Database: Firebase Firestore (real-time sync)
- Notification: Twilio SMS & Firebase Cloud Messaging
- Auth: Firebase Authentication

---

## 🛠️ Technologies Used

| Layer        | Tech Stack                          |
|--------------|--------------------------------------|
| Frontend     | React.js                            |
| Backend      | Node.js, Express.js                 |
| Database     | Firebase Firestore                  |
| Auth         | Firebase Authentication             |
| APIs         | Twilio, Google Calendar API         |
| Hosting      | Firebase / AWS                      |
| DevOps       | Git, GitHub                         |

---

## 🧪 How to Run Locally

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/taskmaster.git
cd taskmaster

 
