# SSH keys

From the project's root, run the following command to generate a pair of SSH keys.

```bash
ssh-keygen -t ed25519 -C youtube_cli -f app/config/.private/id_ed25519 -P "super secret ssh passphrase"
```

You will get two files out of it :

- id_ed25519 : this is your private key. Keep it secret.
- id_ed25519.pub : this is your public key. You can share it with the world.

To know more about SSH keys, read [this](https://www.ssh.com/ssh/keygen/).