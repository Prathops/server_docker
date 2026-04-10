FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache curl && npm ci --omit=dev && npm cache clean --force

COPY server.js ./server.js
COPY src ./src

EXPOSE 5000

CMD ["node", "server.js"]
