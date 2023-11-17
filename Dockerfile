FROM node:20
WORKDIR /usr/src/business-canvas-model
COPY ./package.json .
RUN npm install --omit=dev
COPY ./start.sh /usr/src/business-canvas-model/
COPY ./dist ./dist