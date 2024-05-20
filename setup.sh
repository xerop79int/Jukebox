#!/bin/bash

# Install necessary packages
rpm-ostree install git python3

# Enable and start Docker service
systemctl enable --now docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone the repository
git clone https://github.com/xerop79int/Jukebox.git /opt/my_project/Jukebox

# Change directory to the cloned repository
cd /opt/my_project/Jukebox

# Run the install.py script
python3 install.py

# Move the docker-compose.yml file to the correct location if necessary
cp docker-compose.yml /opt/my_project/docker-compose.yml

# Start the Docker Compose service
systemctl enable --now docker-compose.service
