# Electron for Google Chat

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

Docker builds provide a way to build the application for many platforms. The following example uses the 
[electronuserland/builder](https://hub.docker.com/r/electronuserland/builder) images to build the appliations for Linux.

```console
docker run -it --rm -v "$PWD":/project -w /project electronuserland/builder npm run pack

```




