set -e 
yarn build
docker build ztellaw/onthemat-server:latest .
docker push ztellaw/onthemat-server:latest
ssh onthemat
sudo docker pull ztellaw/onthemat-server:latest .
sudo docker-compose up -d