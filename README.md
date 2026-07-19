#  Full-Stack Project Suite

Four backend-heavy full-stack apps, each in its own folder — real APIs, real database models, real business logic. Built with **Node.js, Express, EJS, and MongoDB**, with jQuery handling frontend interactions.

| # | Project | Folder |
|---|---------|--------|
| 1 | [URL Shortener](#-01--url-shortner) | `01_URL_Shortner/` |
| 2 | [Event Registration System](#-02--event-registration-system) | `02_event-registration-system/` |
| 3 | [Savora — Restaurant Management System](#-03--savora--restaurant-management-system) | `03_restaurant_management_sys/` |
| 4 | [HireLoop — Job Board Platform](#-04--hireloop--job-board-platform) | `04_job_board_platform/` |

---

## 🧱 Tech Stack

`Node.js` · `Express.js` · `EJS` · `MongoDB` + `Mongoose` · `jQuery` · `express-session` · `bcryptjs` · `multer`

---

## 🔗 01 — URL Shortener

Accepts a long URL, generates a unique short url, stores the mapping in MongoDB, and redirects
`/:shortid` straight to the original URL. Includes click analytics and a simple frontend to shorten
and copy links.

| | |
|---|---|
| ![Dashboard](./01_URL_Shortner/images/Dashboard.png) | ![Shorten](./01_URL_Shortner/images/GenerateURL.png) |
| **Home** | **Shorten a URL** |
| ![Signup Page](./01_URL_Shortner/images/signupPage.png) | ![Login page](./01_URL_Shortner/images/loginPage.png) |
| **Click Analytics** | **Redirect in Action** |

---

## 🎟️ 02 — Event Registration System

Backend for managing events and registrations — browse upcoming events, register with basic
details, and an admin side to manage listings and see who's signed up.

---

| Home Page | Event Details |
|-----------|---------------|
| ![Home Page](./02_event-registration-system/images/home.png) | ![Event Details](./02_event-registration-system/images/event.png) |

| Login Page | Signup Page |
|------------|-------------|
| ![Login Page](./02_event-registration-system/images/login.png) | ![Signup Page](./02_event-registration-system/images/signup.png) |
 
---

## 🍽️ 03 — Savora (Restaurant Management System)

Full restaurant ops: live menu with cart, dine-in/takeaway checkout, table reservations, and an
admin console for orders, tables, inventory (auto-deducted on order), and sales reports.

| | |
|---|---|
| ![Landing](./03_restaurant_management_sys/images/landing.png) | ![Why Savora](./03_restaurant_management_sys/images/whySavora.png) |
| **Landing Page** | **Why Savora** |
| ![About](./03_restaurant_management_sys/images/about.png) | ![Order Menu](./03_restaurant_management_sys/images/orderManu.png) |
| **About** | **Order Menu** |
| ![Reserve Table](./03_restaurant_management_sys/images/reservTable.png) | ![Order Success](./03_restaurant_management_sys/images/landing.png) |
| **Reserve Table** | **Home** |
| ![Admin Dashboard](./03_restaurant_management_sys/images/adminDashboard.png) | ![Admin Reports](./03_restaurant_management_sys/images/adminReport.png) |
| **Admin Dashboard** | **Admin Reports** |
| ![Manage Menu](./03_restaurant_management_sys/images/manageMenu.png) | ![Manage Table](./03_restaurant_management_sys/images/manageTable.png) |
| **Manage Menu** | **Manage Tables** |


📄 [Full project README →](./03_restaurant_management_sys/README.md)

---

## 💼 04 — HireLoop (Job Board Platform)

Employers post jobs, candidates search and apply with resume uploads, and both sides track
application status from a dashboard — plus an admin panel for platform-wide stats.

| | |
|---|---|
| ![Landing](./04_job_board_platform/images/landing.png) | ![Job Listings](./04_job_board_platform/images/jobListings.png) |
| **Landing Page** | **Job Listings** |
| ![Job Details](./04_job_board_platform/images/jobDetails.png) | ![Apply Form](./04_job_board_platform/images/applyForm.png) |
| **Job Details** | **Apply with Resume** |
| ![Employer Dashboard](./04_job_board_platform/images/employerDashboard.png) | ![Post Job](./04_job_board_platform/images/postJob.png) |
| **Employer Dashboard** | **Post a Job** |
| ![Candidate Dashboard](./04_job_board_platform/images/candidateDashboard.png) | ![Application Status](./04_job_board_platform/images/applicationStatus.png) |
| **Candidate Dashboard** | **Application Tracking** |
| ![Admin Panel](./04_job_board_platform/images/adminPanel.png) | ![Reports](./04_job_board_platform/images/reports.png) |
| **Admin Panel** | **Reports & Stats** |

📄 [Full project README →](./04_job_board_platform/README.md)

---
Each project is a complete, working app wired to real MongoDB data — no placeholder responses.