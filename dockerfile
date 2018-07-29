FROM node:8-alpine
LABEL maintainer="synker-team@synker.ovh" \
      description="Media Server Synker suite application. this image contain nodejs and ffmpeg" \
      system.dist="linux" multi.name="Synker Media Server"

ENV FFMPEG_VERSION=3.3.5
RUN apk update && \
    apk upgrade && \
    apk add --update ca-certificates && \
    apk add --no-cache curl \
    apk add gnutls-dev zlib-dev yasm-dev lame-dev libogg-dev \
    x264-dev libvpx-dev libvorbis-dev x265-dev freetype-dev \
    libass-dev libwebp-dev rtmpdump-dev libtheora-dev opus-dev && \
    apk add --no-cache --virtual .build-dependencies \
    build-base coreutils tar bzip2 x264 gnutls nasm && \
    wget -O- http://ffmpeg.org/releases/ffmpeg-${FFMPEG_VERSION}.tar.gz | tar xzC /tmp && \
    cd /tmp/ffmpeg-${FFMPEG_VERSION} && \
    ./configure --bindir="/usr/bin" \
                --enable-version3 \
                --enable-gpl \
                --enable-nonfree \
                --enable-small \
                --enable-libmp3lame \
                --enable-libx264 \
                --enable-libx265 \
                --enable-libvpx \
                --enable-libtheora \
                --enable-libvorbis \
                --enable-libopus \
                --enable-libass \
                --enable-libwebp \
                --enable-librtmp \
                --enable-postproc \
                --enable-avresample \
                --enable-libfreetype \
                --enable-gnutls \
                --disable-debug && \
    make && \
    make install && \
    make distclean && \
    cd $OLDPWD && \
    rm -rf /tmp/ffmpeg-${FFMPEG_VERSION} && \
    apk del --purge .build-dependencies && \
    rm -rf /var/cache/apk/*

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