set dotenv-load

IMAGE_NAME := "ghcr.io/chand1012/vectordb:main"

build:
  deno compile --allow-net --allow-write --allow-read --allow-env --output bin/vectordb main.ts

start:
  bin/vectordb

clean:
  rm -rf bin

dev:
  deno run --allow-net --allow-write --allow-read --allow-env main.ts

# builds the docker image
build-docker:
    #!/bin/bash
    set -euo pipefail
    ARCH=$(uname -m)
    if [ $ARCH = "aarch64" ]; then
      ARCH="arm64"
    fi
    if [ $ARCH = "x86_64" ]; then
      ARCH="amd64"
    fi
    docker build -f docker/Dockerfile.$ARCH -t {{IMAGE_NAME}} .

run-docker:
    docker run -v ./data:/app/data -p 8000:8000 {{IMAGE_NAME}}
