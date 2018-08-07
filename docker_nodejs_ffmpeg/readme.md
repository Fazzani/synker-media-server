# Base docker image for HOLO

```sh
sudo docker build -f dockerfile -t synker/nodejs-ffmpeg:latest -t synker/nodejs-ffmpeg:8-alpine .
cat ~/docker_password.txt | sudo docker login --username henifazzani --password-stdin
sudo docker push synker/nodejs-ffmpeg
```