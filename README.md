# User Management Web Application

A simple full-stack user management application with Node.js backend, MariaDB database, and HTML/CSS/JavaScript frontend, all containerized with Docker Compose.

## Features

- **Backend**: RESTful API built with Express.js and a custom ORM
- **Database**: MariaDB for data persistence
- **Frontend**: Simple, modern UI for managing users
- **Docker**: Complete containerization with Alpine-based images

## Project Structure

```
mini_project_tp3/
├── backend/
│   ├── db.js              # Database connection pool
│   ├── orm.js             # Simple ORM for user operations
│   ├── server.js          # Express REST API server
│   ├── init.sql           # Database initialization script
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Backend container configuration
├── frontend/
│   ├── index.html         # Main HTML page
│   ├── style.css          # Styling
│   └── app.js             # Frontend JavaScript
├── docker-compose.yml     # Docker Compose configuration
├── .env                   # Environment variables
└── README.md              # This file
```

## API Endpoints

| Method | Endpoint        | Description            | Request Body                              |
|--------|-----------------|------------------------|-------------------------------------------|
| GET    | `/health`       | Health check           | -                                         |
| GET    | `/users`        | Get all users          | -                                         |
| POST   | `/add`          | Add new user           | `{ name, class, nationality }`            |
| PUT    | `/modify/:id`   | Update user by ID      | `{ name, class, nationality }`            |
| DELETE | `/remove/:id`   | Delete user by ID      | -                                         |

## Database Schema

**users** table:
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(255), NOT NULL)
- `class` (VARCHAR(100))
- `nationality` (VARCHAR(100))
- `created_at` (TIMESTAMP)

## Quick Start

### Prerequisites

- Docker
- Docker Compose

### Installation & Running

1. **Clone or navigate to the project directory**:
   ```bash
   cd mini_project_tp3
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the backend Node.js container (Alpine)
   - Pull MariaDB Alpine image
   - Pull Nginx Alpine image for frontend
   - Create necessary networks and volumes
   - Initialize the database with sample data

3. **Access the application**:
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:3000

### Stopping the Application

```bash
docker-compose down
```

To remove all data (volumes):
```bash
docker-compose down -v
```

## Development

### Backend (Node.js)

The backend uses a custom ORM (`orm.js`) that provides:
- `findAll()` - Get all users
- `findById(id)` - Get user by ID
- `create(userData)` - Create new user
- `update(id, userData)` - Update user
- `delete(id)` - Delete user
- `findBy(field, value)` - Find users by field

### Testing API with curl

**Health check**:
```bash
curl http://localhost:3000/health
```

**Get all users**:
```bash
curl http://localhost:3000/users
```

**Add a user**:
```bash
curl -X POST http://localhost:3000/add \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","class":"A","nationality":"USA"}'
```

**Update a user**:
```bash
curl -X PUT http://localhost:3000/modify/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","class":"B","nationality":"UK"}'
```

**Delete a user**:
```bash
curl -X DELETE http://localhost:3000/remove/1
```

## Environment Variables

Configure in `.env` file:

- `DB_HOST` - Database host (default: mariadb)
- `DB_USER` - Database user (default: root)
- `DB_PASSWORD` - Database password (default: rootpassword)
- `DB_NAME` - Database name (default: userdb)
- `PORT` - Backend port (default: 3000)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MariaDB (Alpine)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Containerization**: Docker, Docker Compose
- **Base Images**: Alpine Linux for minimal footprint

## License

ISC
