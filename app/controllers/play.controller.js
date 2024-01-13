import ApiError from '../errors/api.error.js';
import logger from '../helpers/logger.js';
import checkPayload from '../helpers/payload.check.js';
import client from '../config/client.ssh.js';

export default {

  async play(req, res) {
    const payload = req.body;
    const payloadStatus = checkPayload({ type: 'playURL' }, payload);
    if (!payloadStatus) {
      throw new ApiError('Payload is not valid', { statusCode: 400 });
    }

    // client.
    // TODO : ssh to server and play the video

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
