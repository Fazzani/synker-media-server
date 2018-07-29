FROM synker/nodejs-ffmpeg:8-alpine
LABEL maintainer="synker-team@synker.ovh" \
      description="Media Server Synker suite application. this image contain nodejs and ffmpeg" \
      system.dist="linux" multi.name="Synker Media Server"

EXPOSE 8000
EXPOSE 1935
ENV PORT 8000
ENV PORT_RTMP 1935
HEALTHCHECK --interval=3m --timeout=1m CMD curl http://localhost:8000/api/server -s -f -o /dev/null || exit -1
WORKDIR /opt/mediaserver
COPY package.json package.json
RUN npm install
COPY ./server ./server

CMD ["npm", "start", "-s"]