import os

os.system("git stash")
os.system('git pull')


os.system('sudo systemctl start docker')
os.system('sudo systemctl enable docker')
os.system('sudo systemctl restart docker')

# remove all containers
os.system('sudo docker rm $(sudo docker ps -aq)')
#remove all images
os.system('sudo docker rmi -f $(sudo docker images -aq)')

os.system('sudo docker compose build --no-cache')
os.system('sudo docker compose up -d')