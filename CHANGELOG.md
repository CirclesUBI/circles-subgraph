# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
