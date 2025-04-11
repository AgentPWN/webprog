FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y wget libnss3 libatk-bridge2.0-0 libxss1 libasound2 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libgtk-3-0

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Move into backend
WORKDIR /usr/src/app/backend

# Install playwright browsers with dependencies
RUN npx playwright install --with-deps

# Expose app port
EXPOSE 2001

# Start app
CMD ["node", "backend.mjs"]
