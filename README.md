# SilkRoute ERP 🕷️📦

Application for testing: http://152.70.29.133:8081/index.html

**SilkRoute ERP** is a professional Enterprise Resource Planning system designed for the niche industry of exotic arachnid breeding and wholesale distribution. The system manages the entire lifecycle of specimens—from large-scale inventory logistics to granular biological data tracking.

## 🚀 Key Modules

### 1. Sales & Inventory Module
* **Wholesale Management**: Specialized for handling large quantities of specimens (e.g., L1, L2 slings).
* **Inventory Valuation**: Real-time stock tracking and pricing management.
* **Order Processing**: Automated workflow for wholesale transactions.

### 2. Breeding Intelligence Module
* **Breeding Reports**: Comprehensive logs for individual specimens (e.g., "Renia", "H. dictator").
* **Event Analysis**: Historical tracking of matings, molts, and feeding patterns.
* **Environmental Optimization**: Monitoring of thermal gradients (29°C - 31°C) and humidity to maximize cocoon success rates.

## 🛠️ Tech Stack

* **Language**: **Java 24** (Utilizing the latest JVM features)
* **Framework**: **Spring Boot 3.x**
* **Data Access**: Spring Data JPA / Hibernate
* **Database**: **MySQL 8.x**
* **Architecture**: Modular Monolith (Clean separation of Sales and Breeding domains)

---

Application for testing: http://152.70.29.133:8081/index.html

## 💾 Database Configuration

To connect the application to your local MySQL instance, update your `src/main/resources/application.properties` as follows:

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

