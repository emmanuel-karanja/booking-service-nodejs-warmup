FROM node:22

WORKDIR /booking-service-nodejs

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]