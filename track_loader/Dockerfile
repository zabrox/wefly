FROM node:alpine AS builder
WORKDIR /app
COPY ./ ./
RUN npm install
ENTRYPOINT ["npm", "run", "start"]