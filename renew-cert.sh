#!/bin/bash

cd ~/projects/portfolio-2025 || exit 1

sudo docker compose -f docker-compose.prod.yml down

sudo docker compose -f docker-compose.cert.yml up --abort-on-container-exit

sudo docker compose -f docker-compose.prod.yml up -d
