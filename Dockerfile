FROM node:16.13.1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .


# Expose a port (if your app listens on a specific port)
EXPOSE 3000

# Start the Node.js application
CMD [ "npm", "start" ]
