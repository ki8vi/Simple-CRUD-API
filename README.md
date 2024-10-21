## CRUD API with Node.js
### Overview
This repository contains a simple CRUD API implemented in TypeScript and NodeJS. The API supports user management with features for creating, reading, updating, and deleting user records.

## Features
### Endpoints:
 - GET /api/users: Retrieve all users.
 - GET /api/users/{userId}: Retrieve a user by ID.
 - POST /api/users: Create a new user.
 - PUT /api/users/{userId}: Update an existing user.
 - DELETE /api/users/{userId}: Delete a user by ID.
 - Error Handling: Proper status codes and messages for invalid requests and server errors.
 - Environment Variables: Configurable port via .env file.
### Modes:
 - Development mode using ```nodemon``` and ```ts-node```.
 - Production mode with a build process using ```webpack```.
### Prerequisites
 - Node.js (v22.x.x or higher)
## Installation
### Clone the repository:

 - git clone <repository-url>
 - switch to ```dev``` branch
### Install dependencies:
```npm install```
### To start the server in development mode, run:
```npm run start:dev```
### Production Mode
### To build and run the application in production mode, execute:
```npm run start:prod```

### API Endpoints
- Get All Users
   - Request: GET /api/users
   - Response: Status 200 with a list of users.
- Get User by ID
   - Request: GET /api/users/{userId}
- Response:
   - Status 200 with user data if found.
   - Status 400 if userId is invalid.
   - Status 404 if user not found.
- Create User
   - Request: POST /api/users
   - Body:
``{
  "username": "string",
  "age": "number",
  "hobbies" = string["one", "two", "three"]
}`` -> Format: JSON

- Response:
   - Status 201 with the newly created user.
   - Status 400 if required fields are missing.
- Update User
   - Request: PUT /api/users/{userId}
   - Body: Same structure as for creating a user.
- Response:
   - Status 200 with updated user data if successful.
   - Status 400 if userId is invalid.
   - Status 404 if user not found.
- Delete User
   - Request: DELETE /api/users/{userId}
- Response:
  - Status 204 if deleted successfully.
  - Status 400 if userId is invalid.
  - Status 404 if user not found.
  - Non-Existing Endpoints
  - Any requests to non-existing endpoints will return a 404 status with a friendly message.


### Testing 
There 3 scenarios of user behavior: basic CRUD operations tests suite,  errors tests suite, unexpected requests amount and etc tests suite
- For run tests ```npm run test```

