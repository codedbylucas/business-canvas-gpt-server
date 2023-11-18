FROM node:20
WORKDIR /usr/src/bcm
COPY ./package.json .
RUN npm install --omit=dev
COPY ./dist ./dist