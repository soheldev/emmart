# docker/web.Dockerfile

# Step 1: Build the frontend
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Step 2: Run with Vite Preview server (no Nginx needed)
FROM node:20-alpine

WORKDIR /app

# Copy built files and necessary packages
COPY --from=builder /app /app

RUN npm install -g serve vite

EXPOSE 3000
CMD ["vite", "preview", "--port", "3000", "--host"]
