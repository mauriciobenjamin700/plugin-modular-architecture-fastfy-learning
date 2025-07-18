FROM node:24-alpine3.21

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]