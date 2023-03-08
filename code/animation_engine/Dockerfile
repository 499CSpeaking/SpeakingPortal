FROM ubuntu:latest

WORKDIR /animation_engine

COPY . .

RUN apt update
RUN apt install -y curl
RUN apt install -y nodejs npm
RUN apt install -y ffmpeg
RUN apt install -y nano
RUN npm install

ENTRYPOINT [ "echo", "thisisthewrongentrypoint" ]