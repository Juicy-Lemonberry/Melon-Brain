#!/bin/bash

# Change directory to the current directory where the script is located
cd "$(dirname "$0")"

# Run Docker Compose command with the specified options
docker compose --env-file .env up --build

