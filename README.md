# CSV Upload Mini-App

A modern web application for uploading, validating, and managing CSV files containing user data. Built with Vue 3, TypeScript, Tailwind CSS, and NestJS.

## 🚀 Features

- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Real-time Validation**: Instant validation of user data with detailed error messages using VeeValidate
- **Inline Editing**: Edit invalid records directly in the interface with form validation
- **CSV Export**: Download all valid users as a CSV file
- **Dry Run Mode**: Test uploads without saving to database
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Architecture**: Streamlined codebase with no unused dependencies
- **Expandable Components**: Collapsible panels for Valid and Invalid Users sections
- **Data Persistence**: Form data automatically saved and restored when panels are closed/reopened

## 🛠️ Tech Stack

### Frontend

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **VeeValidate** for form validation with Yup schemas
- **Fetch** for API communication

### Backend

- **NestJS** framework
- **TypeScript** for type safety
- **Class Validator** for data validation
- **CSV Parse** for CSV processing
- **Multer** for file uploads
- **In-memory Storage** for data persistence during session

## 📋 Requirements

- Node.js 16+
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd CSV-Upload-Mini-App
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Copy environment file for backend
cp .env.example .env
# Edit .env file with your configuration if needed

# Install frontend dependencies
cd ../frontend
npm install

# Copy environment file for frontend
cp .env.example .env
# Edit .env file with your configuration if needed
```

### 3. Start the development servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run start:dev
```

The backend will be available at `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Open your browser

Navigate to `http://localhost:5173` to use the application.

## 📁 Project Structure

```
csv-upload-mini-app/
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── user/         # User-related modules
│   │   │   ├── dto/      # Data transfer objects
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.schema.ts
│   │   ├── storage/      # Data storage
│   │   │   └── memory.store.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/              # Vue 3 frontend
│   ├── src/
│   │   ├── components/   # Vue components
│   │   │   ├── FileUploader.vue
│   │   │   ├── ValidUsers.vue
│   │   │   ├── InvalidUsers.vue
│   │   │   └── EditableUserRow.vue
│   │   ├── api/          # API service
│   │   ├── types/        # TypeScript types
│   │   ├── validation/   # VeeValidate schemas
│   │   ├── views/        # Page components
│   │   └── App.vue
│   └── package.json
└── README.md
```

## 📊 CSV Format

The application expects CSV files with the following columns:

| Column         | Type   | Required | Validation                        |
| -------------- | ------ | -------- | --------------------------------- |
| `first_name`   | string | Yes      | Non-empty                         |
| `last_name`    | string | Yes      | Non-empty                         |
| `email`        | string | Yes      | Valid email format, unique        |
| `birthdate`    | date   | Yes      | ISO date format, user must be 13+ |
| `phone_number` | string | Yes      | 7-15 digits, optional + prefix    |

### Example CSV:

```csv
first_name,last_name,email,birthdate,phone_number
John,Doe,john.doe@example.com,1990-05-15,+1234567890
Jane,Smith,jane.smith@example.com,1985-08-22,9876543210
```

## 🔧 API Endpoints

### POST `/upload`

Upload a CSV file for processing.

**Parameters:**

- `file`: CSV file (multipart/form-data)
- `dryRun` (optional): Set to `true` for dry run mode

**Response:**

```json
{
  "valid": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "birthdate": "1990-05-15",
      "phone_number": "+1234567890",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "invalid": [
    {
      "rowIndex": 3,
      "data": { "first_name": "Bob", "email": "invalid-email" },
      "errors": ["Email must be a valid email address"]
    }
  ]
}
```

### POST `/validate`

Validate a single user record.

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "birthdate": "1990-05-15",
  "phone_number": "+1234567890"
}
```

### GET `/export`

Download all valid users as a CSV file.

## 🎯 Usage Guide

### 1. Upload a CSV File

- Drag and drop a CSV file onto the upload area, or click "Choose File"
- Optionally enable "Dry run mode" to test without saving
- The system will validate all records and show results

### 2. Review Results

- **Valid Users**: Successfully validated records are displayed in an expandable table
- **Invalid Users**: Records with errors are shown in an expandable section with detailed error messages
- **Collapsible Sections**: Click the chevron icon next to section headers to expand/collapse content

### 3. Fix Invalid Records

- **Expand Invalid Users Section**: Click the chevron to expand the invalid users panel
- **Edit Data Inline**: Click on any invalid record to edit the data with real-time validation
- **Data Persistence**: Your edits are automatically saved and persist when you close/reopen the panel
- **Real-time Validation**: VeeValidate provides instant feedback with error messages and visual indicators
- **Reset Option**: Use the "Reset" button to clear your changes and return to original data
- **Revalidate**: Fix the errors and click "Revalidate" to process the corrected data
- **Success**: Successfully fixed records will be moved to the valid users list

### 4. Export Data

- **Expand Valid Users Section**: Click the chevron to expand the valid users panel
- **Download CSV**: Click "Download CSV" to export all valid users
- **File Format**: The exported file will contain all successfully saved records in CSV format

## 🆕 Latest Features

### 📋 Expandable/Collapsible Components

- **Valid Users Panel**: Expandable table showing all successfully validated users
- **Invalid Users Panel**: Expandable section for editing invalid records
- **Smooth Animations**: Vue transitions provide smooth expand/collapse animations
- **Visual Indicators**: Chevron icons rotate to indicate panel state
- **Space Efficient**: Users can hide sections to focus on relevant content

### 💾 Data Persistence

- **Automatic Saving**: Form data is automatically saved to browser localStorage as you type
- **Session Persistence**: Your edits persist when closing and reopening panels
- **Per-Row Storage**: Each invalid user row has its own storage space
- **Smart Cleanup**: Saved data is automatically removed after successful validation
- **Manual Reset**: "Reset" button clears both form data and saved storage
- **Error Recovery**: Graceful fallback if localStorage is unavailable

## Automated Testing Strategy

**Note: No automated tests was not implemented due to time and requirements contraints.** This section outlines a testing approach to ensure code quality and reliability.

```
tests/
├── unit/                 # Unit tests
│   ├── components/      # Vue component tests
│   ├── services/        # Business logic tests
│   └── utils/           # Utility function tests
├── integration/         # Integration tests
│   ├── api/            # API integration tests
│   └── components/     # Component integration tests
└── e2e/                # End-to-end tests
    ├── upload/         # File upload scenarios
    └── validation/     # Validation workflows
```

#### Browser Testing approach

- For manual browser testing see [Test Cases](./TEST_CASES.md)
