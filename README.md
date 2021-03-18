<div align="center">
	<img width="80" src="https://raw.githubusercontent.com/CirclesUBI/.github/main/assets/logo.svg" />
</div>

<h1 align="center">circles-subgraph</h1>

<div align="center">
 <strong>
   Circles subgraph for The Graph 
 </strong>
</div>

<br />

<div align="center">
  <!-- Licence -->
  <a href="https://github.com/CirclesUBI/circles-subgraph/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/CirclesUBI/circles-subgraph?style=flat-square&color=%23cc1e66" alt="License" height="18">
  </a>
  <!-- Discourse -->
  <a href="https://aboutcircles.com/">
    <img src="https://img.shields.io/discourse/topics?server=https%3A%2F%2Faboutcircles.com%2F&style=flat-square&color=%23faad26" alt="chat" height="18"/>
  </a>
  <!-- Twitter -->
  <a href="https://twitter.com/CirclesUBI">
    <img src="https://img.shields.io/twitter/follow/circlesubi.svg?label=twitter&style=flat-square&color=%23f14d48" alt="Follow Circles" height="18">
  </a>
</div>

<div align="center">
  <h3>
    <a href="https://handbook.joincircles.net">
      Handbook
    </a>
    <span> | </span>
    <a href="https://github.com/CirclesUBI/circles-subgraph/releases">
      Releases
    </a>
    <span> | </span>
    <a href="https://github.com/CirclesUBI/.github/blob/main/CONTRIBUTING.md">
      Contributing
    </a>
  </h3>
</div>

<br/>

Circles subgraph for [`The Graph`] to fastly query available data in the Circles UBI ecosystem. You can play with GraphQL queries running against the current Circles data in the Graph [`explorer`].

[`The Graph`]: https://thegraph.com
[`explorer`]: https://thegraph.com/explorer/subgraph/circlesubi/circles

## Development

```bash
# Install dependencies
npm install

# Copy env file and edit it according to your needs
cp .env.example .env

# Use graph commands
npm run codegen
npm run build
npm run create
npm run deploy
```

## License

GNU Affero General Public License v3.0 [`AGPL-3.0`]

[`AGPL-3.0`]: https://github.com/CirclesUBI/circles-subgraph/blob/main/LICENSE
