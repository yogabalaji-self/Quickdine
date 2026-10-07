QuickDine – Restaurant Management & Food Ordering System

QuickDine is a full-stack restaurant management and food ordering web application. It allows customers to browse food items, add items to a cart, place orders, and manage their profiles.

The project also includes an admin section for managing users, food items, orders, and restaurant tables.

## Project Overview

QuickDine is built using React for the frontend and Spring Boot for the backend. The frontend communicates with the backend through REST APIs, and the backend stores application data in a MySQL database.

The project also uses JWT authentication to protect user and admin features.

## Main Features

### Customer Features

* User registration and login
* JWT-based authentication
* Browse food items
* View food details
* Add food items to cart
* Update cart quantity
* Remove items from cart
* Place orders
* View order history
* Manage user profile
* Responsive design for different screen sizes

### Admin Features

* Admin login
* Manage users
* Add, update and delete food items
* Manage customer orders
* Manage restaurant tables
* Access protected admin features

## Application Flow

### Customer Flow

Landing Page
     ↓
Login / Registration
     ↓
Customer Home
     ↓
Browse Food
     ↓
Food Details
     ↓
Add to Cart
     ↓
Checkout
     ↓
Place Order
     ↓
Order History

### Admin Flow

Admin Login
     ↓
Authentication
     ↓
Admin Dashboard
     ↓
User Management
Food Management
Order Management
Table Management


## Project Architecture

User
  ↓
React Frontend
  ↓
REST API
  ↓
Spring Boot Backend
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MySQL Database


## Technologies Used

### Frontend

* React
* JavaScript
* HTML5
* CSS3
* Bootstrap
* React Router
* Context API
* Vite

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Maven
* JWT
* BCrypt
* Lombok

### Database

* MySQL

## Frontend Structure

quickdine-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── css/
│   ├── pages/
│   │   └── admin/
│   └── services/
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

The frontend is divided into components, pages, context, CSS files, and service files to keep the project organized.

## Backend Structure


backend/
│
├── src/
│   ├── main/
│   │   └── java/
│   │
│   └── test/
│
├── pom.xml
├── mvnw
└── mvnw.cmd


The backend follows a layered structure:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

## Authentication

QuickDine uses JWT authentication.

The basic login process is:


User enters email and password
          ↓
React sends login request
          ↓
Spring Boot verifies the user
          ↓
Password is checked using BCrypt
          ↓
JWT token is generated
          ↓
Token is returned to frontend
          ↓
Frontend uses the token for protected requests


The application supports two main roles:

* CUSTOMER
* ADMIN

## Main API Endpoints

### Authentication
POST /api/auth/login


### Users


GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}


### Foods

GET    /api/foods
POST   /api/foods
PUT    /api/foods/{id}
DELETE /api/foods/{id}

### Cart

GET    /api/cart
POST   /api/cart
PUT    /api/cart/{id}
DELETE /api/cart/{id}


### Orders

GET  /api/orders
POST /api/orders


### Restaurant Tables


GET    /api/tables
POST   /api/tables
PUT    /api/tables/{id}
DELETE /api/tables/{id}

## Database

The project uses MySQL to store application data.

Main data areas include:

* Users
* Food items
* Cart items
* Orders
* Order items
* Restaurant tables

Create the database before running the backend:

CREATE DATABASE quickdine;


Database configuration should be provided using environment variables instead of storing passwords directly in the project.

## Requirements

Before running the project, install:

* Java 21
* Node.js
* npm
* MySQL
* Maven
* Git
* An IDE such as VS Code, IntelliJ IDEA, or Eclipse

## How to Run the Project

### 1. Clone the Repository

git clone https://github.com/yogabalaji-self/quickdine.git

cd quickdine


### 2. Start the Backend

Open a terminal in the backend folder:

cd backend

Run the Spring Boot application:

For Windows:

```bash
mvnw.cmd spring-boot:run
```

For Linux or macOS:

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8082
```

### 3. Start the Frontend

Open another terminal and go to the frontend folder:

```bash
cd quickdine-frontend
```

Install the required packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Frontend and Backend Communication

The frontend sends requests to the Spring Boot backend using REST APIs.

For example, when a customer adds a food item to the cart:


Customer
   ↓
React Frontend
   ↓
POST /api/cart
   ↓
Spring Boot Controller
   ↓
Cart Service
   ↓
Cart Repository
   ↓
MySQL
   ↓
Response
   ↓
React updates the cart


## Responsive Design

The frontend is designed to work on:

* Desktop
* Laptop
* Tablet
* Mobile devices

Bootstrap and responsive CSS are used to create the layouts.

## Testing

### Backend

Run backend tests using:

```bash
mvnw.cmd test
```

### Frontend

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Future Improvements

Some features that can be added in the future:

* Online payment integration
* Email or SMS notifications
* Food search and pagination
* Swagger API documentation
* Better error handling
* Refresh token authentication
* Docker support
* Cloud deployment
* Automated testing
* GitHub Actions for CI/CD

## Author

M. Yoga Balaji

Java | Spring Boot | React | JavaScript | MySQL | REST API | JPA | JWT | HTML | CSS | Bootstrap
