#!/bin/sh
# npx prisma migrate deploy --preview-feature
# prisma migrate dev --preview-feature
npx prisma db push
npm run dev &
cd backend
npm start