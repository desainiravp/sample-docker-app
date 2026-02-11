FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY app.js .

# limit parallel threads (important)
RUN npm install --jobs=1 --no-audit --no-fund

EXPOSE 3000

CMD ["node", "app.js"]

