# Use Node.js 18
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code into the container
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the application start command
CMD ["npm", "start"]
