FROM node:12.19
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT [ "npm", "run"]