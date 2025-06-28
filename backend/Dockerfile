FROM node:18

WORKDIR /app

# Only copy package files first for caching
COPY package*.json ./
RUN npm install

# Then copy the rest
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
