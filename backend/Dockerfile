FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force --legacy-peer-deps

COPY . .

CMD [ "npm", "start" ]
