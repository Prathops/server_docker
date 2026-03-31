# trainee_backend

Node.js and Express backend for the trainee CRUD assignment. It provides REST APIs for item management and stores data in MySQL.

## Tech Stack

- Node.js
- Express
- MySQL (mysql2)
- dotenv
- cors

## Features

- Health endpoint for quick service checks
- CRUD APIs for items
- Layered structure: routes -> controllers -> services -> models -> DB
- Centralized error handling middleware

## Project Structure

```
trainee_backend/
  server.js
  src/
    config/
      db.js
    controllers/
      itemController.js
    routes/
      itemRoutes.js
    services/
      itemService.js
    models/
      itemModel.js
```

## Prerequisites

- Node.js 18+ (recommended)
- MySQL running locally or remotely
- Database with `items` table

## Environment Variables

Create a local `.env` file in this folder with values like:

```
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

Important:
- Do not commit real `.env` files.
- Keep secrets only in local environment or secret manager.

## Install and Run

1. Install dependencies

```bash
npm install
```

2. Start in development mode

```bash
npm run dev
```

3. Start in production mode

```bash
npm start
```

Server default URL:

- http://localhost:5000

## API Endpoints

Base path: `/api/items`

- `GET /api/items` -> get all items
- `POST /api/items` -> create item
- `PUT /api/items/:id` -> update item by id
- `DELETE /api/items/:id` -> delete item by id
- `GET /health` -> health check

### Example Request Body (POST/PUT)

```json
{
  "name": "Sample",
  "description": "Sample description"
}
```

## Response and Error Notes

- Validation errors return HTTP 400
- Not found returns HTTP 404
- Unexpected server errors return HTTP 500

## GitHub Safety Checklist

Before pushing:
- Confirm `.env` is not tracked
- Confirm no credentials in code or docs
- Confirm no key/cert files are tracked
- Review staged files with `git diff --staged`

## Setup On A New PC (Database + Backend)

1. Install required tools

- Node.js 18+
- MySQL Server 8+
- Git

2. Clone backend repository

```bash
git clone <backend-repo-url>
cd trainee_backend
```

3. Create database and table in MySQL

```sql
CREATE DATABASE IF NOT EXISTS trainee_db;
USE trainee_db;

CREATE TABLE IF NOT EXISTS items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Create local environment file

Create `.env` in this folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trainee_db
```

5. Install and start backend

```bash
npm install
npm run dev
```

6. Verify backend is running

- Health check: `http://localhost:5000/health`
- Items API: `http://localhost:5000/api/items`

## Push Backend To Remote Repo (trainee_backend)

Use these steps only after creating an empty GitHub repo named `trainee_backend`.

```bash
git init
git branch -M main
git add .
git status
git diff --staged
git commit -m "Initial backend commit"
git remote add origin <backend-repo-url>
git push -u origin main
```

If `.env` or any secret file appears in staged files, unstage immediately:

```bash
git restore --staged .env
```

## License

For training/assessment use.
