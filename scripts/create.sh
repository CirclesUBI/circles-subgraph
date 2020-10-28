#!/bin/bash
set -e

source "./scripts/common.sh"

# Export environment variables
export_env $1

# Create graph
exec_graph create "$SUBGRAPH_NAME --node $GRAPH_ADMIN_NODE_ENDPOINT"
