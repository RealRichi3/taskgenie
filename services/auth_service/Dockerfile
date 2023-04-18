FROM node:14-alpine

RUN apk add --update redis

WORKDIR /app

COPY v1/package.json .

RUN npm install

COPY v1/ .

EXPOSE 5555

CMD ["sh", "-c", "redis-server & npm run dev"]