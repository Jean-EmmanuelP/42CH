FROM node:18

WORKDIR /usr/src/app/backend


COPY ../ /usr/src/app



RUN npm install --force --legacy-peer-deps

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
