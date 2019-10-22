# Circles Subgraph

<p>
  <a href="https://opencollective.com/circles">
    <img src="https://opencollective.com/circles/supporters/badge.svg" alt="Backers">
  </a>
  <a href="https://github.com/CirclesUBI/circles-subgraph/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-APGLv3-orange.svg" alt="License">
  </a>
  <a href="https://travis-ci.org/CirclesUBI/circles-subgraph">
    <img src="https://api.travis-ci.com/CirclesUBI/circles-subgraph.svg?branch=development" alt="Build Status">
  </a>
  <a href="https://twitter.com/CirclesUBI">
    <img src="https://img.shields.io/twitter/follow/circlesubi.svg?label=follow+circles" alt="Follow Circles">
  </a>
</p>

Circles subgraph for [The Graph](https://thegraph.com/) to fastly query available data in the Circles UBI ecosystem.

## Development

```
// Install dependencies
npm install

// Copy env file and edit it
cp .env.example .env

// Use graph commands
npm run build
npm run codegen
npm run create
npm run deploy
```

## Deployment

```
npm run deploy:staging
npm run deploy:production
```

## License

GNU Affero General Public License v3.0 `AGPL-3.0`
