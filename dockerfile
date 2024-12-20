# Dockerfile for Node.js Express Application
FROM node:16-alpine

WORKDIR /usr/src/app

# Copy app dependency files
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

EXPOSE 3000

# Start the server
CMD ["npm", "start"]
