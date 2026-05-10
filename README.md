# Human Resource Management System
This is a modern, enterprise-grade Human Resource Management System (HRMS) designed to streamline organizational HR operations. It features a clean, professional dashboard for administrators and a portal for employees, facilitating efficient management of personnel, attendance, and leave requests.

## Features

### Authentication
- Secure Login/Logout functionality.
- Role-based access control (Admin/Employee).

### Dashboard (Role-Based)
- **Admin:** Organizational metrics including Employee Count, Attendance Summary, and Pending Leave Requests.
- **Employee:** Personalized portal for quick access to attendance and leave requests.

### Employee Management (Admin Only)
- Comprehensive Employee Directory.
- Add, Edit, and Delete employee profiles.
- filter by Department, Role, or Status.

### Attendance Management
- **Admin:** Bulk marking of employee attendance.
- **Records:** Transparent view of attendance logs for all employees.

### Leave Management
- **Application:** Easy request form for time-off.
- **Admin:** Approve or reject leave applications.
- **Analytics:** Metrics on pending requests, average approval time, and current staff availability.

## Technical Stack

- **Frontend:** React.js, TypeScript, Tailwind CSS, Lucide React, Zustand (State Management)
- **Backend:** Node.js, Express.js, Typescript
- **Database:** MongoDB

## Getting Started

### Prerequisites
- Node.js (v24+)
- MongoDB instance

### Installation

1. Clone the repository.
2. Install dependencies for both `client` and `server`:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables (e.g., `MONGO_URI`, `JWT_SECRET`).
4. Run the development server:
   ```bash
   # In separate terminals
   cd server && npm run dev
   cd client && npm run dev
   ```

## Design Philosophy
- **UI/UX:** Focuses on enterprise SaaS aesthetics using a deep navy primary color (#0F2B8C) and a professional light-gray background (#F5F7FB) for high readability.
- **Responsiveness:** Fully adaptive layout optimized for desktop, tablet, and mobile devices.
- **Usability:** Minimalist, clutter-free interfaces for HR workflow efficiency.
