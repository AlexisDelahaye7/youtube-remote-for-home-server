# youtube-remote-for-home-server

**TLDR** : This is a simple web app that allows you control a youtube video playing on your home server from a GUI on your phone.

## How it works ?

This app sends SSH commands to your home server to control a youtube video playing on it. It is meant to be used on a local network. 

The video is played in the CLI using [yewtube](https://github.com/mps-youtube/yewtube).
Yewtube requires [VLC](https://github.com/videolan/vlc) to play videos.


## Server side setup

1. Set up Docker on you **media server** follwing the instructions [here](https://docs.docker.com/engine/install/).

2. Copy the Dockerfile (after updating its content) and the API's SSH public key to the desired directory from your local machine to the server.

```bash
scp Dockerfile user@server_ip:~/path/to/your/directory
scp id_ed25519.pub user@server_ip:~/path/to/your/directory
```

3. Build the image using the Dockerfile provided in this repo.

```bash
docker build -t youtube_cli_debian .
```

4. Run the docker image.

```bash
docker run -it --name youtube_cli_container -p 2200:22 youtube_cli_debian /bin/bash
``` 

This should open your container's bash shell as root. You can leave the container's shell without killing it by using `CTRL-P + CTRL-Q`.
You can reattach to the container's shell using `docker attach youtube_cli_container`.

You can now access your container from your local machine using the following command.

```bash
ssh -p 2200 youtube_cli@locahost
```

TODO :

- Find a way to access localhost:2200 from network


- Install VLC
- Install yewtube

## Hints

If you have a firewall on your server, you need to open the port 2200. For example, if you are using ufw, you can run the following command.

```bash
sudo ufw allow 2200
```

If you want to access your server from outside your local network, you need to open and forward the port 2200 to your server. You will have to login to your router admin pannel to do this. For me, it was at 192.168.1.1. Just Google it.