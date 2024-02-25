FROM node:alpine AS builder
WORKDIR /app
COPY ./track_loader/ ./
COPY ./common/ ./common/
RUN npm install
ENTRYPOINT ["npm", "run", "start"]