FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

ENTRYPOINT ["sh", "-c", "npx prisma migrate dev && npm start"]