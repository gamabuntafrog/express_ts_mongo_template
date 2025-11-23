# Backend Server

Express.js server with TypeScript and MongoDB (native driver) for authentication.

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your MongoDB connection string and JWT secrets.
   - You can also configure `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`, and `REFRESH_TOKEN_SECRET` for more granular control over token lifetimes.

## Running the Server

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm run build
npm start
```

## API Endpoints

### Public Routes

#### Register
- **POST** `/api/auth/register`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Response:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "<access-token>",
      "accessToken": "<access-token>",
      "refreshToken": "<refresh-token>",
      "user": {
        "id": "...",
        "email": "user@example.com"
      }
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "user@example.com", "password": "password123" }`
- Response:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "<access-token>",
      "accessToken": "<access-token>",
      "refreshToken": "<refresh-token>",
      "user": {
        "id": "...",
        "email": "user@example.com"
      }
    }
  }
  ```

#### Refresh tokens
- **POST** `/api/auth/refresh`
- Body: `{ "refreshToken": "<refresh-token>" }`
- Response:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "token": "<new-access-token>",
      "accessToken": "<new-access-token>",
      "refreshToken": "<new-refresh-token>",
      "user": {
        "id": "...",
        "email": "user@example.com"
      }
    }
  }
  ```

### Protected Routes

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Response: `{ "success": true, "user": { "id": "...", "email": "..." } }`

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent commit messages. Commit messages are automatically validated using commitlint and husky.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
feat(auth): add password reset functionality
fix(validator): remove password min length from login schema
docs(readme): update API endpoint documentation
style(errorHandler): switch to single quotes
refactor(mapper): replace any types with proper TypeScript types
```

### Validation

Commit messages are automatically validated when you commit. If your commit message doesn't follow the conventional commit format, the commit will be rejected with an error message explaining what needs to be fixed.

## Technologies

- Express.js
- TypeScript
- MongoDB (native driver)
- Zod for schema validation
- JWT for authentication
- bcryptjs for password hashing
- Commitlint for commit message validation
- Husky for git hooks

