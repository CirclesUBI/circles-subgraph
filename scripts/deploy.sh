#!/bin/bash

source "./scripts/common.sh"

# Export environment variables
export_env $1

# Prepare manifest
build_manifest

# Deploy graph
exec_graph deploy "--ipfs $NODE_IPFS --node $NODE_GRAPH"

# Cleanup
clear_manifest
