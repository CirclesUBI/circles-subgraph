#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Configuration
env_file=".env"
manifest_file=subgraph.yaml
cd $SCRIPT_DIR 
cd ..
CURRENT_DIR=$PWD
manifest_tmp_file="$CURRENT_DIR/.subgraph.tmp.yaml"
package_json_file="package.json"

# Export environment variables from a file
export_env() {
  if [ -f "$env_file" ]; then
    set -a
    source $env_file
  fi
}

# Export subgraph version from package.json
get_version() {
  if [ "$IS_HOSTED_SERVICE" == "true" ];
  then
    SUBGRAPH_VERSION_CMD=""
  elif [ -f "$package_json_file" ];
  then
    set -a
    SUBGRAPH_VERSION_CMD=v$(grep -A0 "version" $package_json_file |  awk -F\" '{print $4}')
    SUBGRAPH_VERSION_CMD="--version-label $SUBGRAPH_VERSION_CMD"
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
  access_token=""

  if ! [ -z "$2" ]; then
    exec_args=" $2"
  fi
 
if [ "$IS_HOSTED_SERVICE" == "true" ];then
  access_token=" --access-token $ACCESS_TOKEN"
else
  access_token=""
fi
  # Build graph arguments
  exec_command=$1

  args="$exec_command$exec_args"

  # Add temporary manifest file when given
  if [ -f "$manifest_tmp_file" ]; then
    args="$args $manifest_tmp_file"
  fi

  # Execute graph command
  echo "graph $args$access_token"
  ./node_modules/.bin/graph $args
}
