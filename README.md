# 🏢 Hệ thống Quản lý Chung cư (Apartment Management System)

## 📋 Giới thiệu

Dự án **Quản lý Chung cư** là một hệ thống web application được xây dựng để hỗ trợ việc quản lý các hoạt động trong khu chung cư, bao gồm quản lý cư dân, căn hộ, phí dịch vụ và các tiện ích khác.

## 🛠️ Công nghệ sử dụng

### Backend (BE)
- **Framework:** Spring Boot 3.5.9
- **Ngôn ngữ:** Java 21
- **Database:** MySQL 8.0
- **Security:** Spring Security
- **ORM:** Spring Data JPA
- **Validation:** Spring Boot Starter Validation
- **Utilities:** Lombok

### Frontend (FE)
- **Submodule:** Được quản lý riêng biệt

## 📁 Cấu trúc dự án

```
├── BE/                     # Backend - Spring Boot Application
│   ├── src/               # Source code
│   ├── pom.xml            # Maven dependencies
│   ├── docker-compose.yml # Docker configuration
│   ├── init-db/           # Database initialization scripts
│   └── mvnw               # Maven wrapper
├── FE/                     # Frontend (Submodule)
└── package-lock.json
```

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống

- **Java:** JDK 21 hoặc cao hơn
- **Maven:** 3.6+ (hoặc sử dụng Maven Wrapper)
- **Docker & Docker Compose:** Phiên bản mới nhất
- **Git:** Để clone repository

### Bước 1: Clone repository

```bash
git clone https://github.com/truntain/test.git
cd test
git checkout dev
```

### Bước 2: Khởi động Database với Docker

```bash
cd BE
docker-compose up -d
```

**Thông tin kết nối database:**
| Thông số | Giá trị |
|----------|---------|
| Host | localhost |
| Port | 3307 |
| Database | apartment_mgmt |
| Username | apartment_user |
| Password | apartment_pass |
| Root Password | root123 |

### Bước 3: Chạy Backend

**Sử dụng Maven Wrapper (khuyến nghị):**

```bash
# Linux/macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

**Hoặc sử dụng Maven đã cài đặt:**

```bash
mvn spring-boot:run
```

### Bước 4: Truy cập ứng dụng

- **Backend API:** http://localhost:8080

## 🔧 Cấu hình môi trường

Tạo file `application.properties` hoặc `application.yml` trong thư mục `BE/src/main/resources/` với các cấu hình sau:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3307/apartment_mgmt
spring.datasource.username=apartment_user
spring.datasource.password=apartment_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

## 📝 Lưu ý quan trọng

1. **Database Port:** Docker expose MySQL trên port `3307` (không phải port mặc định 3306)
2. **Khởi động Docker trước:** Đảm bảo Docker container đang chạy trước khi khởi động ứng dụng Spring Boot
3. **Init Scripts:** Các script khởi tạo database được đặt trong thư mục `BE/init-db/`

## 🧪 Chạy Tests

```bash
cd BE

# Chạy tất cả tests
./mvnw test

# Chạy tests với coverage
./mvnw test jacoco:report
```

## 🐳 Các lệnh Docker hữu ích

```bash
# Khởi động containers
docker-compose up -d

# Dừng containers
docker-compose down

# Xem logs
docker-compose logs -f mysql

# Truy cập MySQL CLI
docker exec -it apartment_mysql mysql -u apartment_user -p
```

## 👥 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho mục đích học tập và demo.

---

**Developed with ❤️ by Team**