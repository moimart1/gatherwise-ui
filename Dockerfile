FROM node:lts-alpine as base

ENV NODE_ENV development
ENV PORT 8080

# Create and set working directory
RUN mkdir -p /app/server/client && \
    addgroup user && adduser -D -G user user && \
    chown -R user:user /app/server && \
    # Track current version
    node --version && npm --version

FROM base as server

ENV NODE_ENV production
WORKDIR /app/server

# Install and cache server dependencies
COPY --chown=user:user server/package.json /app/server/package.json
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --production

COPY --chown=user:user server /app/server/

# Client build part #
FROM base as dev

# Set dev env to $USER, avoid permission denied when run test
ARG USER_UID=user
RUN chown -R $USER_UID:$USER_UID /app
USER $USER_UID

WORKDIR /app/

# Add licence and install dependencies
COPY --chown=$USER_UID:$USER_UID .npmrc /app/.npmrc
COPY --chown=$USER_UID:$USER_UID package.json /app/package.json
COPY --chown=$USER_UID:$USER_UID package-lock.json /app/package-lock.json
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install

COPY --chown=$USER_UID:$USER_UID . /app/
RUN npm run build

ARG APP_FULLVERSION=0.0.0
RUN node scripts/patch-header.js dist/index.html ${APP_FULLVERSION}

# Runtime part #
FROM server as prod

USER user

COPY --from=dev --chown=user:user /app/dist /app/server/client
WORKDIR /app/server

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

# Start server
CMD ["node", "index.js"]