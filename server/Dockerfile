FROM node:22-slim 

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
