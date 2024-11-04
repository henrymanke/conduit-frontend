## Stage 1: Build Stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Set default environment variable for build configuration
ARG NG_ENV=production
ENV NG_ENV=$NG_ENV

# Create the environment.prod.ts with dynamic values
ARG BACKEND_HOST=backend
ARG BACKEND_PORT=8007
RUN echo "export const environment = { \
  production: true, \
  apiUrl: 'http://${BACKEND_HOST}:${BACKEND_PORT}/api' \
};" > ./src/environments/environment.prod.ts

# Build the Angular app TODO: issue: works only for development
RUN npm run build -- --configuration=${NG_ENV}

## Stage 2: Production Stage
FROM nginx:alpine

# Copy the customised nginx.conf to the correct path
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the previous stage
COPY --from=build /app/dist/* /usr/share/nginx/html

# Expose port 80 to the internet
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
