# setup
You have to load the prebuilt image `image`. As it is a decently large file, it is
stored in the 499 google drive under a folder named "peertesting2_image". Download the file and and
load as a local docker image using the command (in the same directory as `image`):

`docker load -i image`

You only need to do this once.

# run
To run the peer testing UI and gentle together automatically, run

`docker compose up`

In the same directory of this README.md and `docker-compose.yml`.

*a gentle container does not need to exist prior to running the above command. `docker-compose.yml` will create a gentle container for you.*