**BrandConnect Project Overview**

**Project Name:** BrandConnect

**Project Type:** Full-Stack Web Application

---

**🌐 Purpose:**
BrandConnect is a collaborative platform that connects **brands** with **creators**. Creators can launch marketing campaigns, and brands can browse campaigns that align with their values and express interest. Both parties can communicate directly if mutual interest is shown. The system is built with role-based access and secure authentication.

---

**🛠️ Tech Stack:**

**Frontend:**

* Framework: Next.js (React-based framework)
* Styling: Tailwind CSS
* HTTP Requests: Axios
* Routing: Next.js routing
* Notifications: react-hot-toast

**Backend:**

* Language: Java (Spring Boot)
* Frameworks/Libraries: Spring Web, Spring Security, Spring Data JPA
* Database: PostgreSQL (or MySQL)
* Authentication: JWT-based security
* Validation: Bean Validation
* Dev Tools: Spring Boot DevTools, Lombok

---

**🔐 Roles & Permissions:**

* **CREATOR:** Can create campaigns, view brands that showed interest, and message brands.
* **BRAND:** Can view available campaigns and show interest in specific ones. Can also message creators upon mutual interest.

---

**📄 Key Features:**

* Secure JWT-based login and registration
* Role-based dashboards for creators and brands
* Campaign creation and interest management
* Messaging system for interested users

---

**🔢 Backend Endpoints:**

* POST `/api/auth/register` - Register user (Brand or Creator)
* POST `/api/auth/login` - Login and receive JWT
* GET `/api/campaigns` - Public campaigns listing
* POST `/api/campaigns` - (Creator only) Create new campaign
* GET `/api/campaigns/creator` - View campaigns created by the creator
* POST `/api/campaigns/{id}/interest` - (Brand only) Show interest
* GET `/api/interests/me` - (Brand only) View campaigns the brand has shown interest in
* POST `/api/messages` - Send message between matched users

---

**💻 Frontend Pages:**

* Landing Page (hero + CTA)
* Login / Register
* Creator Dashboard
* Brand Dashboard
* Campaign Page
* Messaging Interface
* 404 NotFound Page

---

**📂 JPA Entities (Database Models):**

* **User**: id, name, email, password, role
* **Campaign**: id, title, description, imageUrl, category, startDate, endDate, creator (User)
* **Interest**: id, brand (User), campaign, timestamp
* **Message**: id, sender (User), receiver (User), content, timestamp

---

**📁 Project Structure:**

**Backend**

```
backend/
├── src/main/java/com/brandconnect
│   ├── controller
│   ├── service
│   ├── model
│   ├── repository
│   ├── config
│   └── BrandConnectApplication.java
```

**Frontend**

```
frontend/
├── components/
├── pages/
├── context/
├── services/
└── app/
```

---

**🚀 Deployment Tips:**

* Backend: Enable CORS, use application.properties for database and JWT config.
* Frontend: Use environment variables for API base URL, setup proxy or CORS support.

---
