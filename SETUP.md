# PassTheSalt

A full-stack application with a Spring Boot backend and React + TypeScript frontend.

## Project Structure

```
PassTheSalt/
├── backend/              # Spring Boot Maven application
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/passthesalt/
│           │   ├── PassTheSaltApplication.java
│           │   └── controller/
│           │       └── HelloWorldController.java
│           └── resources/
│               └── application.properties
└── frontend/             # React + TypeScript + Vite application
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── App.css
        └── index.css
```

## Backend Setup (Spring Boot)

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### API Endpoints
- `GET /hello` - Returns "Hello World"

## Frontend Setup (React + Vite)

### Prerequisites
- Node.js 16+
- npm or yarn

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## How They Work Together

1. Start the backend server (runs on port 8080)
2. Start the frontend development server (runs on port 3000)
3. The React app will automatically fetch data from the backend's `/hello` endpoint
4. The fetched message will be displayed on the page

The frontend is configured with a proxy in `vite.config.ts` that allows it to communicate with the backend during development.

## Notes

- Both applications run on different ports to avoid conflicts
- CORS is configured in the frontend's Vite config for development
- The backend uses Spring Boot with Spring Web dependency
- The frontend uses React 18, TypeScript, and Vite for fast development

