import ApiError from "../errors/api.error.js";
import logger from "../helpers/logger.js";
import checkPayload from "../helpers/payload.check.js";
import service from "../services/play.service.js";

export default {
  async play(req, res) {
    const payload = req.body;
    const payloadStatus = checkPayload({ type: "playURL" }, payload);
    if (!payloadStatus) {
      throw new ApiError("Payload is not valid", { statusCode: 400 });
    }

    service.play(payload?.id ? payload.id : payload.url);

    res.json(payload);
  },

  async pause(req, res) {
    let playing = true;
    playing = false;
    res.status(200).json({ message: "stream paused" });
  },

  async volumeUp(req, res) {
    const payload = req.body;
    const payloadStatus = checkPayload(
      { type: "volumeUp", value: 100 },
      payload,
    );
    if (!payloadStatus) {
      throw new ApiError("Payload is not valid", { statusCode: 400 });
    }

    res.json(payload);
  },
};
