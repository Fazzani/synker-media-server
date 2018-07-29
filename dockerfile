FROM node:8-alpine
LABEL maintainer="synker-team@synker.ovh" \
  description="Media Server Synker suite application" \
  system.dist="linux" multi.name="Synker Media Server"
EXPOSE 8000
EXPOSE 1935
#HEALTHCHECK --interval=3m --timeout=1m CMD curl -f http://localhost:8000/api/server || exit 1
WORKDIR /opt/mediaserver
COPY package.json package.json
RUN npm install
COPY ./server ./server

CMD ["npm", "start", "-s"]