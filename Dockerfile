FROM node:18-bullseye

WORKDIR /usr/src/app

COPY package*.json ./
COPY app.js .

ENV npm_config_jobs=1

RUN npm ci --no-audit --no-fund

EXPOSE 3000

CMD ["node", "app.js"]
