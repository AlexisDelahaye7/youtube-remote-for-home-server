import client from "../helpers/client.ssh.js";
import ApiError from "../errors/api.error.js";

export default {
  play: (url) => {
    const command = `yt url "${url}", 1`;

    client.exec(command, (err, stream) => {
      if (err) throw new ApiError("SSH command failed", { statusCode: 500 });
      stream
        .on("close", () => {
          console.log("Stream :: close");
          client.end();
        })
        .on("data", (data) => {
          console.log(`OUTPUT: ${data}`);
        });
    });
  },
};
