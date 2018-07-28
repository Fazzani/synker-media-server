LABEL maintainer="synker-team@synker.ovh" \
  description="Media Server Synker suite application" \
  system.dist="linux" multi.name="Synker Media Server"
EXPOSE 8000
HEALTHCHECK --interval=3m --timeout=1m CMD curl -f http://localhost:8000/liveness || exit 1

COPY .npmrc .npmrc
COPY package.json package.json
COPY . .
RUN rm -f .npmrc

CMD ["npm", "start", "-s"]