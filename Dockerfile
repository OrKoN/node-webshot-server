FROM node:latest
ADD . /src
WORKDIR /src
RUN npm install --production
EXPOSE 8080
CMD ["node", "/src/index.js"]