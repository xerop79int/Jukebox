FROM node

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]




