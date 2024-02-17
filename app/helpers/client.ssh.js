import { Client } from "ssh2";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ApiError from "../errors/api.error.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client();

client.on("ready", () => {
  console.log("Client :: Ready");
  client.shell((err, stream) => {
    if (err) throw new ApiError();

    stream
      .on("close", () => {
        console.log("Stream :: closed");
        client.end();
      })
      .on("data", (data) => {
        console.log(`OUTPUT: ${data}`);
      });
    stream.write("====");
  });
});

client.connect({
  host: process.env.SSH_IP || "localhost",
  port: process.env.SSH_PORT || 2200,
  type: "publickey",
  username: process.env.USER_NAME,
  privateKey: readFileSync(
    path.resolve(dirname, "../config/.private/id_ed25519"),
    "utf-8",
  ),
  passphrase: process.env.SSH_PASSPHRASE,
});

export default client;
