# Use the Node.js 20 LTS Alpine image as the base image #FROM can be used only once in a Dockerfile
FROM node:20-alpine

# Add metadata labels #LABEL can be used multiple times in a Dockerfile
# LABEL maintainer="OJ Project Team"
# LABEL description="OJ Project Server"
LABEL version="1.0"

# Set environment variables #ENV can be used multiple times in a Dockerfile
ENV NODE_ENV=production \
    PORT=8090

# Set the working directory inside the container #WORKDIR can be used only once in a Dockerfile
WORKDIR /app

# Install dependencies required for building #RUN can be used multiple times in a Dockerfile
RUN apk add g++ python3 openjdk11

# Copy package files #COPY can be used multiple times in a Dockerfile
COPY package*.json ./

# Install dependencies with specific flags for production #RUN can be used multiple times in a Dockerfile
RUN npm install

# Copy the rest of the application code #COPY can be used multiple times in a Dockerfile
COPY . .

# Expose the port #EXPOSE can be used only once in a Dockerfile
EXPOSE 8090

# Specify the command to run when the container starts #CMD can be used only once in a Dockerfile
CMD [ "npm", "start" ]