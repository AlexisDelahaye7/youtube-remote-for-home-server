# youtube-remote-for-home-server

**TLDR** : This is a simple web app that allows you control a youtube video playing on your home server from a GUI on your phone.

## How it works ?

This app sends SSH commands to your home server to control a youtube video playing on it. It can be used over the internet through a secure SSH connection.

The video is played in the CLI using [yewtube](https://github.com/mps-youtube/yewtube).
Yewtube requires [VLC](https://github.com/videolan/vlc) to play videos.


## Server side setup

1. Install Docker on you **media server** follwing the instructions [here](https://docs.docker.com/engine/install/).

2. Copy the content of the folder *app/config/docker/server* and the *SSH public key* to the desired directory from your local machine to the **media server**.

```bash
scp app/config/docker/server/* user@server_ip:~/path/to/your/directory
scp app/config/.private/id_ed25519.pub user@server_ip:~/path/to/your/directory
```

3. Build the Dockerfile from the parent folder.

```bash
docker build -t youtube_cli_debian .
```

4. Run the docker image in the background.

```bash
docker run -dit --name youtube_cli_container -p 2200:22 youtube_cli_debian
```

The Docker container is now running in the background on your media server. Every SSH connection to the port 2200 on your media server will be redirected to the port 22 of the container.

```bash
ssh -i /path/to/private/ssh_key youtube_cli@locahost -p 2200
```


## Hints

If you have a firewall on your server, you need to open the port 2200. For example, if you are using ufw, you can run the following command.

```bash
sudo ufw allow 2200
```

If you want to access your server from outside your local network, you need to open and forward the port 2200 to your server. You will have to login to your router admin pannel to do this. For me, it was at 192.168.1.1. Just Google it.

**TODO**

- Install VLC
- Install yewtube or use VLC CLI