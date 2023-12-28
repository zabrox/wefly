FROM node:alpine AS builder
WORKDIR /app
COPY ./ ./
RUN npm install
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]