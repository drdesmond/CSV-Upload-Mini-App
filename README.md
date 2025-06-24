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

# Install frontend dependencies
cd ../frontend
npm install
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

- **Valid Users**: Successfully validated records are displayed in a table
- **Invalid Users**: Records with errors are shown with detailed error messages

### 3. Fix Invalid Records

- Click on any invalid record to edit the data inline
- VeeValidate provides real-time validation with error messages
- Fix the errors and click "Revalidate"
- Successfully fixed records will be moved to the valid users list

### 4. Export Data

- Click "Download CSV" to export all valid users
- The exported file will contain all successfully saved records

## 🧪 Testing

A sample CSV file (`sample-users.csv`) is included for testing. It contains:

- Valid user records
- Records with validation errors (underage users, invalid phone numbers, etc.)
- Duplicate email addresses

## 🔒 Validation Rules

### Frontend Validation (VeeValidate + Yup)

- **Real-time validation** as users type
- **Visual feedback** with red borders on invalid fields
- **Custom error messages** for each field
- **Age validation** ensuring users are 13+ years old
- **Email format validation** with proper email regex
- **Phone number validation** with international format support

### Backend Validation (Class Validator)

- **Email Validation**: Must be valid format and unique across all users
- **Age Validation**: Users must be at least 13 years old
- **Phone Number Validation**: 7-15 digits with optional + prefix
- **Required Fields**: All fields are required and non-empty

## 🏗️ Architecture Highlights

### Frontend Architecture

- **Component-based design** with Vue 3 Composition API
- **VeeValidate integration** for robust form validation
- **TypeScript throughout** for type safety
- **Local state management** using Vue's reactive system
- **Clean API layer** with fetch-based HTTP client

### Backend Architecture

- **NestJS modular structure** with dependency injection
- **DTO-based validation** with Class Validator decorators
- **In-memory storage** for session-based data persistence
- **CSV processing** with robust error handling
- **Global validation pipes** for consistent data validation

## 🚀 Deployment

### Backend Deployment

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on the repository.
