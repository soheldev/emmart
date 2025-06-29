# backend/Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Set production environment
ENV NODE_ENV=production

# Expose API port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
