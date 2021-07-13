# Releasing `circles-subgraph`

Use this checklist to create a new release of `circles-subgraph` and deploy the subgraph to the official The Graph node. All steps are intended to be run from the root directory of the repository.

## Creating a new release

1. Make sure you are currently on the `main` branch, otherwise run `git checkout main`.
2. `git pull` to make sure you haven’t missed any last-minute commits. After this point, nothing else is making it into this version.
3. Read the git history since the last release, for example via `git --no-pager log --oneline --no-decorate v1.0.0^..origin/main` (replace `v1.0.0` with the last published version).
6. Condense the list of changes into something user-readable and write it into the `CHANGELOG.md` file with the release date and version, following the specification here on [how to write a changelog](https://keepachangelog.com/en/1.0.0/). Make sure you add references to the regarding PRs and issues.
7. Commit the `CHANGELOG.md` changes you've just made.
8. Create a git and npm tag based on [semantic versioning](https://semver.org/) using `npm version [major | minor | patch]`.
9. `git push origin main --tags` to push the tag to GitHub.
10. `git push origin main` to push the automatic `package.json` change after creating the tag.
11. [Create](https://github.com/CirclesUBI/circles-subgraph/releases/new) a new release on GitHub, select the tag you've just pushed under *"Tag version"* and use the same for the *"Release title"*. For *"Describe this release"* copy the same information you've entered in `CHANGELOG.md` for this release. See examples [here](https://github.com/CirclesUBI/circles-subgraph/releases).

## Deploy subgraph on "The Graph" node


1. Go to your "The Graph" dashboard at https://thegraph.com/legacy-explorer/dashboard.
2. Copy your *Access Token* from the dashboard (or ask someone in the team).
3. Open `.env` in `circles-subgraph` and change it to the following values:

```env
SUBGRAPH_NAME=circlesubi/circles
SUBGRAPH_NETWORK=xdai

GRAPH_ADMIN_NODE_ENDPOINT=https://api.thegraph.com/deploy/
IPFS_NODE_ENDPOINT=https://api.thegraph.com/ipfs/

ACCESS_TOKEN=<YOUR TOKEN>
IS_DEBUG=false

# This is from when we deployed the Hub contract on xDai
START_BLOCK=12529458

# Manifest variables
HUB_ADDRESS=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543
PROXY_FACTORY_ADDRESS=0x8b4404DE0CaECE4b966a9959f134f0eFDa636156
```

4. Run `npm run codegen`, `npm run build` and `npm run deploy` to deploy the subgraph.
