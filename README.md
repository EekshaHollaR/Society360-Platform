# 🏢 Society360 — Smart Residential Management System

Society360 is a **full-stack web platform designed to digitize and automate residential society management**.  
It replaces inefficient manual processes such as visitor registers, maintenance complaints, billing records, and announcements with a **secure, centralized digital system**.

The platform enables **Residents, Staff, and Administrators** to interact through role-based dashboards, improving transparency, security, and operational efficiency.

This Project is deployed on Render and Vercel, It can be accessed here:  
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://society360-platform-5khg.vercel.app/)

---

## 🚀 Features

### 🔐 Secure Authentication & Role-Based Access
- JWT based authentication
- Encrypted password storage using bcrypt
- Role-based dashboards for:
  - Residents
  - Staff
  - Administrators

### 🚪 Visitor & Gate Management
- Resident visitor pre-approval
- Visitor check-in and check-out logging
- Vehicle and purpose tracking
- Visitor history records
- Security audit trail

### 🛠 Maintenance Management
- Residents raise maintenance requests
- Priority classification
- Staff assignment
- Status tracking and resolution history

### 💳 Finance & Billing System
- Automated bill generation
- Custom bill types
- Payment simulation
- Digital receipts
- Payment history tracking

### 📢 Communication & Announcements
- Admin-created announcements
- Priority notifications
- Expiry based announcements
- Announcement history

### 📊 Admin Dashboard
- User and unit management
- Financial monitoring
- System reports and statistics
- Audit logs for accountability

---

## 🧱 System Architecture

Society360 follows a **Three-Tier Architecture**:

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Web Browser]
        B[Next.js Frontend]
        C[React Components]
        D[Tailwind CSS]
        E[Zustand State]
    end
    
    subgraph "Application Layer"
        F[Express.js Server]
        G[Authentication Middleware]
        H[RBAC Middleware]
        I[Controllers]
        J[Business Logic]
        K[Validators]
    end
    
    subgraph "Data Layer"
        L[(PostgreSQL Database)]
        M[Users Table]
        N[Units Table]
        O[Visitors Table]
        P[Bills Table]
        Q[Maintenance Table]
        R[Audit Logs]
    end
    
    A --> B
    B --> C
    C --> D
    B --> E
    
    B -->|HTTPS/REST API| F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    
    I -->|SQL Queries| L
    L --> M
    L --> N
    L --> O
    L --> P
    L --> Q
    L --> R
    
    style A fill:#e1f5ff
    style B fill:#bbdefb
    style F fill:#c8e6c9
    style L fill:#ffccbc
```


---

## 🧰 Tech Stack

### Frontend
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- Recharts (Analytics)
- React Icons
- Sonner (Notifications)

### Backend
- **Node.js**
- **Express.js**
- JWT Authentication
- bcrypt password encryption
- Helmet security headers
- CORS configuration
- Rate limiting
- Express Validator

### Database
- **PostgreSQL**
- UUID primary keys
- Foreign keys & constraints
- Indexing
- Triggers
- Soft deletes

### Development Tools
- VS Code
- Git & GitHub
- Postman (API testing)
- Jest (Unit testing)
- Supertest (API testing)

---

## 👥 User Roles

| Role | Responsibilities |
|-----|----------------|
| **Resident** | Bills, maintenance requests, visitor approvals, announcements |
| **Staff** | Visitor check-in/out, maintenance updates |
| **Administrator** | User management, billing control, reports, announcements |

---

## ⚙️ Core Modules

### 1️⃣ Authentication & User Management
- Secure login & registration
- Role-based access control
- Profile management
- Unit allocation

### 2️⃣ Visitor Management
- Visitor pre-approval
- Gate entry logging
- Visitor history tracking

### 3️⃣ Maintenance Requests
- Complaint submission
- Priority tagging
- Staff task assignment
- Status lifecycle tracking

### 4️⃣ Billing & Finance
- Monthly bill generation
- Payment tracking
- Digital receipts
- Financial reporting

### 5️⃣ Communication System
- Society announcements
- Targeted notifications
- Priority flags
- Announcement history

### 6️⃣ Administrative Controls
- System configuration
- User management
- Audit logs
- Analytics dashboard

---

## 🔒 Security Features

- JWT Authentication
- Password hashing using bcrypt
- Role-Based Access Control (RBAC)
- API rate limiting
- Secure HTTP headers (Helmet)
- Input validation & sanitization
- Activity audit logs

---

## 📊 Performance

| Metric | Result |
|------|------|
| API Response Time | < 200 ms |
| Page Load Time | < 2 seconds |
| Error Rate | Minimal |
| System Uptime | Stable |

---

## 🧪 Testing

### Unit Testing
Tested using **Jest** and **Supertest**

Verified modules:
- Authentication APIs
- Visitor management
- Maintenance workflows
- Billing system logic

### Integration Testing
- Frontend ↔ Backend communication
- Database operations
- Authentication workflows

### Manual Testing
Browsers tested:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/society360.git
cd society360
```
2️⃣ Install Dependencies

Frontend:

```bash
cd frontend
npm install
```
Backend:

```bash
cd backend
npm install
```

3️⃣ Configure Environment Variables

Create .env file:
```bash
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/society360
JWT_SECRET=your_secret_key
```

4️⃣ Run the Application

Backend
```bash
npm run dev
```
Frontend

```bash
npm run dev
```
## 📈 Future Enhancements
### Short Term
- Email verification
- Password recovery
- Two-factor authentication (2FA)
- Push notifications

### Medium Term
- Payment gateway integration
- Amenity booking
- Parking management
- Advanced analytics dashboards

### Long Term
- Multi-society support
- Microservices architecture
- AI-based predictive maintenance

## 🎯 Project Impact

Society360 significantly improves residential management by:
- Reducing paperwork
- Increasing transparency
- Improving security
- Faster issue resolution
- Better communication between residents and management

## 📚 Learning Outcomes

Through this project, hands-on experience was gained in:
- Full-stack web development
- RESTful API design
- PostgreSQL database architecture
- Authentication and security
- Responsive frontend design
- Testing and debugging real-world systems

👨‍💻 Author

Eeksha Holla R
Full Stack Developer
Internship Project – Civora Nexus


