FROM node:alpine AS builder
WORKDIR /app
COPY ./ ./
RUN npm install
ENTRYPOINT ["node", "./main.js"]