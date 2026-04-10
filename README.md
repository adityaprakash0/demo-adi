# Emergency Blood Finder

A full-stack emergency blood finder application built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Folder Structure

```text
.
|-- client
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- context
|   |   |-- pages
|   |   `-- utils
|   |-- package.json
|   `-- tailwind.config.js
|-- server
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   `-- utils
|   `-- package.json
`-- package.json
```

## Features

- User authentication with JWT login and signup
- Donor registration with blood group, availability, and location
- Donor search by blood group and location
- Emergency request creation and tracking
- Admin panel for user and donor management
- Responsive red-white medical themed UI

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment files:

```bash
copy server\\.env.example server\\.env
copy client\\.env.example client\\.env
```

3. Update `server/.env` with your MongoDB connection string and JWT secret.

4. Update `client/.env` with your backend URL and a Google Maps JavaScript API key with Places enabled if you want location autocomplete.

5. Start both apps:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:5000`.

## Google Maps Setup

Add the following to `client/.env` to enable Google Maps-powered location suggestions:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

The key should have access to the Maps JavaScript API and Places API.

## Default Admin

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are present in `server/.env`, the server seeds an admin account on startup.
