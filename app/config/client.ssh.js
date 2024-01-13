import { Client } from 'ssh2';

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const privateKeyPath = path.resolve(__dirname, fs.readFileSync('.private/id_ed25519'));

const dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client();

client
  .on('ready', () => {
    console.log('Client :: ready');
    client.shell((err, stream) => {
      if (err) throw err;
      stream
        .on('close', () => {
          console.log('Stream :: close');
          client.end();
        })
        .on('data', (data) => {
          console.log(`OUTPUT: ${data}`);
        });
      stream.end('ls -l\nexit\n');
    });
  })

  .connect({
    host: '192.168.1.24',
    port: 22,
    username: 'youtube_cli',
    password: 'nag bloated bully snowbound',
    privateKey: readFileSync(path.resolve(dirname, '.private/id_ed25519'), 'utf-8'),
    passphrase: process.env.SSH_PASSPHRASE,
  });

export default client;
