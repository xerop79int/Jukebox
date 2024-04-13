import os

# stop docker service
os.system('sudo systemctl start docker')
os.system('sudo systemctl enable docker')
os.system('sudo systemctl restart docker')

#remove all images
os.system('sudo docker rmi -f $(sudo docker images -aq)')

os.system('sudo docker compose up -d')
