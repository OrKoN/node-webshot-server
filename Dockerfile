FROM node:latest
RUN npm install --production
EXPOSE 8080