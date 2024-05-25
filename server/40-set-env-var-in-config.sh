#!/usr/bin/env sh
export PORT=${PORT:-8080}
# Now ISO date
export APP_START_DATE=$(TZ=America/Montreal date +"%Y-%m-%dT%H:%M:%S%z")

echo "Port set to $PORT and full version is $APP_FULLVERSION"
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
envsubst '${APP_COMMIT_HASH} ${APP_BRANCH_NAME} ${APP_BUILD_DATE} ${APP_START_DATE} ${APP_VERSION} ${APP_FULLVERSION}' < $APP_DIR/version.json.template > $APP_DIR/dist/version.json