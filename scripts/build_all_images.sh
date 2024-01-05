#!/bin/bash

# Build all images
docker compose -f ../docker-compose.yml build --parallel 
