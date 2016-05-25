FROM node:latest
RUN npm install --production
ADD . /src
WORKDIR /src
EXPOSE 8080
CMD ["node", "/src/index.js"]