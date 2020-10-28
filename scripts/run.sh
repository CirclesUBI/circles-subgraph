#!/bin/bash
set -e

# Build and deploy subgraph to graph node
npm run codegen
npm run build
npm run create
npm run deploy
