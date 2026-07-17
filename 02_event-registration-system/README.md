# 🎉 EventHub - Event Registration System

<p align="center">
  <img src="./public/images/banner.png" alt="EventHub Banner" width="100%">
</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-Templates-B4CA65?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens)

</p>

<p align="center">
A full-stack event registration platform where organizers create events and attendees register seamlessly.
</p>

---

## 📸 Project Screenshots

> Replace these placeholder images with your own screenshots.

| Home Page | Event Details |
|------------|---------------|
| ![](./screenshots/home.png) | ![](./screenshots/event-details.png) |

<br>

| Organizer Dashboard | User Dashboard |
|---------------------|----------------|
| ![](./screenshots/organizer-dashboard.png) | ![](./screenshots/user-dashboard.png) |

---

# ✨ Features

### 👤 Authentication

- Register/Login
- JWT Authentication
- Password Hashing (bcrypt)
- Role-based Authorization
- Secure httpOnly Cookies

### 🎯 Organizer Features

- Create Events
- Update Events
- Delete Events
- View Registrants
- Manage Own Events

### 🙋 Attendee Features

- Browse Events
- Search Events
- Filter by Category
- Register for Events
- Cancel Registration
- Personal Dashboard

### ⚡ System Features

- Capacity Validation
- Secure API
- AJAX-powered UI (jQuery)
- Responsive Interface
- MongoDB Database

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| EJS | View Engine |
| jQuery | AJAX & UI |
| JWT | Authentication |
| bcrypt | Password Hashing |

---

# 📂 Project Structure

```text
EventHub/
│
├── app.js
├── index.js
├── .env
├── package.json
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── registrationController.js
│
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
│
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Registration.js
│
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── registrationRoutes.js
│   └── viewRoutes.js
│
├── views/
│
├── public/
│   ├── css/
│   └── js/
│
└── screenshots/
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/event-registration-system.git

cd event-registration-system
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file.

```env
MONGO_URI=mongodb://127.0.0.1:27017/event_registration_db

PORT=5000

JWT_SECRET=supersecretjwtkey_change_this

JWT_EXPIRES_IN=7d

NODE_ENV=development
```

> If using MongoDB Atlas, replace the `MONGO_URI`.

---

## 4️⃣ Start MongoDB

Skip this if using Atlas.

```bash
mongod
```

---

## 5️⃣ Run Application

Development

```bash
npm run dev
```

Production

```bash
npm start
```

Open

```
http://localhost:5000
```

---

# 🚀 How to Use

## 👤 Register

Visit

```
/register
```

Choose one of the following roles:

- Attendee
- Organizer

---

## 🧑‍💼 Organizer Workflow

```
Login
      ↓
Manage Events
      ↓
Create Event
      ↓
Publish Event
      ↓
View Registrants
```

---

## 🙋 Attendee Workflow

```
Register/Login
       ↓
Browse Events
       ↓
Open Event
       ↓
Register
       ↓
Dashboard
       ↓
Cancel Registration
```

---

# 📡 REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |

---

## Events

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/api/events` | Public |
| GET | `/api/events/:id` | Public |
| POST | `/api/events` | Organizer |
| PUT | `/api/events/:id` | Organizer |
| DELETE | `/api/events/:id` | Organizer |
| GET | `/api/events/organizer/mine` | Organizer |

---

## Registrations

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | `/api/registrations` | User |
| GET | `/api/registrations/my` | User |
| DELETE | `/api/registrations/:id` | User |
| GET | `/api/registrations/event/:eventId` | Organizer |

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-based Authorization
- httpOnly Cookies
- Capacity Validation

---
 

 

# 👨‍💻 Author

**Imdadul Hoque**

Backend Developer

GitHub: **https://github.com/imdad-dev**

---

<p align="center">
Made with ❤️ using Node.js, Express.js and MongoDB
</p>