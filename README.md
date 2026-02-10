# Event Management System (Frontend)

A React JS frontend for an Event Management System. Built with clean, modern UI components and mock data services.

## Features

- **User**: Browse events, search/filter, view details, book tickets (simulated payment), view dashboard (bookings history), submit feedback.
- **Organizer**: Create and edit events, delete events, view dashboard (my events).
- **Admin**: Approve or reject events, view all events and registered users.
- **Auth**: Simulated Login/Register with role-based access control.

## Tech Stack

- React JS (Vite)
- React Router DOM
- Axios (Mocked)
- CSS (Custom Variables + Flex/Grid)

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Folder Structure

```
src/
 ├── components/       # Reusable UI components (Button, Card, Modal, etc.)
 ├── pages/            # Page components grouped by feature (Auth, User, Organzier, Admin)
 ├── routes/           # Routing configuration (AppRoutes, ProtectedRoute)
 ├── services/         # Mock API services (Auth, Event, Booking)
 ├── data/             # Mock JSON data
 ├── hooks/            # Custom hooks (useAuth)
 └── index.css         # Global styles and variables
```

## Mock Accounts

| Role      | Email                  | Password    |
|-----------|------------------------|-------------|
| User      | user@example.com       | password123 |
| Organizer | organizer@example.com  | password123 |
| Admin     | admin@example.com      | password123 |

## Notes

- This project is **frontend-only**.
- Data is persisted in `localStorage` to simulate a database.
- Refreshing the page retains data (until local storage is cleared).
