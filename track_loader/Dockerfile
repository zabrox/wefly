FROM node:alpine AS builder
WORKDIR /app
COPY ./track_loader/ ./
COPY ./common/ ./common/
WORKDIR /app/track_loader
RUN npm install
WORKDIR /app
ENTRYPOINT ["npm", "run", "start"]