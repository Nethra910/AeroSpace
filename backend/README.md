# MANI Aerospace – Backend API

FastAPI-based REST API for the MANI Aerospace website, providing authentication, news management, and dynamic website content management.

## Tech Stack

- **Python 3.12+**
- **FastAPI** – REST API framework
- **SQLAlchemy** – ORM
- **Alembic** – Database migrations
- **TiDB Cloud** – MySQL-compatible database
- **PyMySQL** – Database driver
- **JWT** – Admin authentication
- **Argon2** – Password hashing
- **Pydantic Settings** – Environment configuration

## Project Structure

```text
backend/
├── migrations/
│   └── versions/
├── src/
│   └── backend/
│       ├── api/
│       │   └── v1/
│       │       ├── endpoints/
│       │       └── router.py
│       ├── core/
│       │   └── config.py
│       ├── db/
│       │   ├── base.py
│       │   └── session.py
│       ├── models/
│       ├── schemas/
│       ├── services/
│       └── main.py
├── .env.example
├── alembic.ini
├── pyproject.toml
├── requirements.txt
├── uv.lock
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nethra910/AeroSpace.git
cd AeroSpace/backend
```

### 2. Create environment configuration

```bash
cp .env.example .env
```

Configure your database URL, admin credentials, JWT secret, and CORS origins in `.env`.

Never commit your actual `.env` file.

### 3. Install dependencies

Install uv if it is not already installed:

```bash
pip install uv
```

Then install project dependencies:

```bash
uv sync
```

### 4. Run database migrations

```bash
uv run alembic upgrade head
```

### 5. Start the development server

```bash
uv run fastapi dev src/backend/main.py
```

The API will be available at:

`http://127.0.0.1:8000`

## API Documentation

Interactive Swagger documentation:

`http://127.0.0.1:8000/docs`

Alternative documentation:

`http://127.0.0.1:8000/redoc`

## API Endpoints

Base URL: `/api/v1`

### Health

| Method | Endpoint  | Access |
| ------ | --------- | ------ |
| GET    | `/health` | Public |

### Authentication

| Method | Endpoint       | Access |
| ------ | -------------- | ------ |
| POST   | `/auth/login`  | Public |
| GET    | `/auth/me`     | Admin  |
| POST   | `/auth/logout` | Admin  |

Login uses form data containing `username` and `password`. It returns a JWT bearer token.

Include the token in protected requests using:

`Authorization: Bearer <access_token>`

The frontend should remove its stored token on logout.

### Public News

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| GET    | `/news/`          | Public |
| GET    | `/news/{news_id}` | Public |

Public endpoints return published news only.

### Admin News

| Method | Endpoint                        | Access |
| ------ | ------------------------------- | ------ |
| GET    | `/admin/news/`                  | Admin  |
| POST   | `/admin/news/`                  | Admin  |
| PUT    | `/admin/news/{news_id}`         | Admin  |
| DELETE | `/admin/news/{news_id}`         | Admin  |
| PATCH  | `/admin/news/{news_id}/publish` | Admin  |

Admin endpoints support news creation, editing, deletion, and publishing/unpublishing.

### Website Content

| Method | Endpoint           | Access |
| ------ | ------------------ | ------ |
| GET    | `/content/home`    | Public |
| PUT    | `/content/home`    | Admin  |
| GET    | `/content/mission` | Public |
| PUT    | `/content/mission` | Admin  |

## Database Management

Check the current migration:

```bash
uv run alembic current
```

Generate a migration after model changes:

```bash
uv run alembic revision --autogenerate -m "describe your changes"
```

Apply migrations:

```bash
uv run alembic upgrade head
```

## Environment Variables

See `.env.example` for the required configuration:

- `TIDB_DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `CORS_ORIGINS`
- `DEBUG`

Keep production credentials in your deployment platform's environment settings.

## Production Startup

After installing dependencies and configuring environment variables:

```bash
uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Set `DEBUG=false` and configure the production frontend origin before deployment.

## Project Notes

- Admin operations are protected using JWT bearer authentication.
- Passwords are verified using Argon2 hashes.
- Database schema changes are managed using Alembic.
- Public website content is accessible without authentication.
- Admin content management requires a valid access token.
