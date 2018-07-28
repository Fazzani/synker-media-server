FROM node:8-8-alpine
LABEL maintainer="synker-team@synker.ovh" \
  description="Media Server Synker suite application" \
  system.dist="linux" multi.name="Synker Media Server"
ENV PORT 8000
ENV PORT_RTMP 1935
EXPOSE 8000
EXPOSE 1935
HEALTHCHECK --interval=3m --timeout=1m CMD curl -f http://localhost:8000 || exit 1
COPY .npmrc .npmrc
COPY package.json package.json
RUN npm install
COPY . .
RUN rm -f .npmrc

CMD ["npm", "start", "-s"]