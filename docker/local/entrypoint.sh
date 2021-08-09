#!/bin/bash
set -e
npm install
# allow the container to be started with `--user`
if [ "$1" = 'node' ] || [ "$1" = 'nodemon' ]; then
  echo "Updating permissions..."
  chown -R $APP_USER:$APP_USER $HOME
  echo "Executing process..."
  exec gosu $APP_USER:$APP_USER "$@"
fi
exec "$@"
