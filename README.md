# Jamcha Project

Welcome to the Jamcha Project! This repository contains the full-stack application, including the backend, client-facing frontend, and admin dashboard.

## Project Structure

The project is organized into the following main directories:

-   `jamcha-back/`: The Java Spring Boot backend application.
-   `jamcha-client/`: The client-facing web application built with React.
-   `jamcha-admin/`: The admin dashboard application built with React.
-   `jamcha-devops/`: Contains Docker configurations for running the entire backend infrastructure.

---

## Prerequisites

Before you begin, ensure you have the following installed and configured:

-   **Node.js and npm:** To run the frontend applications. We recommend using Node.js version 18 or later.
-   **Docker and Docker Compose:** To run the backend services. **Please ensure the Docker daemon is running before starting the script.**
-   **Java:** Required by the Maven wrapper to build the backend. You do not need to install Maven itself.
-   **Internet Connection:** Required for the initial setup to download dependencies and Docker images.

---

## Getting Started

To get the project running, use the startup script for your operating system. These scripts will automate the entire process.

-   **For Windows:** Double-click the `start.bat` file.

-   **For macOS / Linux:** First, make the script executable. Then, run it using `sudo`, as it may need elevated permissions to interact with Docker.

    ```bash
    # This step is only needed once to make the script executable
    chmod +x start.sh

    # Run the script with sudo
    sudo ./start.sh
    ```

These scripts will automatically:
-   Build the backend application inside a Docker container.
-   Start all backend services (database, Keycloak, etc.).
-   Intelligently wait for the backend services to be fully ready.
-   Install dependencies for both frontend applications.
-   Start the frontend development servers.

---

## Accessing the Applications

Once all services are running, you can access them at the following URLs:

-   **Jamcha Client:** [http://localhost:3031](http://localhost:3031)
-   **Jamcha Admin:** [http://localhost:3030](http://localhost:3030)
-   **Backend API:** [http://localhost:8080](http://localhost:8080)
-   **Keycloak Admin:** [http://localhost:8085](http://localhost:8085)
-   **MinIO Console:** [http://localhost:9001](http://localhost:9001)
-   **pgAdmin:** [http://localhost:5050](http://localhost:5050)

---

## Default Login Credentials

Use the following default credentials to log in:

**Application:** Jamcha Admin (`http://localhost:3030`)
#### Admin User
-   
-   **Username:** `jamcha_admin`
-   **Password:** `Jamcha123`

#### Author User

-   **Username:** `content`
-   **Password:** `Content123`

---

## Stopping the Application

1.  **Stop Frontend Servers:**
    -   In each of the frontend terminal windows, press `Ctrl + C` to stop the development server.

2.  **Stop Backend Services:**
    -   Navigate to the `jamcha-devops` directory and run:
        ```bash
        docker-compose down
        ```
    This will stop and remove all the containers started by Docker Compose.