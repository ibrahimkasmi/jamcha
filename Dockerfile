# ----------------------------
# 1️⃣ Build frontend (React)
# ----------------------------
    FROM node:20 AS frontend-build
    WORKDIR /app/frontend
    COPY jamcha-client/package.json .
    COPY jamcha-client/yarn.lock .
    RUN yarn install --frozen-lockfile
    COPY jamcha-client/ .
    RUN yarn build
    
    # ----------------------------
    # 2️⃣ Build admin frontend (React)
    # ----------------------------
    FROM node:20 AS admin-build
    WORKDIR /app/admin
    COPY jamcha-admin/package.json .
    COPY jamcha-admin/yarn.lock .
    RUN yarn install --frozen-lockfile
    COPY jamcha-admin/ .
    RUN yarn build
    
    # ----------------------------
    # 3️⃣ Build backend (Spring Boot)
    # ----------------------------
    FROM maven:3.9.6-eclipse-temurin-22 AS backend-build
    WORKDIR /app/backend
    COPY jamcha-back/pom.xml ./pom.xml
    COPY jamcha-back/src ./src
    
    # Copy frontend builds into backend resources BEFORE building
    COPY --from=frontend-build /app/frontend/build ./src/main/resources/static/client
    COPY --from=admin-build /app/admin/build ./src/main/resources/static/admin
    
    RUN mvn clean package -DskipTests
    
    # ----------------------------
    # 4️⃣ Final image
    # ----------------------------
    FROM eclipse-temurin:22-jdk
    WORKDIR /app
    
    # Copy backend jar (which now includes the frontend builds)
    COPY --from=backend-build /app/backend/target/*.jar app.jar
    
    # Expose backend port
    EXPOSE 8080
    
    # Environment variables (optional defaults)
    ENV SERVER_PORT=8080
    ENV DB_HOST=postgres
    ENV DB_PORT=5432
    ENV DB_NAME=jamcha_database
    ENV DB_USER=jamcha_user
    ENV DB_PASSWORD=jamcha_password
    ENV KEYCLOAK_HOST=keycloak
    ENV KEYCLOAK_REALM=jamcha_realm
    ENV KEYCLOAK_CLIENT_ID=jamcha-backend
    ENV KEYCLOAK_CLIENT_SECRET=jamcha-backend-secret-key-2024
    ENV MINIO_HOST=minio
    ENV MINIO_PORT=9000
    ENV MINIO_ACCESS_KEY=jamcha
    ENV MINIO_SECRET_KEY=jamcha123
    ENV MINIO_BUCKET=jamcha-assets
    ENV JWT_EXPIRATION=3600
    ENV JWT_SECRET=default-secret-key
    ENV SPRING_PROFILES_ACTIVE=docker
    
    # Run backend
    CMD ["java", "-jar", "app.jar"]