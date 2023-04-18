FROM node:16-bullseye-slim as base
WORKDIR /usr/src/subgraph

# Install dependencies
RUN apt-get update \
    && apt-get install -y gettext-base git

# Copy project
COPY . .

# Install NodeJS dependencies
RUN npm ci

# Copy runtime script to root
COPY scripts/run.sh .

CMD ["./run.sh"]
