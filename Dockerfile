FROM node:22-slim AS build_stage
COPY . /tmp/src
# install some dependencies needed for the build process
RUN apt update && apt install -y build-essential make gcc g++ python3 ca-certificates libc-dev wget git

RUN cd /tmp/src \
    && yarn

FROM node:22-slim
ENV NODE_ENV=production
COPY --from=build_stage /tmp/src/build /build
COPY --from=build_stage /tmp/src/config /config
COPY --from=build_stage /tmp/src/node_modules /node_modules
RUN sh -c 'cd /build/tools; for TOOL in *.js; do LINK="/usr/bin/$(basename $TOOL .js)"; echo -e "#!/bin/sh\ncd /data;\nnode /build/tools/$TOOL \$@" > $LINK; chmod +x $LINK; done'
CMD ["node", "/build/src/discordas.js", "-p", "9005", "-c", "/data/config.yaml", "-f", "/data/discord-registration.yaml"]
EXPOSE 9005
VOLUME ["/data"]
