#!/bin/bash
set -e

source "./scripts/common.sh"

# Export environment variables
export_env $1

# Export subgraph version from package.json
get_version

# Prepare manifest
build_manifest

# Deploy graph
exec_graph deploy "$SUBGRAPH_NAME --ipfs $IPFS_NODE_ENDPOINT --node $GRAPH_ADMIN_NODE_ENDPOINT  $SUBGRAPH_VERSION_CMD"

# Cleanup
clear_manifest
