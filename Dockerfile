FROM node:12-slim

WORKDIR /usr/src/subgraph

# Install dependencies
RUN apt-get update \
    && apt-get install -y gettext-base git

# Copy project
COPY . .

# Install NodeJS dependencies
RUN npm install

# Copy runtime script to root
COPY scripts/run.sh .

CMD ["./run.sh"]



