FROM node:12-slim

WORKDIR /usr/src/subgraph

# Install dependencies
RUN apt-get update \
    && apt-get install -y gettext-base

# Copy project
COPY . .

# Install npm dependencies and prepare subgraph
RUN npm install \
    && npm run codegen \
    && npm run build

# Copy runtime scripts into root
COPY scripts/run.sh .

CMD ["./run.sh"]
