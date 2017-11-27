FROM node:6.12.0

WORKDIR /home/badge-api

COPY app /home/badge-api/app
ADD  package.json /home/badge-api
ADD  swagger.yml /home/badge-api

RUN npm install --production

CMD ["node", "app/index.js"]