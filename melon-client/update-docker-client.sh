#!/bin/bash

# NOTE: Script to update the docker container...
# Stop and remove existing container
docker stop melon-react-app
docker rm melon-react-app

# Build image and recreate container
docker build -t melon-client .
docker run -d --name melon-react-app --network melon-network -p 3000:3000 melon-client