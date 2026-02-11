FROM node:18-slim

WORKDIR /app

COPY app.js .

CMD ["node", "app.js"]

