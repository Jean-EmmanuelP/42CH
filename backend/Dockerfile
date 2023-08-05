FROM node:18

WORKDIR /usr/src/app/backend

COPY ../ /usr/src/app/

COPY . .

COPY ../prisma/ /usr/src/app/prisma/

RUN ls -lanh /usr/src/app/prisma/; ls -lanh /usr/src/app/prisma/src/; ls -lanh /usr/src/app/prisma/backend/; exit 1

RUN npm install --force --legacy-peer-deps


RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
