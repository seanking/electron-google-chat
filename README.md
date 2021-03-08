# Electron for Google Chat

## Dependencies

Use the following command to install dependencies.

```console
npm install
``` 

## Run

Use the following command to run a build of the application.

```console
npm run start
```

Command line arguments can be used to start the app for a specific architecture.

```console
npm run start -- --arm64
```

## Build

Use the following command to build the applications.

```console
npm run pack
```

Command line arguments can be used to build for a specific architecture.

```console
npm run pack -- --arm64
```

## Multi-platform Builds

Docker builds provide a way to build the application for many platforms. 

### Linux 

The following example uses the [electronuserland/builder](https://hub.docker.com/r/electronuserland/builder) 
images to build the appliations for Linux.

```console
docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|NPM_|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder

npm install
npm run dist
```

### Windows

The following example uses the [electronuserland/builder](https://hub.docker.com/r/electronuserland/builder) 
images to build the appliations for Windows with the support of [wine](https://en.wikipedia.org/wiki/Wine_(software)).

```console
docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|NPM_|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:wine

npm install
npm run dist -- --win
```
