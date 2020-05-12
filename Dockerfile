FROM node:lts-alpine

# If you're experiencing issues with the build not being triggered, try
# updating the system limits:
# ```
# $ docker run --rm --privileged ember-cli sysctl -w fs.inotify.max_user_watches=524288
# ```

# Ports: ember server, livereload, test server
EXPOSE 4200 7020 7357
WORKDIR /app

CMD ['ember', 'server']

RUN apk add -U chromium

RUN npm install -g ember-cli
