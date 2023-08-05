FROM node:18

WORKDIR /usr/src/app/

COPY . .

WORKDIR /usr/src/app/backend/

RUN npm install --force --legacy-peer-deps


RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
