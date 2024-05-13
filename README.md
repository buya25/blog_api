# Community Forum

This project is a RESTful API built using Node.js, Express, MongoDB, Mongoose, and JWT for authentication and authorization.

## Features

### Authentication & Authorization
- Users can register, login, and authenticate using JWT tokens.
- Authorization is implemented to restrict access to certain routes and functionalities based on user roles.

### Post CRUD Operations
- Users can create, read, update, and delete their posts.
- Post data includes information such as the post's content, creation date, and the user who created it.

### Comment Functionality
- Users can comment on posts.
- Comments include details such as the commenter's information, comment content, and creation date.

### User Activity Tracking
- System automatically blocks users if they remain inactive for 30 days.
- Admins have the ability to manually block users.
- Users can also block other users, preventing them from seeing each other's posts.

### User Profile Management
- Users can update their passwords.
- They can upload profile photos.
- Users can also close their accounts, effectively deleting them from the system.

### User Interaction
- Users can follow and unfollow other users.
- They can view counts of their followers and following users.
- Total profile viewers count, posts created count, and blocked counts are also available.

### Admin Functionality
- Admins have the authority to unblock users who have been blocked.
- They can also view all users who have visited a particular user's profile.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)

## Setup

To set up this project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables, including MongoDB connection URI and JWT secret key.
4. Run the server using `npm start`.

## API Documentation

For detailed API documentation and endpoints, refer to the provided API documentation or explore the routes defined in the project.

## Contributors

- [Yabs Mullo]

## License

This project is licensed under the [License Name] License.