#!/bin/bash

# Configuration
manifest_file=subgraph.yaml
manifest_tmp_file=.subgraph.tmp.yaml

# Export environment variables from a file
export_env() {
  env_name=$1
  env_file=".env"

  if ! [ -z "$env_name" ]; then
    env_file="$env_file.$env_name"
  fi

  if ! [ -f "$env_file" ]; then
    echo "Error: $env_file not found" >&2
    exit 1
  fi

  set -a
  source $env_file
}

# Create subgraph manifest file with env variables
build_manifest() {
  if ! [ -f "$manifest_file" ]; then
    echo "Error: $manifest_file not found" >&2
    exit 1
  fi

  cat $manifest_file | envsubst > $manifest_tmp_file
}

# Remove the temporarily created subgraph manifest
clear_manifest() {
  if [ -f "$manifest_tmp_file" ]; then
    echo $manifest_tmp_file
  fi
}

# Helper method to run graph-cli commands
exec_graph() {
  debug_flag=""
  access_token=""

  if [ "$IS_DEBUG" == "true" ]; then
    debug_flag=" --debug"
  fi

  if ! [ -z "$ACCESS_TOKEN" ]; then
    access_token=" --access-token $ACCESS_TOKEN"
  fi

  # Build graph arguments
  exec_command=$1
  exec_args=$2

  args="$exec_command $SUBGRAPH_NAME $exec_args$debug_flag$access_token"
  echo "graph $args"

  # Add temporary manifest file when given
  if [ -f "$manifest_tmp_file" ]; then
    args="$args $manifest_tmp_file"
  fi

  # Execute graph command
  ./node_modules/.bin/graph $args
}
