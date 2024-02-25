FROM node:alpine AS builder
WORKDIR /app
COPY ./api-server/ ./
COPY ./common/ ./common/
RUN npm install
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]