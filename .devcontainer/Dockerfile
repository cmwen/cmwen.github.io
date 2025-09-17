# Use a Node.js 18 base image
FROM node:18-bullseye

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4321

# Set the default command to run the dev server
CMD ["pnpm", "dev"]
