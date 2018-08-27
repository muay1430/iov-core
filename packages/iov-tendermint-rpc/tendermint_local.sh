#!/bin/bash

# This is like tendermint.sh but uses tendermint from PATH, not docker image
# And designed for local dev runs, not CI

PORT=${TM_PORT:-12345}
export TM_HOME=$(mktemp -d)
export TM_TX_INDEX_INDEX_ALL_TAGS=true

tendermint version
tendermint init
tendermint node \
  --proxy_app=kvstore \
  --rpc.laddr=tcp://0.0.0.0:${PORT} \
  --log_level=state:info,rpc:info,*:error

# add if statement for safety... rm -rf is scary
if [[ -n "${TM_HOME}" ]]; then
  rm -rf "${TM_HOME}"
fi
