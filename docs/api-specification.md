# MANI Aerospace — API Specification

Base URL: `/api`

## Authentication

| Method | Endpoint       | Purpose        |
| ------ | -------------- | -------------- |
| POST   | `/auth/login`  | Admin login    |
| GET    | `/auth/me`     | Verify session |
| POST   | `/auth/logout` | Logout         |

## Public Content

| Method | Endpoint           | Purpose              |
| ------ | ------------------ | -------------------- |
| GET    | `/news`            | Get published news   |
| GET    | `/content/home`    | Get homepage content |
| GET    | `/content/mission` | Get mission content  |

## Admin News

| Method | Endpoint           | Purpose       |
| ------ | ------------------ | ------------- |
| GET    | `/admin/news`      | List all news |
| POST   | `/admin/news`      | Create news   |
| PUT    | `/admin/news/{id}` | Update news   |
| DELETE | `/admin/news/{id}` | Delete news   |

## Admin Content

| Method | Endpoint           | Purpose         |
| ------ | ------------------ | --------------- |
| PUT    | `/content/home`    | Update homepage |
| PUT    | `/content/mission` | Update mission  |

## Security

Admin endpoints require authentication.

Note: Confirm the `/api` prefix with the client before finalizing.
