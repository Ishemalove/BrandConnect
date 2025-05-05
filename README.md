🔍 Project Description – BrandConnect
BrandConnect is a web application where brands can register and launch marketing campaigns, while clients can browse those campaigns and express interest. Each user—whether a brand or a client—has their own dashboard to manage activities.

The platform includes:

User authentication (registration & login) secured with JWT tokens

Role-based access control for different users (CLIENT vs BRAND)

A clean and responsive frontend built with React and Tailwind CSS

A secure Spring Boot backend connected to a relational database (PostgreSQL or MySQL)

🧱 Key Features
Role	Capabilities
Brand	Register/Login, Create campaigns, View own campaigns
Client	Register/Login, View all campaigns, Show interest in campaigns, View their interests

📁 Backend Highlights
Spring Boot with REST APIs

Spring Security + JWT for authentication

JPA (Hibernate) for database operations

Three main entities: User, Campaign, Interest

Endpoints for sign-up, login, campaign management, and interest tracking
