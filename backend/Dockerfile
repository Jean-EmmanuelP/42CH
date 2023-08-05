FROM node:18

WORKDIR /usr/src/app/backend


COPY ../ /usr/src/app/

COPY . .

COPY ../prisma/ /usr/src/app/prisma/

RUN npm install --force --legacy-peer-deps

RUN ls -lanh ../prisma/; ls -lanh ../src/; exit 1

RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
