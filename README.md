# Human Resource Management (HRM) System

## Overview

This Human Resource Management (HRM) System is a modular microservices-based application designed to streamline HR operations within an organization. The system is developed following Clean Architecture principles with Java and Spring Boot, supporting scalability, maintainability, and testability.

## Architecture

The system follows a **modular monolith to microservices-ready** approach with clearly defined modules:

* **Domain**: Core business logic and entities
* **Application**: Use cases and service interfaces
* **Infrastructure**: External systems (databases, messaging, etc.)
* **API**: REST endpoints for external interaction

## Tech Stack

* Java 21
* Spring Boot 3
* Maven (Multi-module)
* PostgreSQL / MySQL
* Docker & Docker Compose
* Clean Architecture

## Core Modules & Features

### 1. Employee Management

* Employee Onboarding & Offboarding
* Profile Management
* Role & Department Assignment

### 2. Attendance Management

* Clock In/Out
* Leave Requests
* Absentee Reports

### 3. Payroll

* Salary Setup & Deductions
* Monthly Payslip Generation
* Tax & Benefits Calculation

### 4. Performance Management

* Goal Setting
* Performance Reviews
* Appraisals

### 5. Recruitment (Optional)

* Job Posting
* Application Tracking
* Interview Scheduling

### 6. User Management & Security

* Authentication (JWT / OAuth2 Ready)
* Role-Based Access Control (RBAC)

## Development Guidelines

* Follow Clean Architecture: Domain -> Application -> Infrastructure -> API
* Use DTOs and Mappers to isolate layers
* Prefer constructor injection and immutability

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-org/hrm-system.git
cd hrm-system

# Build all modules
mvn clean install

# Run the application
cd api
mvn spring-boot:run
```

## Docker Support

To run services with Docker:

```bash
docker-compose up --build
```

## Folder Structure

```
hrm-system/
├── domain/
├── application/
├── infrastructure/
├── api/
├── docker-compose.yml
├── README.md
```

## Future Enhancements

* Microservice decomposition
* Integration with external systems (ERP, Payroll providers)
* Kafka/Event sourcing
* Multi-tenant support

## License

[GNU General Public License v3.0](LICENSE)

---

**Developed with ❤️ using Java and Spring Boot.**
