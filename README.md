# youtube-remote-for-home-server

**TLDR** : This is a simple web app that allows you control a youtube video playing on your home server from a GUI on your phone.

## How it works ?

This app sends SSH commands to your home server to control a youtube video playing on it. It is meant to be used on a local network. 

The video is played in the CLI using [yewtube](https://github.com/mps-youtube/yewtube).
Yewtube requires [VLC](https://github.com/videolan/vlc) to play videos.