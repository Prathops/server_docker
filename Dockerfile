FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache curl && npm ci --omit=dev && npm cache clean --force

COPY server.js ./server.js
RUN mkdir -p uploads
COPY src ./src

EXPOSE 5000

CMD ["node", "server.js"]
