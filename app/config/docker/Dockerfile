FROM ubuntu:latest

RUN apt update
RUN apt install -y openssh-server \
  supervisor \
  pulseaudio \
  libasound2-dev \
  vlc

#============#
#=== SSHD ===#
#============#

# config sshd
RUN mkdir -p /var/run/sshd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/#AuthorizedKeysFile/AuthorizedKeysFile/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
RUN sed -i 's/UsePAM yes/UsePAM no/' /etc/ssh/sshd_config

# setup pubkey
RUN mkdir -p /home/youtube_cli/.ssh
RUN touch /home/youtube_cli/.ssh/authorized_keys
RUN echo "#youtube_cli_API_SSH_pubkey" >> /home/youtube_cli/.ssh/authorized_keys
COPY id_ed25519.pub /tmp/
RUN cat /tmp/id_ed25519.pub >> /home/youtube_cli/.ssh/authorized_keys && rm /tmp/id_ed25519.pub

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

#=============#
#=== USERS ===#
#=============#

# Change root and youtube_cli passwords (update these lines : password)
RUN echo 'root:password' | chpasswd
WORKDIR /home/youtube_cli
RUN echo "youtube_cli:password" | chpasswd
RUN groupadd -g 1000 youtube_cli
RUN useradd -u 1000 -g youtube_cli -ms /bin/bash youtube_cli
RUN usermod -a -G pulse-access youtube_cli
RUN mkdir -p /home/youtube_cli/.config/pulse
RUN chown -R youtube_cli:youtube_cli /home/youtube_cli/.config/pulse

#==================#
#=== PULSEAUDIO ===#
#==================#

RUN echo 'export PULSE_SERVER=tcp:172.17.0.1:4713' >> /home/youtube_cli/.bashrc
RUN echo 'export PULSE_COOKIE=/home/youtube_cli/.config/pulse/cookie' >> /home/youtube_cli/.bashrc
RUN echo 'source ~/.bashrc' >> /home/youtube_cli/.bash_profile
# Fix pulse daemon quitting
RUN echo "exit-idle-time=-1" >> /etc/pulse/daemon.conf
RUN pulseaudio -D --verbose --disallow-exit

#================#
COPY testsound.mp3 /home/youtube_cli/
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
EXPOSE 22

#===================#
#=== SUPERVISORD ===#
#===================#

# Call supervisord (to run multiple services at runtime)
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]