# SilkRoute ERP

**SilkRoute ERP** is a professional Enterprise Resource Planning system designed for the niche industry of exotic arachnid breeding and wholesale distribution.  
The platform manages the entire lifecycle of specimens—from large‑scale inventory logistics to granular biological data tracking.

---

## 🔐 Demo Access

**Application for testing:**  
http://152.70.29.133:8081/ 

**Login:** `admin`  
**Password:** `admin123`

---

## 🚀 Key Modules

### 1. Sales & Inventory Module

- **Wholesale Management:** Optimized for handling large quantities of specimens (e.g., L1, L2 slings).  
- **Inventory Valuation:** Real‑time stock tracking and pricing management.  
- **Order Processing:** Automated workflow for wholesale transactions.  
- **Weather‑Aware Shipping (Open‑Meteo Integration):**  
  Integrated 14‑day weather forecasting via the Open‑Meteo API.  
  This enables safe planning of live‑animal shipments by detecting optimal temperature and humidity windows for transporting exotic spiders.

### 2. Breeding Intelligence Module

- **Breeding Reports:** Detailed logs for individual specimens (e.g., *Renia*, *H. dictator*).  
- **Event Analysis:** Historical tracking of matings, molts, feedings, and environmental changes.  
- **Environmental Optimization:** Monitoring of thermal gradients (29°C–31°C) and humidity to maximize cocoon success rates.

---

## 🛠️ Tech Stack

- **Language:** Java 24  
- **Framework:** Spring Boot 3.x  
- **Security:** Spring Security (JWT‑ready architecture)  
- **Data Access:** Spring Data JPA / Hibernate  
- **Database:** MySQL 8.x  
- **Architecture:** Modular Monolith  
  - Clean separation of Sales and Breeding domains  
  - Modern, maintainable structure aligned with enterprise standards  
- **Deployment:** Fully hosted on **Oracle Cloud Infrastructure (OCI)**

---

## 💾 Database Configuration

To connect the application to your local MySQL instance, update:

`src/main/resources/application.properties`

```properties
# MySQL Connection Settings
spring.datasource.url=jdbc:mysql://localhost:3306/silkroute_db?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=your_mysql_user
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
