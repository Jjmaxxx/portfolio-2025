sudo docker compose -f docker-compose.prod.yml down --remove-orphans
sudo docker compose -f docker-compose.prod.yml up --build -d --remove-orphans