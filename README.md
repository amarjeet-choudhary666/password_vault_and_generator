# Password Generator & Vault

A full-stack web application for securely generating, storing, and managing passwords. Features user authentication, two-factor authentication (2FA), password generation with customizable options, and an encrypted vault for storing sensitive information.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Two-Factor Authentication (2FA)**: Optional TOTP-based 2FA for enhanced security
- **Password Generation**: Customizable password generator with options for length, character types, and complexity
- **Secure Vault**: Encrypted storage for passwords and other sensitive data
- **Theme Support**: Light and dark mode toggle
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** for data storage
- **JWT** for authentication
- **bcrypt** for password hashing
- **Speakeasy** for 2FA (TOTP)
- **QRCode** for 2FA setup
- **Crypto-JS** for client-side encryption

### Frontend
- **Next.js 15** with **React 19**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API calls
- **JS-Cookie** for cookie management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd password_generator
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup:**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/password_generator
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

   For production, update `MONGO_URI` to your production database and `FRONTEND_URL` to your deployed frontend URL.

## Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:8000`

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /v1/api/user/register` - User registration
- `POST /v1/api/user/login` - User login
- `POST /v1/api/user/logout` - User logout
- `GET /v1/api/user/test-auth` - Test authentication status

### Two-Factor Authentication
- `POST /v1/api/user/2fa/setup` - Setup 2FA
- `POST /v1/api/user/2fa/verify` - Verify 2FA code
- `POST /v1/api/user/2fa/disable` - Disable 2FA

### Password Generation
- `POST /v1/api/password/generate` - Generate password

### Vault
- `GET /v1/api/vault` - Get all vault items
- `POST /v1/api/vault` - Create new vault item
- `GET /v1/api/vault/:id` - Get specific vault item
- `PUT /v1/api/vault/:id` - Update vault item
- `DELETE /v1/api/vault/:id` - Delete vault item

## Project Structure

```
password_generator/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   ├── db/             # Database connection
│   │   ├── types/          # TypeScript type definitions
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utility libraries
│   │   └── ...
│   ├── package.json
│   └── next.config.ts
└── README.md
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if available)
5. Submit a pull request

## License

This project is licensed under the ISC License.