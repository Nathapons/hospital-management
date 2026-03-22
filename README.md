# Hospital Management System

A full-stack application for managing hospital patient records, built with modern web technologies: an **Angular** frontend and a **Go (Gin)** backend interacting with a **PostgreSQL** database.

## 🚀 Tech Stack

- **Frontend:** Angular 21, TypeScript, Tailwind CSS
- **Backend:** Go 1.25, Gin Web Framework
- **Database:** PostgreSQL 16 (via GORM)
- **Architecture:** RESTful API with Swagger documentation

## 📂 Project Structure

```text
hospital-management/
├── client/                 # Angular frontend application
├── server/                 # Go backend application (Gin + GORM)
└── docker-compose.yml      # Docker configuration for PostgreSQL
```

## 🛠️ Getting Started

### 1. Database Setup (PostgreSQL)

The database is managed via Docker Compose. Ensure you have Docker installed.

```bash
docker-compose up -d
```

### 2. Backend Setup (Go)

The backend requires Go 1.25+ and a valid PostgreSQL connection string.

**Environment Variables:**
Create a `.env` file in the `server/` directory based on `.env.example`. A sample configuration:

```env
DATABASE_URL=postgres://hospital_user:hospital_pass@localhost:5432/hospital_db?sslmode=disable
PORT=8080
```

**Running the Server:**
```bash
cd server
# Install dependencies
go mod tidy
# Run the server
go run main.go
# (Optional) Run with hot reload if you have `air` installed
air
```

- **API Base URL:** `http://localhost:8080`
- **Swagger Documentation:** `http://localhost:8080/swagger/index.html`

### 3. Frontend Setup (Angular)

The frontend requires Node.js and npm to be installed.

```bash
cd client
# Install dependencies
npm install
# Start the development server
npm start
```

- **App URL:** `http://localhost:4200`

### Build & Test Commands (Frontend)
```bash
# Build for production
npm run build
# Run tests
npm test
```

## 📖 Development Conventions

### Backend (Go)
- **Framework:** [Gin Gonic](https://github.com/gin-gonic/gin)
- **ORM:** [GORM](https://gorm.io/)
- **Auto-Migration:** The database schema is automatically updated via `DB.AutoMigrate` in `server/database/db.go` (Keep out of business logic).
- **API Documentation:** Generated using [swag](https://github.com/swaggo/swag).
- **Routing:** Handlers are organized in `server/handlers/` and registered in `server/routes/routes.go`.
- **Error Handling:** Always wrap errors with context: `fmt.Errorf("context: %w", err)`. Never ignore errors or use `panic()` in production code.
- **Clean Architecture:** Keep business logic inside `internal/service`.

### Frontend (Angular)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) following mobile-first design without arbitrary pixel variations unless necessary.
- **State/Routing:** Standard Angular Router.
- **Component Pattern:** Rely heavily on `ChangeDetectionStrategy.OnPush`. Keep logic in Services rather than Components.
- **RxJS Patterns:** Prefer the `AsyncPipe` in templates over `.subscribe()` in TypeScript. Use `takeUntilDestroyed` when explicit subscriptions are required.
- **Testing:** [Vitest](https://vitest.dev/)
- **Components:** Organized by pages in `client/src/app/pages/`.
- No `any` allowed! Use strict Typescript typing and write immutable states using `readonly`.

## ⚖️ The "Antigravity" Principle
- Keep your functions small, testable, and focused on Single Responsibility.
- Ensure high performance and low application weight (bundle sizes).
- Make code changes easy to review and simple to revert.
