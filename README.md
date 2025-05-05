🎯 Project Overview: BrandConnect
BrandConnect is a full-stack web application designed to facilitate collaboration between Creators and Brands through campaign creation, interest expression, and direct messaging. The platform ensures secure authentication and role-based access control, providing tailored experiences for each user type.

🧰 Technology Stack
Frontend:
Framework: Next.js (React-based framework)

Styling: Tailwind CSS

State Management: React Hooks

HTTP Client: Axios

Routing: Next.js Routing

Notifications: react-hot-toast

Backend:
Framework: Spring Boot

Security: Spring Security with JWT Authentication

Data Access: Spring Data JPA (Hibernate)

Database: PostgreSQL or MySQL

Utilities: Lombok, Bean Validation

👥 User Roles & Permissions
1. Creator
Capabilities:

Create and manage campaigns.

View brands that have shown interest in their campaigns.

Engage in messaging with interested brands.

2. Brand
Capabilities:

Browse and view available campaigns.

Express interest in specific campaigns.

Communicate with creators of campaigns they are interested in.

🔐 Authentication & Authorization
Registration & Login: Secure endpoints for user registration and authentication.

JWT Tokens: Issued upon successful login, stored in localStorage on the frontend.

Role-Based Access Control: Backend endpoints secured based on user roles.

📦 Core Features
Campaign Management
Creators can:

Create new campaigns with details like title, description, category, and duration.

Manage existing campaigns.

Brands can:

View a list of available campaigns.

Filter campaigns based on categories or other criteria.

Interest Expression
Brands can express interest in campaigns.

Creators can view which brands have shown interest in their campaigns.

Messaging System
Once a brand expresses interest in a campaign:

Creators and Brands can initiate direct messaging.

Messaging is confined to interested parties to ensure relevance.



🌐 API Endpoints
Authentication
POST /api/auth/register: Register a new user.

POST /api/auth/login: Authenticate user and return JWT.

Campaigns
GET /api/campaigns: Retrieve all campaigns (Brands only).

POST /api/campaigns: Create a new campaign (Creators only).

GET /api/campaigns/mine: Retrieve campaigns created by the logged-in creator.

Interests
POST /api/campaigns/{id}/interest: Express interest in a campaign (Brands only).

GET /api/interests/mine: View interests received on creator's campaigns.

Messaging
POST /api/messages/send: Send a message to an interested party.

GET /api/messages/conversations/{userId}: Retrieve conversation with a specific user.

Frontend communicates with the Backend via RESTful APIs.

Backend processes requests, applies business logic, and interacts with the Database.

Database stores persistent data for users, campaigns, interests, and messages.

🚀 Deployment Considerations
Frontend:

Build the Next.js application using next build.

Deploy static assets to a hosting service or integrate with the backend server.

Backend:

Package the Spring Boot application as a JAR or WAR file.

Deploy to a server or cloud platform.

Ensure environment variables and database configurations are set appropriately.

Integration:

Configure CORS in the Spring Boot application to allow requests from the frontend domain.

Secure API endpoints and manage JWT token validation.

