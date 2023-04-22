# Speaking Portal
Official Project for Speaking Portal

## Authors

- [@John Elder](https://github.com/justchecking)
- [@Colin Pereira](https://github.com/ZuShi0)
- [@Harshal Patel](https://github.com/Harshal609)
- [@Jake Tyerman](https://github.com/jtyrmn)  

<hr>
<br>

## Pre-Requirements and Installations
<hr>

- NodeJS
    - Download from: https://nodejs.org/en
    - Ensure that it is on your PATH
- FFmpeg
    - Download from: https://ffmpeg.org/download.html
    - Ensure that it is on your PATH
- Gentle Docker Image
    - Docker Desktop can be downloaded here: https://www.docker.com/products/docker-desktop/
    - Ensure that it is on your PATH
    - use `docker run -P 32768:8765 lowerquality/gentle` to install the Docker Image and run it on localhost:32768

<br>

## Running The Main Demo
<hr>

- make sure you have followed the above installation instructions
- clone the repo
- use `npm i` while in code/main to install all node dependencies
- ensure that your gentle docker image is running on localhost:32768
    - if this isn't the case, you can either modify code/main/server.ts to match the port of your docker image, or reinstall the docker image with the right port
- use `npm start` while in code/main to start the node server
- navigate to localhost:4000 in your browser to view the site

<br>

## Other Information
<hr>

- This folder will contain various documents that explain how our systems interact, and how they are configured
- Please read through them to get a clear idea our system architecture
- The demo located in code/main is also provided as an example of how to implement our BE program