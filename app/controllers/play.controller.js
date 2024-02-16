import ApiError from '../errors/api.error.js';
import logger from '../helpers/logger.js';
import checkPayload from '../helpers/payload.check.js';
import client from '../helpers/client.ssh.js';

export default {

  async play(req, res) {
    const payload = req.body;
    const payloadStatus = checkPayload({ type: 'playURL' }, payload);
    if (!payloadStatus) {
      throw new ApiError('Payload is not valid', { statusCode: 400 });
    }

    const command = 'yt';

    client.exec(command, (err, stream) => {
      if (err) throw new ApiError('SSH command failed', { statusCode: 500 });

      stream
        .on('close', () => {
          console.log('Stream :: close');
          client.end();
        })
        .on('data', (data) => {
          console.log(`OUTPUT: ${data}`);
        });
      // stream.end('ls -l\nexit\n');
    });
    res.json(payload);
  },

  async volumeUp(req, res) {
    const payload = req.body;
    const payloadStatus = checkPayload({ type: 'volumeUp', value: 100 }, payload);
    if (!payloadStatus) {
      throw new ApiError('Payload is not valid', { statusCode: 400 });
    }

    res.json(payload);
  },

};
