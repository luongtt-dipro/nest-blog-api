FROM node:lts-alpine

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /app

ENV NODE_ENV=development
COPY package.json yarn.lock ./
RUN yarn

COPY . .

# Run docker-compose will override this command
EXPOSE 3000

CMD [ "yarn", "start:dev" ]