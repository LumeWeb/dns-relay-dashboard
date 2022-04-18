FROM node:16.14.2-alpine

WORKDIR /app

COPY *.js *.ts *.json *.lock ./
COPY src ./src

# Install all dependencies needed for production build
RUN yarn && yarn build

# Clean
RUN rm -rf node_modules
RUN yarn cache clean

# install production dependencies only
RUN yarn install --production

RUN apk add py-pip gcc make python3-dev musl-dev libffi-dev rust cargo openssl-dev && pip3 install certbot

CMD ["npm","start"]
