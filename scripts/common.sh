#!/bin/bash

# Configuration
env_file=".env"
manifest_file=subgraph.yaml
manifest_tmp_file="$PWD/.subgraph.tmp.yaml"

# Export environment variables from a file
export_env() {
  if [ -f "$env_file" ]; then
    set -a
    source $env_file
  fi
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
    rm $manifest_tmp_file
  fi
}

# Helper method to run graph-cli commands
exec_graph() {
  exec_args=""

  debug_flag=""
  access_token=""

  if ! [ -z "$2" ]; then
    exec_args=" $2"
  fi

  if [ "$IS_DEBUG" == "true" ]; then
    debug_flag=" --debug"
  fi

  if ! [ -z "$ACCESS_TOKEN" ]; then
    access_token=" --access-token $ACCESS_TOKEN"
  fi

  # Build graph arguments
  exec_command=$1

  args="$exec_command$exec_args"

  # Add temporary manifest file when given
  if [ -f "$manifest_tmp_file" ]; then
    args="$args $manifest_tmp_file"
  fi

  args="$args$debug_flag$access_token"

  # Execute graph command
  echo "graph $args"
  ./node_modules/.bin/graph $args
}
