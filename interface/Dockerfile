# Stage 1: Build the React app
FROM node:22 AS build

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of the app's code and build it
COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from the previous stage to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html


# Copy custom nginx config for React Router fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf



# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]