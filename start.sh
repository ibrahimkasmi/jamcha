#!/bin/bash

# Comprehensive startup script for the Jamcha Project

echo "🚀 Starting the entire Jamcha application stack..."
echo "=================================================="

# --- Configuration ---
# Exit immediately if a command exits with a non-zero status.
set -e

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVOPS_DIR="$ROOT_DIR/jamcha-devops"
BACKEND_DIR="$ROOT_DIR/jamcha-back"
CLIENT_DIR="$ROOT_DIR/jamcha-client"
ADMIN_DIR="$ROOT_DIR/jamcha-admin"

# --- Functions ---

# Function to print a formatted header
print_header() {
    echo -e "\n${BLUE}==================================================${NC}"
    echo -e "${BLUE} $1 ${NC}"
    echo -e "${BLUE}==================================================${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to free a port by killing the process using it
# Function to free a port by killing the process using it
free_port() {
    local port=$1
    echo "Checking if port $port is in use..."
    # The -t flag returns just the PID. Use `|| true` to prevent script exit if no process is found.
    local pids=$(lsof -t -iTCP:$port || true)
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Port $port is in use by the following PIDs: $pids${NC}"
        echo "Terminating processes..."
        # Kill each process individually by looping through the PIDs
        echo "$pids" | while read -r pid; do
            if [ -n "$pid" ]; then
                echo "Killing process $pid..."
                kill -9 "$pid" 2>/dev/null || echo "Process $pid may have already exited"
            fi
        done
        # Give processes a moment to terminate
        sleep 2
        echo -e "${GREEN}✅ Port $port has been freed.${NC}"
    else
        echo "Port $port is already free."
    fi
}

# Function to wait for a container to be ready by checking its logs
wait_for_container() {
    local container_name=$1
    local ready_log_message=$2
    local max_wait=300 # 5 minutes
    
    print_header "Waiting for $container_name to be ready..."
    echo -e "(Will wait for up to $max_wait seconds)"

    local timer=0
    while ! docker logs "$container_name" 2>&1 | grep -q "$ready_log_message"; do
        if [ $timer -ge $max_wait ]; then
            echo -e "\n${RED}❌ Timed out waiting for $container_name.${NC}"
            echo "Last 50 lines of logs:"
            docker logs "$container_name" | tail -n 50
            exit 1
        fi
        sleep 5
        timer=$((timer+5))
        echo -n "."
    done
    
    echo -e "\n${GREEN}✅ $container_name is ready!${NC}"
}


# Function to check dependencies and start a Node.js application
start_node_app() {
    local app_dir=$1
    local app_name=$2
    local port=$3

    print_header "Initializing Frontend: $app_name"
    
    if ! command_exists yarn; then
        echo -e "${RED}❌ yarn is not installed. Please install yarn and try again.${NC}"
        exit 1
    fi
    
    if [ ! -d "$app_dir/node_modules" ]; then
        echo -e "${YELLOW}Dependencies not found for $app_name. Running 'yarn install'...${NC}"
        (cd "$app_dir" && yarn install)
        echo -e "${GREEN}✅ Dependencies installed for $app_name.${NC}"
    else
        echo -e "${GREEN}✅ Dependencies already installed for $app_name.${NC}"
    fi

    echo "Starting $app_name development server on port $port..."
    # Run in the background and log output
    (cd "$app_dir" && npm run dev) &
    echo -e "${GREEN}🚀 $app_name is starting in the background.${NC}"
}

# --- Main Execution ---

# 0. Check for Maven permissions
print_header "Checking System Permissions"
M2_WRAPPER_DIR="$HOME/.m2/wrapper"
# Check if the .m2/wrapper directory exists and if we can't write to it.
if [ -d "$M2_WRAPPER_DIR" ] && [ ! -w "$M2_WRAPPER_DIR" ]; then
    echo -e "${RED}Permission issue detected with your Maven directory (~/.m2).${NC}"
    echo "The script needs to download and write to this directory, but doesn't have permission."
    echo ""
    echo "To fix this, please run the following command in your terminal and enter your password:"
    echo -e "${YELLOW}sudo chown -R \\\$(whoami) ~/.m2${NC}"
    echo ""
    echo "After running the command, please start this script again."
    exit 1
else
    echo -e "${GREEN}✅ Maven permissions appear to be correct.${NC}"
fi

# 1. Start Docker Services
print_header "Starting Backend Infrastructure (Docker)"
if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker and try again.${NC}"
    exit 1
fi
if ! command_exists docker-compose; then
    echo -e "${RED}❌ docker-compose is not installed. Please install it and try again.${NC}"
    exit 1
fi

echo "Bringing down any existing containers to ensure a clean start..."
(cd "$DEVOPS_DIR" && docker-compose down)
echo "Building and starting all services in detached mode..."
(cd "$DEVOPS_DIR" && docker-compose up --build -d)
echo -e "${GREEN}✅ Docker services are starting.${NC}"

# 3. Wait for containers to be ready
wait_for_container "jamcha_keycloak" "Keycloak .* started in"
wait_for_container "jamcha_backend" "Started JamchaApplication in"


# 4. Start Frontend Applications
print_header "Starting Frontend Applications"

# Start Admin App
echo "Freeing port 3030 for Jamcha Admin..."
free_port 3030
echo "Starting Jamcha Admin (Port 3030)..."
(cd "$ADMIN_DIR" && yarn dev) &
sleep 5 # Give Vite time to start and bind to the port

# Start Client App
echo "Freeing port 3031 for Jamcha Client..."
free_port 3031
echo "Starting Jamcha Client (Port 3031)..."
(cd "$CLIENT_DIR" && yarn dev) &


# 5. Finalization
print_header "Application Status"
echo -e "${GREEN}All services have been started!${NC}"
echo "Your applications should be available at the following URLs shortly:"
echo "--------------------------------------------------"
echo -e "  - ${YELLOW}Jamcha Client:${NC} http://localhost:3031"
echo -e "  - ${YELLOW}Jamcha Admin:${NC}  http://localhost:3030"
echo -e "  - ${YELLOW}Backend API:${NC}   http://localhost:8080"
echo -e "  - ${YELLOW}Keycloak:${NC}      http://localhost:8085"
echo -e "  - ${YELLOW}MinIO Console:${NC} http://localhost:9001"
echo -e "  - ${YELLOW}pgAdmin:${NC}       http://localhost:5050"
echo "--------------------------------------------------"

print_header "Default Login Credentials"
echo -e "  ${YELLOW}Jamcha Admin Dashboard (http://localhost:3030)${NC}"
echo -e "    - Role:     ADMIN"
echo -e "    - Username: jamcha_admin"
echo -e "    - Password: Jamcha123"
echo ""
echo -e "  ${YELLOW}Jamcha Client (as an Author)${NC}"
echo -e "    - Role:     AUTHOR"
echo -e "    - Username: content"
echo -e "    - Password: Content123"
echo "--------------------------------------------------"

echo "Note: It may take a minute for all services, especially the Java backend, to be fully available."
echo "Use 'docker ps' to check the status of backend containers."
echo "To stop all services, run '$DEVOPS_DIR/docker-compose down' and manually stop the frontend processes."

# Open the main client application in the default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:3031
fi

echo -e "\n${GREEN}✅ Setup complete. Enjoy Jamcha!${NC}"
