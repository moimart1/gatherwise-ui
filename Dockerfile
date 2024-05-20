FROM node:lts-alpine as dev

ENV NODE_ENV development
ENV HOME /home/user
ENV APP_DIR /app

# Set dev env to $USER, avoid permission denied when run test
ARG USER_UID=1000
RUN mkdir -p $HOME/.npm $APP_DIR/dist && chown -R $USER_UID:$USER_UID $HOME $APP_DIR && \
    # Track current version
    printf "NodeJS: $(node --version)\nNPM: $(npm --version)" > $APP_DIR/BUILD_VERSION

USER $USER_UID
WORKDIR $APP_DIR/

# Add licence and install dependencies
COPY --chown=$USER_UID:$USER_UID .npmrc $APP_DIR/.npmrc
COPY --chown=$USER_UID:$USER_UID package.json $APP_DIR/package.json
COPY --chown=$USER_UID:$USER_UID package-lock.json $APP_DIR/package-lock.json
COPY --chown=$USER_UID:$USER_UID common/package.json $APP_DIR/common/package.json
#COPY --chown=$USER_UID:$USER_UID common/package-lock.json $APP_DIR/common/package-lock.json
RUN npm ci

COPY --chown=$USER_UID:$USER_UID . $APP_DIR/
RUN cat $APP_DIR/BUILD_VERSION && npm run build

ARG APP_FULLVERSION=0.0.0
RUN node scripts/patch-header.js dist/index.html ${APP_FULLVERSION}

# Runtime part #
FROM nginx:stable-alpine as prod
ENV APP_DIR /app
ENV PORT 8080

EXPOSE ${PORT}

RUN mkdir -p $APP_DIR/dist && \
    chown -R nginx:nginx $APP_DIR/dist && chmod -R 755 $APP_DIR && \
    chown -R nginx:nginx /var/cache/nginx && \
    # For PID file
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    # Full access for all users (nginx, test or prod)
    chmod -R 777 /var/run/nginx.pid

COPY --chown=nginx:nginx server/nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY --chown=nginx:nginx server/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=dev $APP_DIR/dist $APP_DIR/dist
COPY --chown=nginx:nginx --from=dev $APP_DIR/BUILD_VERSION /BUILD_VERSION
COPY --chown=nginx:nginx server/version.json $APP_DIR/version.json.template
COPY --chown=nginx:nginx server/40-set-env-var-in-config.sh /docker-entrypoint.d/40-set-env-var-in-config.sh

# Saved args
ARG APP_COMMIT_HASH
ENV APP_COMMIT_HASH=${APP_COMMIT_HASH}
ARG APP_BRANCH_NAME
ENV APP_BRANCH_NAME=${APP_BRANCH_NAME}
ARG APP_BUILD_DATE
ENV APP_BUILD_DATE=${APP_BUILD_DATE}
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}
ARG APP_FULLVERSION
ENV APP_FULLVERSION=${APP_FULLVERSION}

# Eval config with selected environment variable
RUN chmod +x /docker-entrypoint.d/40-set-env-var-in-config.sh && \
    /docker-entrypoint.d/40-set-env-var-in-config.sh && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    # Full access for all users (nginx, test or prod)
    chmod -R 777 /etc/nginx/conf.d/ && \
    chmod -R 777 $APP_DIR/dist/version.json && \
    nginx -t

USER nginx