FROM node:8
RUN npm install -g pm2
COPY package.json /src/package.json
RUN cd /src; npm install
COPY . /src
EXPOSE 8080
WORKDIR /src
CMD pm2 start --no-daemon server.js
