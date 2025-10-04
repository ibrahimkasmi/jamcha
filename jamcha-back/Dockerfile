# ============================ 
# 1. Build stage 
# ============================ 
FROM maven:3.9.6-eclipse-temurin-22 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies first (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# ============================ 
# 2. Run stage 
# ============================ 
FROM eclipse-temurin:22-jdk AS runner

# Set working directory
WORKDIR /app

# Copy only the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]