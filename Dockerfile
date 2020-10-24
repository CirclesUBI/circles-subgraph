FROM node:12-slim

WORKDIR /usr/src/subgraph

COPY . .

RUN apt-get update \
    && apt-get install -y gettext-base

RUN npm install \
    && npm run codegen \
    && npm run build

CMD ["npm run create", "npm run deploy"]
