#!/bin/bash

npx prisma db push &
npm start &
npm run seed:questions &
npm run seed:components &

wait