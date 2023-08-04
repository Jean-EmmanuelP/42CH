#!/bin/sh
npx prisma migrate deploy --preview-feature
# prisma migrate dev --preview-feature
npm run dev &
cd backend
npm start