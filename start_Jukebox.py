import os

# stop docker service
os.system('sudo systemctl start docker')
os.system('sudo systemctl enable docker')
os.system('sudo systemctl restart docker')

# Restarting the docker container
os.system('sudo docker-compose down')
os.system('sudo docker-compose up -d')