FROM node:18

WORKDIR /usr/src/app/

COPY . .

RUN ls -lanh /usr/src/app/prisma/; ls -lanh /usr/src/app/src/; ls -lanh /usr/src/app/backend/; exit 1

RUN cd backend

RUN npm install --force --legacy-peer-deps


RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
