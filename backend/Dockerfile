FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD [ "npm", "start" ]
