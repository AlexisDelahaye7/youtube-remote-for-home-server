FROM debian:latest

RUN apt update && apt install -y openssh-server && apt install -y supervisor
RUN mkdir -p /var/run/sshd

# Change the root password (update this line : change password)
RUN echo 'root:root_password' | chpasswd

# Allow root login
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Require SSH key to be authorized
RUN sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/#AuthorizedKeysFile/AuthorizedKeysFile/' /etc/ssh/sshd_config

# Create debian user "youtube_cli" (update this line : change password)
RUN useradd -ms /bin/bash youtube_cli
RUN echo "youtube_cli:youtube_cli_password" | chpasswd
WORKDIR /home/youtube_cli

# Add your API SSH public key to the media server authorized_keys file
RUN mkdir -p /home/youtube_cli/.ssh
RUN touch /home/youtube_cli/.ssh/authorized_keys
RUN echo "#youtube_cli_API_SSH_pubkey" >> /home/youtube_cli/.ssh/authorized_keys
COPY id_ed25519.pub /tmp/
RUN cat /tmp/id_ed25519.pub >> /home/youtube_cli/.ssh/authorized_keys && rm /tmp/id_ed25519.pub

# Remove password authentication
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
RUN sed -i 's/UsePAM yes/UsePAM no/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# Open port 22 & run SSH server as deamon
EXPOSE 22

# Call supervisord (to run multiple services at runtime)
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]
