#!/bin/bash

source "./scripts/common.sh"

# Export environment variables
export_env $1

# Prepare manifest
build_manifest

# Build graph
exec_graph build

# Cleanup
clear_manifest
