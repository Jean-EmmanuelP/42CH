#!/bin/sh
# npx prisma migrate deploy --preview-feature
# prisma migrate dev --preview-feature
npm run postinstall
npx prisma db push
npm run start