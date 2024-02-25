FROM node:alpine AS builder
WORKDIR /app
COPY ./api-server/ ./
COPY ./common/ ./common/
WORKDIR /app/api-server
RUN npm install
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]