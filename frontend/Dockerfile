# frontend/Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Run Vite with --host so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
