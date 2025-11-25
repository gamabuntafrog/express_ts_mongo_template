FROM node:22-slim AS dev
WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm ci

ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]
