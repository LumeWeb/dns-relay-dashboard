export const setupSchema = () => {
  const yup = require("yup");
  return yup.object().shape({
    appId: yup.string().required(),
    appSecret: yup.string().required(),
    domain: yup
      .string()
      .required()
      .matches(
        /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
      ),
    email: yup.string().email().required(),
  });
};

export const LOCK_LOCATION = "/data/.lock";
export const ENV_LOCATION = "/data/.env";
export const AUTH_LOCATION = "/data/gundns/auth.json";
