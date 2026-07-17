# EventHub — Event Registration System

Node.js + Express + MongoDB (Mongoose) + EJS + jQuery.

## Folder structure
```
index.js            entry point (connects DB, starts server)
app.js               express app setup (middleware, view engine, routes)
config/db.js          MongoDB connection
models/               User, Event, Registration (Mongoose schemas)
controllers/           business logic for auth, events, registrations
routes/                 API routes (/api/...) + view routes (page rendering)
middleware/             auth (JWT protect/authorize), error handler
views/                  EJS pages (home, events, login, register, dashboard, admin/*)
public/css, public/js    styling + jQuery AJAX logic (interactive frontend)
.env                    MONGO_URI, JWT_SECRET, PORT (already filled with local defaults)
```

## 1. Requirements
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## 2. Install dependencies
```
cd event-registration-system
npm install
```

## 3. Configure environment
A `.env` file is already included with local defaults:
```
MONGO_URI=mongodb://127.0.0.1:27017/event_registration_db
PORT=5000
JWT_SECRET=supersecretjwtkey_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
```
If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## 4. Start MongoDB locally (skip if using Atlas)
```
mongod
```

## 5. Run the project
```
npm start
```
or with auto-reload during development:
```
npm run dev
```

Visit: **http://localhost:5000**

## 6. How to use it
1. Go to `/register` and create an account.
   - Choose **Attendee** to browse/register for events.
   - Choose **Organizer** to create and manage events.
2. As an Organizer: go to **Manage Events** → **Create Event** → fill the form.
3. As an Attendee: go to **Browse Events** → open an event → **Register Now** → fill the registration form.
4. Go to **My Dashboard** to view or **cancel** your registrations.
5. Organizers can view each event's registrant list from **Manage Events → Registrations**.

## API Endpoints (for reference/testing with Postman)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | - | Register user/organizer |
| POST | /api/auth/login | - | Login |
| POST | /api/auth/logout | - | Logout |
| GET | /api/events | - | List events (supports ?search, ?category) |
| GET | /api/events/:id | - | Event details |
| POST | /api/events | organizer | Create event |
| PUT | /api/events/:id | organizer (owner) | Update event |
| DELETE | /api/events/:id | organizer (owner) | Delete event |
| GET | /api/events/organizer/mine | organizer | My created events |
| POST | /api/registrations | user | Register for an event |
| GET | /api/registrations/my | user | My registrations |
| DELETE | /api/registrations/:id | user (owner) | Cancel registration |
| GET | /api/registrations/event/:eventId | organizer (owner) | View event's registrants |

## Notes
- Auth uses JWT stored in an httpOnly cookie (also returned in the JSON response).
- Passwords are hashed with bcrypt.
- Capacity is enforced — an event stops accepting registrations once full.
- All code already syntax-checked and the Express app boots successfully; you just need a running MongoDB to fully test end-to-end.
