sudo docker compose -f docker-compose.prod.yml down --remove-orphans
git pull
sudo docker compose -f docker-compose.prod.yml up --build -d --remove-orphans