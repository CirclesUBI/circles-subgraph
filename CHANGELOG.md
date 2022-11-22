# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2022-11-22

### Changed 

- Add safeSetup event from Gnosis Safe Contract v1.3.0  [#84](https://github.com/CirclesUBI/circles-subgraph/pull/84)
- Enable indexing of Gnosis Safe Contracts v1.1.1+CRC and v1.3.0 versions [#84](https://github.com/CirclesUBI/circles-subgraph/pull/84) 
    
### Changed

## [1.3.2] - 2022-07-08

### Changed

- Update to node v14 [#80](https://github.com/CirclesUBI/circles-subgraph/pull/80)

## [1.3.1] - 2022-06-10

### Fixed

- Update dependencies [#79](https://github.com/CirclesUBI/circles-subgraph/pull/79)

## [1.3.0] - 2022-04-14

### Fixed

- Removed jq from common.sh  [#73](https://github.com/CirclesUBI/circles-subgraph/pull/73)

### Changed

- Update dependencies (including nested): graph-cli, graph-ts, minimist, node-fetch, axios and node-forge [#75](https://github.com/CirclesUBI/circles-subgraph/pull/75)

## [1.2.3] - 2022-04-07

### Fixed

- Removed jq from common.sh

## [1.2.2] - 2022-03-25

### Fixed

- Fix previous tagbuild GH Action

## [1.2.1] - 2022-03-10

### Fixed

- Fix tagbuild GH Action

### Changed

- Update .env example values
- Update truffle version

## [1.2.0] - 2022-02-23

### Fixed

- Update ubuntu version in workflows to ubuntu-18.04
- Remove unnecessary eth calls
- Clean code: Remove unused imports and vars

### Added

- Automate configuration for xdai and poa-sokol
- Add documentation for release for The Graph
- Update contributors and codeo wners

## [1.1.1] - 2021-12-01

### Fixed

- Add `version-label` option to `graph deploy` command [#56](https://github.com/CirclesUBI/circles-subgraph/pull/56)

## [1.1.0] - 2021-12-01

### Changed

- Update dependencies: `graph-cli` and `graph-ts` [#53](https://github.com/CirclesUBI/circles-subgraph/pull/53)
- Update dependencies: `truffle` [#54](https://github.com/CirclesUBI/circles-subgraph/pull/54)

## [1.0.1] - 2021-06-03

### Fixed

- Correctly set `organization` boolean when Safe got freshly created [#46](https://github.com/CirclesUBI/circles-subgraph/pull/46)
- Removing an owner from Safe was deleting the wrong Safe entry [#45](https://github.com/CirclesUBI/circles-subgraph/pull/45)

## [1.0.0] - 2021-04-13

### Added

- Organization events [#32](https://github.com/CirclesUBI/circles-subgraph/pull/32)
- :warning: Introduce new `START_BLOCK` environment variable

### Changed

- :warning: **BREAKING CHANGE** Removed send limits [#41](https://github.com/CirclesUBI/circles-subgraph/pull/41)
