FROM node:18

WORKDIR /usr/src/app/backend


COPY ../ /usr/src/app

COPY ../backend/* .

RUN npm install --force --legacy-peer-deps

RUN pwd; ls -lanh; ls -lanh ../; exit 1

RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
