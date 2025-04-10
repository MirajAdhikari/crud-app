
# User Management API

This is a RESTful API built with Express.js for managing user data. It provides basic CRUD (Create, Read, Update, Delete) operations for user records.

## Features
- Create new users with unique IDs
- Retrieve all users or a specific user by ID
- Update existing user information
- Delete users by ID
- Input validation for required fields

## Technologies Used
- Node.js
- Express.js
- UUID (for generating unique IDs)

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/user-management-api.git
cd user-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a main application file (e.g., `app.js`) and include the router:
```javascript
import express from 'express';
import userRouter from './routes/users.js';

const app = express();
app.use(express.json());
app.use('/api', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## API Endpoints

### Create a User
```
POST /api/
```
Request Body:
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "janedoe@example.com"
}
```

### Get All Users
```
GET /api/users
```

### Get a Specific User
```
GET /api/users/:id
```

### Update a User
```
PATCH /api/users/:id
```
Request Body (partial updates allowed):
```json
{
  "first_name": "Updated Name"
}
```

### Delete a User
```
DELETE /api/:id
```

## Usage Example
Using curl to create a new user:
```bash
curl -X POST http://localhost:3000/api/ \
-H "Content-Type: application/json" \
-d '{"first_name":"Jane","last_name":"Doe","email":"janedoe@example.com"}'
```

## Project Structure
```
user-management-api/
├── routes/
│   └── users.js    # Router with all API endpoints
├── app.js          # Main application file (to be created)
├── package.json    # Project dependencies and scripts
└── README.md       # This file
```

## Running the Application
1. Start the server:
```bash
node app.js
```
2. The API will be available at `http://localhost:3000/api`

## Notes
- This is a basic implementation using an in-memory array for data storage
- For production use, consider adding:
  - A proper database (e.g., MongoDB, PostgreSQL)
  - Authentication and authorization
  - Input validation middleware
  - Error handling middleware
  - API documentation (e.g., Swagger/OpenAPI)

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License
[MIT License](LICENSE) - feel free to use this code however you'd like!

---
Created on April 09, 2025
```
