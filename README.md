# GenAI Resume Builder

GenAI Resume Builder is a full-stack application that helps candidates prepare for interviews. A user can create an account, submit a job description and personal profile, upload a resume, and receive an AI-generated interview report with questions, skill gaps, a match score, and a preparation plan.

The application also keeps previous reports and can generate a downloadable, AI-created resume PDF from a saved report.

## What The Application Does

1. A user registers or logs in.
2. The backend creates an HTTP cookie containing a JWT.
3. The user submits:
   - A job description
   - A PDF resume
   - A short self-description
4. The backend extracts text from the PDF.
5. Google Gemini generates a structured interview report.
6. The report is saved in MongoDB for the logged-in user.
7. The frontend displays the report in sections:
   - Technical questions
   - Behavioral questions
   - Road map
   - Skill gaps
   - Match score
8. Previous reports can be opened from the Home page.
9. A saved report can be used to generate and download a resume PDF.

## Project Structure

```text
GenAIResumeBuilder/
├── Backend/
│   ├── server.js                 # Starts the Express server
│   ├── package.json
│   └── src/
│       ├── app.js                 # Express app, middleware, and routes
│       ├── config/database/       # MongoDB and Redis configuration
│       ├── controllers/           # Request handlers
│       ├── middlewares/           # Authentication and file upload logic
│       ├── models/                # Mongoose models
│       ├── routes/                # API route definitions
│       └── services/              # Gemini and PDF generation logic
│
├── Frontend/
│   ├── package.json
│   ├── config.js                 # Backend base URL
│   └── src/
│       ├── features/auth/         # Login, registration, and auth state
│       └── features/interview/    # Interview forms, reports, and API calls
│
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB database
- A Google Gemini API key
- A modern browser

Puppeteer downloads and uses a local Chromium browser for PDF generation. The first installation may therefore take a little longer than the other dependencies.

## Installation

Clone the project and install dependencies separately for the backend and frontend.

### Backend

```bash
cd Backend
npm install
```

### Frontend

```bash
cd Frontend
npm install
```

## Environment Variables

Create a file named `.env` inside the `Backend` folder.

#env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
REDIS_URL=redis://localhost:6379
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key


The frontend currently uses this backend URL in `Frontend/config.js`:

#js
export const BASE_URL = "http://localhost:3000";

## Running The Application

Open two terminal windows.

### Start the backend

```bash
cd Backend
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

### Start the frontend

```bash
cd Frontend
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

Open the frontend URL in a browser.

## API Routes

All protected routes require the `token` cookie created during login or registration.

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive the authentication cookie |
| GET | `/api/auth/logout` | Log out and clear the authentication cookie |
| GET | `/api/auth/get-me` | Get the current user |

### Interview Reports

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/interview/generate-report` | Generate and save an interview report |
| GET | `/api/interview/report/:interviewId` | Fetch one report |
| GET | `/api/interview/getAllReports` | Fetch the current user's reports |
| GET | `/api/interview/resume/pdf/:interviewReportId` | Generate and download a resume PDF |

## Generating A Report With Postman

1. Register or log in first.
2. Keep the `token` cookie from the response.
3. Send a `POST` request to:

```text
http://localhost:3000/api/interview/generate-report
```

4. Select **Body > form-data**.
5. Add these fields:

| Key | Type | Value |
| --- | --- | --- |
| `resume` | File | A PDF resume, up to 3 MB |
| `selfDescription` | Text | Your profile or experience summary |
| `jobDescription` | Text | The target job description |

Do not manually set the multipart `Content-Type` header. Postman creates the required boundary automatically.

## Downloading A Resume PDF With Postman

Use the report ID returned after generating a report:

```text
GET http://localhost:3000/api/interview/resume/pdf/<interviewReportId>
```

For example:

```text
GET http://localhost:3000/api/interview/resume/pdf/6a8954d4f6d204c82b6a58d3
```

Keep the login cookie in the request and use Postman's **Send and Download** option. The response is an `application/pdf` file.

## Frontend Commands

Run these commands from the `Frontend` directory.

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

## Backend Commands

Run these commands from the `Backend` directory.

```bash
npm run dev       # Start the backend with nodemon
```

## Important Implementation Notes

- Authentication is cookie-based. Axios is configured with `withCredentials: true` so the browser sends the JWT cookie to the backend.
- Resume uploads are kept in memory by Multer and limited to 3 MB.
- PDF text is extracted with `pdf-parse` before it is sent to Gemini.
- Interview reports are stored using the `interviewReport` Mongoose model.
- Report ownership is checked using the authenticated user's ID.
- Puppeteer converts Gemini-generated HTML into a PDF buffer.
- Redis configuration exists, but Redis connection startup is currently disabled in `Backend/server.js`.

## Troubleshooting

### `Cannot POST /api/interview`

Use the complete report-generation route:

```text
POST /api/interview/generate-report
```

### `Cannot GET /api/interview/resume/pdf/<id>`

Make sure the backend route includes the report ID and that the backend has been restarted after route changes.

### `401 Access denied`

Log in first and make sure the `token` cookie is included in the request. For browser requests, confirm that the frontend and backend are using credentials.

### `404 Interview report not found`

Check that the report ID is valid and belongs to the currently logged-in user.

### `500 Unable to generate resume PDF`

Check the backend terminal for the detailed error. Common causes include a missing Gemini key, a missing report field, a Gemini response problem, or a Puppeteer launch failure.

## Current Scope

This project is actively evolving. The core interview report workflow, authentication, report history, and resume PDF generation are in place. Future improvements can include stronger request validation, better loading and error states, Redis-backed token blacklisting, automated tests, and deployment configuration.
