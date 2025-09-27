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

RUN apk add --no-cache curl bash \
    && curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh


# Expose backend port
EXPOSE 4000

# Start backend in production
CMD ["sh", "-c", "wait-for-it.sh postgres:5432 -- npm run migration:run && npm run start:prod"]