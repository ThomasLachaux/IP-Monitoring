FROM node:lts-alpine

# Add improved ping command
RUN apk add --no-cache iputils

RUN chown -R node:node /opt
USER node
WORKDIR /opt
ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD npm run start