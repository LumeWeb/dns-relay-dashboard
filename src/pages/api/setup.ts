import { ENV_LOCATION, LOCK_LOCATION, setupSchema } from "../../lib/shared";
import { stringify } from "envfile";
import fs from "fs";
import * as compose from "docker-compose";

const isLocked = () => {
  const fs = require("fs");
  return fs.existsSync(LOCK_LOCATION);
};

export default async function handler(req: any, res: any) {
  debugger;
  if (isLocked()) {
    return;
  }
  if (await setupSchema().isValid(req.body)) {
    const env = {
      POCKET_APP_ID: req.body.appId,
      POCKET_APP_KEY: req.body.appSecret,
      DOMAIN: req.body.domain,
      EMAIL: req.body.email,
    };

    fs.writeFileSync(ENV_LOCATION, stringify(env));
    fs.writeFileSync(LOCK_LOCATION, "");

    compose.exec("certbot", [
      "certbot",
      "certonly",
      "--agree-tos",
      "--cert-name",
      "dnsrelay",
      "--email",
      env.EMAIL,
    ]);
  }
  res.redirect("/");
}
