import {
  ENV_LOCATION,
  LOCK_LOCATION,
  RELOAD_LOCATION,
  setupSchema,
} from "../../lib/shared";
import { parse, stringify } from "envfile";
import fs from "fs";
import child_process from "child_process";

const isLocked = () => {
  const fs = require("fs");
  return fs.existsSync(LOCK_LOCATION);
};

export default async function handler(req: any, res: any) {
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

    let originalEnv = {};

    if (fs.existsSync(ENV_LOCATION)) {
      originalEnv = parse(fs.readFileSync(ENV_LOCATION).toString());
    }

    fs.writeFileSync(ENV_LOCATION, stringify(env));
    fs.writeFileSync(LOCK_LOCATION, "");

    // @ts-ignore
    if (originalEnv?.DOMAIN !== env.DOMAIN) {
      try {
        fs.rmdirSync("/etc/letsencrypt/live", { recursive: true });
        fs.rmdirSync("/etc/letsencrypt/renewal", { recursive: true });
        fs.rmdirSync("/etc/letsencrypt/archive", { recursive: true });

        child_process.execSync(
          `certbot certonly --webroot -w /var/www/certbot --agree-tos --cert-name dnsrelay -m "${env.EMAIL}" -d "${env.DOMAIN}" -n`
        );

        fs.existsSync(RELOAD_LOCATION) && fs.unlinkSync(RELOAD_LOCATION);
        fs.writeFileSync(RELOAD_LOCATION, "");
      } catch (e) {}
    }
  }
  res.redirect("/");
}
