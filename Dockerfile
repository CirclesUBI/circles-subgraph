FROM node:12-slim

WORKDIR /usr/src/subgraph

COPY . .

RUN apt-get update \
    && apt-get install -y gettext-base

RUN npm install \
    && npm run codegen \
    && npm run build

COPY scripts/run.sh .

CMD ["./run.sh"]
