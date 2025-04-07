# Music Platform API

## Overview
The Music Platform API is a backend service designed to manage music-related data, including tracks, albums, and user interactions. It provides endpoints for creating, retrieving, updating, and deleting music data, as well as handling user authentication and authorization.

## Architecture
The API is built using the NestJS framework, leveraging its modular architecture to separate concerns into different modules such as User, Track, Album, and Authentication. MongoDB is used as the primary database, with Mongoose as the ODM to define schemas and interact with the database.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd music-platform-api
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Application
1. Start the development server:
   ```bash
   npm run start:dev
   ```
3. You need to have a mongoDB instance running on your machine or account MongoDB Atlas.
4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
2. The API will be available at `http://localhost:3000`.

## Technologies Used
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **MongoDB**: A NoSQL database for storing music data.
- **Mongoose**: An ODM for MongoDB, used to define schemas and interact with the database.
- **Docker**: Used for containerizing the application for consistent development and deployment environments.
