FROM node:alpine

WORKDIR /app
COPY . .

COPY package.json ./
RUN npm install
RUN npm run build
COPY . .

RUN npm install forever -g
EXPOSE 9000

CMD [ "forever", "dist/server.js" ]
