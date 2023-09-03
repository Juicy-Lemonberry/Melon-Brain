#!/bin/bash

# NOTE: Script to update the docker container...
# Stop and remove existing container
docker stop melon-node-app
docker rm melon-node-app

# Build image and recreate container
docker build -t melon-server .
docker run -d --name melon-node-app --network melon-network -p 5000:5000 melon-server