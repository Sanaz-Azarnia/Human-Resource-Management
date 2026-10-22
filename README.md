# HRM - Human Resource Management 👥

## 📌 About The Project
**HRM** is a comprehensive, enterprise-grade Human Resource Management system designed to streamline organizational workflows and centralize employee data. Built with a strong focus on security and hierarchical workflows, this platform empowers administrators, managers, and employees with role-specific tools for attendance tracking, payroll processing, leave management, and internal reporting.

---

## 🧰 Tech Stack
Next.js · TypeScript · Tailwind CSS · ASP.NET Core · PostgreSQL · Docker · GitHub Actions · Nginx · Linux (VPS) · Unit Testing

---

## 🏢 Role Hierarchy
The system operates on a strict **5-tier hierarchical structure**, ensuring the right level of authority for every user:
- 👑 **Admin** – Full system control and oversight.
- 📊 **Manager** – Department-level supervision.
- 🤝 **Deputy** – Assists managers in operational approvals.
- 💼 **Employee** – Standard organizational staff.
- 🛠️ **Staff** – Support personnel with restricted access.

---

## ✨ Core Modules

### 👤 Employee Management
A powerful directory for the HR department with advanced filtering capabilities:
- **Full CRUD Operations:** Create, read, update, and archive employee records.
- **Real-Time Advanced Search:** Instantly filter the employee database by:
  - Employee ID & Personnel ID
  - Full Name & Email Address
  - Role assignment
  - Salary Range (Min/Max bracket filtering)

### ⏱️ Attendance Tracking
A flexible and transparent attendance logging system:
- **Admin-Initiated Sheets:** Administrators define specific attendance dates/periods.
- **Self-Service Check-In/Out:** Employees log their exact entry and exit times.
- **Status Registration:** One-click toggles for marking "Present" or "Absent".
- **Dual View:**
  - *Employees:* Can view their own personal attendance history.
  - *Admins:* Access comprehensive organization-wide attendance reports.

### 💰 Payroll Management
Streamlined generation and management of employee payslips:
- **Payslip Creation:** Admins can generate detailed payroll documents.
- **Payroll History:** Maintain a searchable archive of past payrolls.
- **Editable Records:** Full capability to edit or remove payroll entries when adjustments are needed.

### 🏖️ Leave Management System
A seamless workflow for time-off requests with a hierarchical approval chain:
- **Employee Dashboard:** Create, edit, or delete personal leave requests.
- **Hierarchical Approval:** Requests automatically route to authorized personnel (**Admin**, **Manager**, or **Deputy**).
- **Actionable Workflows:** Approvers can use dedicated `Approve` or `Reject` actions directly from their dashboard.

### 📋 Internal Reporting
A dedicated space for staff to submit and track work-related reports:
- Employees can draft, edit, delete, and review their own submitted reports.
- Organized listing view for quick reference and follow-ups.

---

## 🔐 Security & Authorization
- **Secure Authentication:** Login system powered by **JWT (JSON Web Tokens)** using unique **Personnel IDs** and passwords.
- **Granular Access Control:** Implementation of a **Permission-Based Authorization** model, ensuring that every API endpoint and UI component is restricted based on the user's assigned permissions, not just their role.
- **Data Protection:** Secure handling of sensitive payroll and personal data.

---

 ## 🚀 Deployment & DevOps
This project follows modern DevOps practices with fully automated, production-ready deployment pipelines:
- **Unit Testing:** Comprehensive unit tests are executed automatically in the CI pipeline to ensure business logic reliability and prevent regressions.
- **CI/CD with GitHub Actions:** Automated workflows handle testing, building, and deployment on every push.
- **Containerization:** The entire application stack is containerized using Docker for consistent environments across development and production.
- **Reverse Proxy:** Nginx serves as the reverse proxy in front of the application containers, handling SSL termination, load balancing, and secure routing.
- **Hosting:** Deployed and managed on a Linux VPS for high availability, scalability, and optimal performance.
- **Transparent Build History:** All build logs, Docker image creation processes, and deployment statuses are available in the **Actions tab** of this repository.


---

## 📬 Contact
Feel free to reach out for collaborations, inquiries, or opportunities:
- **Email:** [sanazazarnia99@gmail.com]
- **Website:** [https://sanazazarnia.com]

---

 ## ⚖️ License

**Source-Available — All Rights Reserved**

The source code is publicly viewable for portfolio and review purposes only. 
You are not granted any rights to copy, modify, distribute, sublicense, or use 
this software for any purpose, commercial or private, without written permission.

---
<p align="center">Built by Sanaz Azarnia (https://github.com/Sanaz-Azarnia) with Next.js, .NET Core, and PostgreSQL.
Containerized with Docker and deployed to a VPS using a GitHub Actions CI/CD pipeline.</p>
