FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm ci --verbose --no-progress

COPY . .

EXPOSE 3000

CMD ["npm", "start"]