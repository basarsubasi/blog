# Use Node.js official image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npx tsc

# Expose port
EXPOSE $BLOG_BACKEND_PORT

# Start the application
CMD ["node", "dist/app.js"]
