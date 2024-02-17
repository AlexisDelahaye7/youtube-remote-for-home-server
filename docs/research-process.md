# Documented research process

## What took me there ?

After graduating from my web dev bootcamp, in order to develop sharp backend and adminsys skills, I've bought a 2012 ThinkStation running on a four core Xeon. Its first mission was to host our final project. Setting up Nginx and PostgreSQL was a pretty nice start to understand how a server works within a network. But I wanted to go further and used it for other projects such as HomeAssistant, Audio playing over the house and a few other things.

Thing is that I have a pretty decent and old audio system that doesn't support anything else than a cabeled input. I wanted to play music from my phone to the speakers so I brang the cable along the wall and pluged it into the server. Playing music from Spotify using [Spotifyd](https://github.com/Spotifyd/spotifyd) was a 5 minutes job but I wanted to play music from Youtube and other sources as well. I've found [yewtube](https://github.com/mps-youtube/yewtube/) and though it would be a good start.

## The idea

I was thinking about something as simple as a website communicating over HTTP to a REST API. The API would send SSH commands to a docker container on the server to control the "video". The video would be played in the CLI using yewtube, which requires VLC. The audio client would be sent to the server's audio output using pulseaudio TCP protocol. The audio server that receives the audio must be either on the same machine or on a different machine over the local network, and that, for two reasons :

- If my sound system is close enough to the server, I can use the server's audio output.
- If my sound system is too far away from the server (in another room), I can use a Raspberry Pi as bridge that will run a pulseaudio server accessible over the local network.
- During the developement phase, I can use my laptop as the audio server.

## The challenges

Here, I'll be facing a few challenges :

- I've never used Docker before and it seems to be a pretty advanced configuration for a first project. I'll have to learn its architecture and networking.
- Both the API server and the media server will be exposed to the internet. Securing the API is pretty easy using CORS and JWT, but the media server will be a bit more tricky as a SSH connexion will be required and I really don't want it to be used as a backdoor.
- Well, software such as Pulseaudio are complex and its configuration can be a pain in the \*\*\*. If I encounter a bug, I'll have to pray for it not to be part of the almost [thousand bugs that are unresolved yet](https://gitlab.freedesktop.org/pulseaudio/pulseaudio/-/issues).
- yewtube runs as an instance inside the terminal (it's interactive) and I'll have to find a way to control it from the API and I don't know if it's compatible with the [SSH2 npm package](https://www.npmjs.com/package/ssh2). Either way, it has impredictable behavior, exiting a layer when the video ends. So, I'll have to find a way to keep track of yewtube current layer and manage its status from the API in order to navigate in the app correctly. I might be able to use a state machine for that or even directly using VLC.

## The architecture

![project architecture](/docs/assets/project-architecture.svg)

## Let's start !

### Docker setup

#### Docker Networking

sources : [Official doc: Docker Networking](https://docs.docker.com/network/), [Medium article: How containers communicate with host and each other ?](https://towardsdatascience.com/docker-networking-919461b7f498), [NetworkChuck video](https://www.youtube.com/watch?v=bKFMS5C4CG0)

In order to redirect audio from the container to the host over TCP, we'll have to know the IP addresses of each element within the bidge network.

We can get the host ip address using the following command :

```bash
ip -4 -o a| grep docker0 | awk '{print $4}' | cut -d/ -f1
```

On my machine, the output is `172.17.0.1`

We can get the container's ip address using the following command :

```bash
docker ps -q | xargs -n 1 docker inspect --format '{{ .Name }} {{range .NetworkSettings.Networks}} {{.IPAddress}}{{end}}' | sed 's#^/##';
```

On my machine, the output is `172.17.0.2` for the container `youtube_cli-container`
