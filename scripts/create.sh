#!/bin/bash

source "./scripts/common.sh"

# Export environment variables
export_env $1

# Export token correct params
get_token --access-token

# Create graph
exec_graph create "$SUBGRAPH_NAME --node $GRAPH_ADMIN_NODE_ENDPOINT $ACCESS_TOKEN_CMD"
