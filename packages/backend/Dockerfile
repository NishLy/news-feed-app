# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package.json & lockfile (for workspace)
COPY ../../package.json ../../package-lock.json ./

# Copy backend package.json
COPY ./package.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy backend source code
COPY ./ ./  
COPY .env.example .env

RUN npm run build

# Expose backend port
EXPOSE 4000

# Start backend in production
CMD ["npm", "run", "start:prod"]
