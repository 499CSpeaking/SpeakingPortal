# don't worry too much about this file, it's only for the initial generation, you should use the 
# already-built image

FROM ubuntu:latest

WORKDIR /Demo

COPY . .

RUN apt update && apt install -y ffmpeg curl nodejs npm
#RUN npm install

ENTRYPOINT [ "npm", "start" ]