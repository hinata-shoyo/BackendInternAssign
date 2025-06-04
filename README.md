# BackendInternAssign

This is a Node.js and Express backend application for managing tasks in a team environment. It supports real-time notifications using Socket.IO and includes user authentication, task assignment, and task status tracking features.

---

##  1. Project Overview

### This backend provides:

- REST APIs for user registration, login, task creation, assignment, and status updates.
- Real-time Socket.IO events:
  - Notify users when a manager assigns them a task.
  - Notify managers when a user marks a task as completed.
- MongoDB is used as the database.
- JWT is used for user authentication.

###  Assumptions

- At the time of signup, the account is created with the default role of "Manager".
- To create ids for employees, the manager has to create them and provide it to the team
- The employee ids are created with a default password: "password"
- The employees then, can update their passwords

---

## 2. Setup Instructions
### Clone the repository
```bash
git clone https://github.com/hinata-shoyo/BackendInternAssign
```

### Navigate to the api directory
```bash
cd api
```

### Install dependencies

```bash
npm install
```

### Setup .env file
Create a .env file in the api directory with the following variables:
```file
PORT = 5000
MONGO_URI = mongodb://localhost:27017/team-tasks
JWT_SECRET = your_jwt_secret
```
> Replace the values with your Mongodb connection string and your preferred secret.


### Run the backend sever
```bash
npm run dev
```

---
## 3. API Documentation
### Base URL
```
http://localhost:<PORT>
```
> Replace `<PORT>` with the actual port number from your `.env`.

All secured routes require a valid **JWT token** in the request headers: 
Authorization: <your_token>

---

### 1. Authentication
### POST `/signup`

**Description:** Signs the user as a Manager.

**Request Body:**

```json
{
  "name": "user",
  "email": "user@example.com",
  "password": "yourPassword"
}
```
**Response**
```json
{
    "msg": "Manager created successfully",
    "Manager": {
        "name": "user",
        "email": "user@gmail.com",
        "password": "<hashed Password>",
        "role": "Manager",
        "ManagerId": null,
        "_id": "",
        "__v": 0
    },
    "token": ""
}
```


### POST `/login`

**Description:** Logs in a user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```
**Response**
```json
{
    "msg": "success",
    "user": {
        "_id": "",
        "name": "",
        "email": "user@gmail.com",
        "password": "<hashed password>",
        "role": "",
        "ManagerId": ,
        "__v": 0
    },
    "token": ""
}
```
### POST `/resetPassword`

**Description:** resets password of the user.

**Request Body:**

```json
{
  "password": "yourNewPassword"
}
```

### 2. Employee Management



### POST `/createEmployee`

**Description:** used to create account for employees (can only be used by "Manager" role account).

**Protected**

**Request Body:**

```json
{
  "name": "EmployeeName",
  "email": "emp@gmail.com"
}
```

### GET `/getEmployees`

**Description:** resets password of the user.

**Protected**

### POST `/deleteEmployee`

**Description:** delete the Employee account.

**Protected**

**Request Body:**

```json
{
  "id": "<employee-id>",
}
```

### 3. Task Management


### POST `/createTaskForEmployee`

**Description:** Assigns a new task to the employee

**Protected**

**Request Body:**

```json
{
  "id": "<id-of-assignee-employee>",
  "title": "taskName",
  "description": "",
  "dueDate" : "<dateObject>"
}
```

### GET `/getTaskById`

**Description:** returns a list of tasks assigned to that employee

**Protected**


### GET `/getAllTasks`

**Description:** returns a list of all the task that has been created by the Manager (can only be used by Manager)

**Protected**


### POST `/updateTask`

**Description:** updates the body of the Task (title, description, etc)

**Protected**

**Request Body:**

```json
{
  "id": "<id-of-task>",
  "title": "newTitle",
  "description": "newDesc",
  "assignedTo": "<id-of-employee>",
  "dueDate": "dateObject"
}
```

### DELETE `/deleteTask`

**Description:** delete a specific task

**Protected**

**Request Body:**

```json
{
  "id": "<id-of-task>"
}
```

### POST `/updateProgress`

**Description:** toggles the state of task (Completed or not)

**Protected**

**Request Body:**

```json
{
  "id": "<id-of-task>"
}
```
---

## 4. Socket.io Events
- `connect`: when a user signs up or logs in. (receiving event)
- `taskAssigned`: when the Manager assigns a new Task to the Employee (emitting event)
- `taskCompleted`: when the Employee marks the Task as Completed (emitting event)
- `disconnect`: when the user logs out or the connection is interrupted (receiving event)
> should be implemented in the client side for notifications


## 5. Bonus
- have deployed the backend to vercel
```
https://backend-intern-assign-s7p3-git-main-hinatashoyo1s-projects.vercel.app/
```
> but since vercel doesnt allows stay alive connections (websockets), the socket.io logic has been commented out





