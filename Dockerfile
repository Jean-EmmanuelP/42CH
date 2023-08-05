FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN rm -Rf backend

RUN npm install --legacy-peer-deps --force

# Expose port 3000
EXPOSE 3000

# RUN npm install prisma --save-dev --legacy-peer-deps --force
RUN npm install @prisma/client@dev prisma@dev --legacy-peer-deps --force

ARG API_URL

ARG NEXT_PUBLIC_API_URL

ENV API_URL=$API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL



RUN npm run build

RUN chmod +x ./entrypoint.sh

# Run the app
CMD [ "./entrypoint.sh" ]