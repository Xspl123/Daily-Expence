# Base Image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Expose the port the app runs on
EXPOSE 6000

# Command to start the application using PM2 (for auto-restart on crash)
RUN npm install -g pm2

# Start application with PM2
CMD ["pm2-runtime", "app.js"]
