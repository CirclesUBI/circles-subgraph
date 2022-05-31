#!/bin/bash
set -e

source "./scripts/common.sh"

# Export environment variables
export_env $1

# Export subgraph version from package.json
get_version

# Prepare manifest
build_manifest

# Auth
exec_graph auth "--product hosted-service"

# Deploy graph
exec_graph deploy "--product hosted-service $SUBGRAPH_NAME --version-label $SUBGRAPH_VERSION"

# Cleanup
clear_manifest
