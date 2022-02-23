# Releasing `circles-subgraph`

Use this checklist to create a new release of `circles-subgraph` and deploy the subgraph to the official The Graph node. All steps are intended to be run from the root directory of the repository.

## Creating a new release

1. Make sure you are currently on the `main` branch, otherwise run `git checkout main`.
2. `git pull` to make sure you haven’t missed any last-minute commits. After this point, nothing else is making it into this version.
3. Read the git history since the last release, for example via `git --no-pager log --oneline --no-decorate v1.0.0^..origin/main` (replace `v1.0.0` with the last published version).
4. Condense the list of changes into something user-readable and write it into the `CHANGELOG.md` file with the release date and version, following the specification here on [how to write a changelog](https://keepachangelog.com/en/1.0.0/). Make sure you add references to the regarding PRs and issues.
5. Commit the `CHANGELOG.md` changes you've just made.
6. Create a git and npm tag based on [semantic versioning](https://semver.org/) using `npm version [major | minor | patch]`.
7. `git push origin main --tags` to push the tag to GitHub.
8. `git push origin main` to push the automatic `package.json` change after creating the tag.
9. [Create](https://github.com/CirclesUBI/circles-subgraph/releases/new) a new release on GitHub, select the tag you've just pushed under _"Tag version"_ and use the same for the _"Release title"_. For _"Describe this release"_ copy the same information you've entered in `CHANGELOG.md` for this release. See examples [here](https://github.com/CirclesUBI/circles-subgraph/releases).

## Deploy subgraph on "The Graph" node

1. Go to your "The Graph" dashboard at https://thegraph.com/hosted-service/dashboard.
2. Copy your _Access Token_ from the dashboard (or ask someone in the team).
3. Use the example files prepared for xdai or poa-sokol. Note that you have to edit your Access Token:
   ```bash
   cp .env-xdai.example .env-xdai
   cp .env-poa-sokol.example .env-poa-sokol
   ```
4. Then you can prepare the configuration from the `.env-xdai` or `.env-poa-sokol` files by running:
   ```bash
   npm run prepare:xdai
   npm run prepare:poa-sokol
   ```
5. Run `npm run codegen`, `npm run build` and `npm run deploy` to deploy the subgraph.
